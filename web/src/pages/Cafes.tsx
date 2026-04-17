import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ExternalLink, Star } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { CAFES } from "../data";

export function Cafes() {
  const navigate = useNavigate();
  const { isDesktop } = useViewport();
  const [locating, setLocating] = useState(true);
  const [hasRealLocation, setHasRealLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => { setHasRealLocation(true); setLocating(false); },
      () => { setLocationError("Showing demo cafes — enable location for nearby results"); setLocating(false); },
      { timeout: 6000 },
    );
  }, []);

  const openInMaps = (name: string, area: string) => {
    const q = encodeURIComponent(`${name} ${area} Bangalore`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
  };

  return (
    <div>
      <Header title="Cafes Near Me" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Specialty coffee</div>
            <div style={{ fontSize: 12, color: T.creamDim }}>
              {locating ? "Finding cafes near you..." : hasRealLocation ? "Sorted by distance · tap to navigate" : "Demo locations · tap to open in Maps"}
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
            {CAFES.map((c, i) => (
              <button
                key={i}
                onClick={() => openInMaps(c.name, c.area)}
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
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.accent, fontSize: 12 }}>
                    <Star size={11} color={T.accent} /> {c.rating}
                  </div>
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
