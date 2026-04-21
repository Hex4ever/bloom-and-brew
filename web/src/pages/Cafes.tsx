import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ExternalLink, Star } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { CAFES } from "../data";
import { supabase } from "../lib/supabase";

interface CafeResult {
  name: string;
  area: string;
  dist: string;
  rating: number;
  reviewCount?: number;
  tags: string[];
  place_id?: string;
  lat?: number;
  lng?: number;
}

export function Cafes() {
  const navigate = useNavigate();
  const { isDesktop } = useViewport();
  const hasGeo = Boolean(navigator.geolocation);

  const [locating, setLocating] = useState(hasGeo);
  const [cafes, setCafes] = useState<CafeResult[]>([]);
  const [isRealResults, setIsRealResults] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(
    hasGeo ? null : "Geolocation not supported",
  );

  useEffect(() => {
    if (!hasGeo) {
      setCafes(CAFES);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          if (!token) throw new Error("No session");

          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cafes-nearby`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ lat, lng }),
            },
          );

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const results: CafeResult[] = await res.json();

          if (results.length > 0) {
            setCafes(results);
            setIsRealResults(true);
          } else {
            setCafes(CAFES);
            setLocationError("No specialty cafes found nearby · showing curated list");
          }
        } catch {
          setCafes(CAFES);
          setLocationError("Could not load nearby cafes · showing curated list");
        }
        setLocating(false);
      },
      () => {
        setCafes(CAFES);
        setLocationError("Showing demo cafes — enable location for nearby results");
        setLocating(false);
      },
      { timeout: 8000 },
    );
  }, [hasGeo]);

  const openInMaps = (cafe: CafeResult) => {
    if (cafe.lat != null && cafe.lng != null) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${cafe.lat},${cafe.lng}&query_place_id=${cafe.place_id ?? ""}`,
        "_blank",
      );
    } else {
      const q = encodeURIComponent(`${cafe.name} ${cafe.area}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
    }
  };

  return (
    <div>
      <Header title="Cafes Near Me" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Specialty coffee</div>
            <div style={{ fontSize: 12, color: T.creamDim }}>
              {locating
                ? "Finding cafes near you..."
                : isRealResults
                ? "Speciality coffee near you · sorted by distance"
                : "Demo locations · tap to open in Maps"}
            </div>
          </div>
          <div style={{ color: T.accent }}><MapPin size={20} /></div>
        </div>

        {locationError && (
          <div style={{ background: T.bg2, border: `1px dashed ${T.line}`, padding: "12px 16px", borderRadius: 12, fontSize: 11, color: T.creamDim, marginBottom: 18 }}>
            {locationError}
          </div>
        )}

        {locating ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, margin: "0 auto", borderRadius: "50%", border: `2px solid ${T.line}`, borderTopColor: T.accent, animation: "spin-slow 0.9s linear infinite" }} />
            <div style={{ fontSize: 12, color: T.creamDim, marginTop: 16, letterSpacing: "0.1em" }}>SCANNING THE NEIGHBORHOOD</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
            {cafes.map((c, i) => (
              <button
                key={c.place_id ?? i}
                onClick={() => openInMaps(c)}
                className="fade-up"
                style={{
                  padding: "20px 22px", background: T.bg2, border: `1px solid ${T.line}`,
                  borderRadius: 16, animationDelay: `${i * 50}ms`, color: T.cream,
                  textAlign: "left", fontFamily: FONT, cursor: "pointer", transition: "border-color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = T.accent)}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = T.line)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                      {c.name} <ExternalLink size={11} color={T.creamDim} />
                    </div>
                    <div style={{ fontSize: 11, color: T.creamDim, display: "flex", gap: 8 }}>
                      <span>{c.area}</span><span>·</span><span>{c.dist}</span>
                    </div>
                  </div>
                  {c.rating > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.accent, fontSize: 12 }}>
                        <Star size={11} color={T.accent} /> {c.rating}
                      </div>
                      {c.reviewCount != null && (
                        <div style={{ fontSize: 10, color: T.creamDim, letterSpacing: "0.05em" }}>
                          {c.reviewCount >= 1000
                            ? `${(c.reviewCount / 1000).toFixed(1)}k reviews`
                            : `${c.reviewCount} reviews`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                  {c.tags.map((tag) => <Pill key={tag} dim>{tag}</Pill>)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
