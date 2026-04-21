import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const SEARCH_RADIUS_M = 5000;
// Bucket incoming coordinates to ~1km grid cells so nearby requests share cache entries
const GRID_PRECISION = 2; // 2 decimal places ≈ 1.1 km

interface PlaceResult {
  name: string;
  area: string;
  dist: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  place_id: string;
  lat: number;
  lng: number;
}

const MIN_REVIEW_COUNT = 50;

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  shortFormattedAddress?: string;
  location?: { latitude: number; longitude: number };
  primaryTypeDisplayName?: { text: string };
  editorialSummary?: { text: string };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function extractTags(place: GooglePlace): string[] {
  const tags: string[] = [];
  const summary = (place.editorialSummary?.text ?? "").toLowerCase();
  const type = (place.primaryTypeDisplayName?.text ?? "").toLowerCase();

  if (summary.includes("pour over") || summary.includes("pourover")) tags.push("Pour Over");
  if (summary.includes("espresso")) tags.push("Espresso");
  if (summary.includes("single origin")) tags.push("Single Origin");
  if (summary.includes("cold brew")) tags.push("Cold Brew");
  if (summary.includes("specialty")) tags.push("Specialty");
  if (summary.includes("roaster") || summary.includes("roastery")) tags.push("Roastery");
  if (summary.includes("filter")) tags.push("Filter");
  if (type.includes("cafe") || type.includes("coffee")) tags.push("Café");

  return tags.length ? tags : ["Coffee"];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authErr } = await userClient.auth.getUser();
  if (authErr || !user) return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: { lat?: number; lng?: number };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request — invalid JSON", { status: 400, headers: CORS_HEADERS });
  }

  const { lat, lng } = body;
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid lat/lng" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  }

  // ── Check cache (bucket to grid cell) ──────────────────────────────────────
  // Cache key prefix changed from "grid_" to "specialty_" to invalidate old searchNearby results
  const bucketLat = parseFloat(lat.toFixed(GRID_PRECISION));
  const bucketLng = parseFloat(lng.toFixed(GRID_PRECISION));

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const cutoff = new Date(Date.now() - CACHE_TTL_MS).toISOString();
  const { data: cached } = await serviceClient
    .from("cafes_cache")
    .select("data, cached_at")
    .eq("lat", bucketLat)
    .eq("lng", bucketLng)
    .eq("place_id", `specialty_${bucketLat}_${bucketLng}`)
    .gt("cached_at", cutoff)
    .maybeSingle();

  if (cached?.data) {
    return new Response(JSON.stringify(cached.data), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  // ── Call Google Places API (New) ────────────────────────────────────────────
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Google Places API key not configured" }),
      { status: 503, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  }

  let googleData: { places?: GooglePlace[] };
  try {
    const gRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.rating,places.userRatingCount,places.shortFormattedAddress,places.location,places.primaryTypeDisplayName,places.editorialSummary",
      },
      body: JSON.stringify({
        textQuery: "speciality coffee",
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: SEARCH_RADIUS_M,
          },
        },
        rankPreference: "DISTANCE",
      }),
    });

    if (!gRes.ok) {
      const errText = await gRes.text();
      return new Response(
        JSON.stringify({ error: `Google Places error: ${errText}` }),
        { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    googleData = await gRes.json();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  }

  // ── Shape + filter results ───────────────────────────────────────────────────
  const places: PlaceResult[] = (googleData.places ?? [])
    .filter((p) => (p.userRatingCount ?? 0) >= MIN_REVIEW_COUNT)
    .map((p) => {
      const placeLat = p.location?.latitude ?? lat;
      const placeLng = p.location?.longitude ?? lng;
      const km = haversineKm(lat, lng, placeLat, placeLng);
      const distStr = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

      // Use the second-to-last address component as the neighbourhood/area
      const addrParts = (p.shortFormattedAddress ?? "").split(",");
      const area = addrParts.length > 1 ? addrParts[addrParts.length - 2].trim() : addrParts[0].trim();

      return {
        name: p.displayName?.text ?? "Unknown",
        area,
        dist: distStr,
        rating: p.rating ?? 0,
        reviewCount: p.userRatingCount ?? 0,
        tags: extractTags(p),
        place_id: p.id,
        lat: placeLat,
        lng: placeLng,
      };
    });

  // ── Upsert to cache ──────────────────────────────────────────────────────────
  await serviceClient.from("cafes_cache").upsert(
    {
      lat: bucketLat,
      lng: bucketLng,
      place_id: `specialty_${bucketLat}_${bucketLng}`,
      data: places,
      cached_at: new Date().toISOString(),
    },
    { onConflict: "place_id" },
  );

  return new Response(JSON.stringify(places), {
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
});
