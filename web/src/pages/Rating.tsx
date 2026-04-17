import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../styles/theme";
import { useViewport, primaryBtn } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { ScoreSlider } from "../components";
import { useAppContext } from "../AppContext";
import { SCORE_AXES } from "../data";

export function Rating() {
  const navigate = useNavigate();
  const { pendingBrew, setPendingBrew, brewLog, setBrewLog } = useAppContext();
  const { isDesktop } = useViewport();

  const [scores, setScores] = useState({
    sweetness: 5, acidity: 5, body: 5, bitterness: 3, aftertaste: 5, overall: 7,
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!pendingBrew) navigate("/journal", { replace: true });
  }, [pendingBrew, navigate]);

  if (!pendingBrew) return null;

  const setScore = (k: string, v: number) => setScores((prev) => ({ ...prev, [k]: v }));

  const save = () => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const entry = {
      id: pendingBrew.existingId ?? Date.now().toString(),
      recipeId:    pendingBrew.recipeId,
      recipeTitle: pendingBrew.recipeTitle,
      method:      pendingBrew.method,
      bean:        pendingBrew.bean,
      grinder:     pendingBrew.grinder,
      date:        today,
      dose:        pendingBrew.dose,
      water:       pendingBrew.water,
      temp:        pendingBrew.temp,
      clicks:      pendingBrew.clicks,
      scores: {
        sweetness:  scores.sweetness,
        acidity:    scores.acidity,
        body:       scores.body,
        bitterness: scores.bitterness,
        aftertaste: scores.aftertaste,
        overall:    scores.overall,
      },
      notes,
      quickLogged: false,
    };

    if (pendingBrew.existingId) {
      setBrewLog(brewLog.map((e) => e.id === pendingBrew.existingId ? entry : e));
    } else {
      setBrewLog([entry, ...brewLog]);
    }
    setPendingBrew(null);
    navigate("/journal");
  };

  return (
    <div>
      <Header title="Log This Brew" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 720 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>
          How did it taste?
        </div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 26 }}>
          {pendingBrew.recipeTitle} · {pendingBrew.bean}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
          {pendingBrew.dose  != null && <Pill dim>{pendingBrew.dose}g coffee</Pill>}
          {pendingBrew.water != null && <Pill dim>{pendingBrew.water}g water</Pill>}
          {pendingBrew.temp  != null && <Pill dim>{pendingBrew.temp}°C</Pill>}
          {pendingBrew.clicks != null && <Pill dim>{pendingBrew.clicks} clicks</Pill>}
        </div>

        {/* Score sliders */}
        <div style={{ display: "grid", gap: 18, marginBottom: 26 }}>
          {SCORE_AXES.map((axis) => (
            <ScoreSlider
              key={axis.key}
              axis={axis}
              value={scores[axis.key]}
              onChange={(v) => setScore(axis.key, v)}
            />
          ))}
        </div>

        {/* Overall */}
        <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 4 }}>OVERALL</div>
              <div style={{ fontSize: 12, color: T.creamDim }}>How much did you enjoy this cup?</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 200, color: T.accent }}>{scores.overall}</div>
          </div>
          <input type="range" min="1" max="10" value={scores.overall}
            onChange={(e) => setScore("overall", +e.target.value)}
            style={{ width: "100%", accentColor: T.accent }} />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 8 }}>NOTES</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bright peaks, slightly thin body, faded too quickly..."
            style={{ width: "100%", background: T.bg2, border: `1px solid ${T.line}`, color: T.cream, padding: "14px 16px", borderRadius: 12, fontSize: 14, outline: "none", minHeight: 100, resize: "none" }}
          />
        </div>

        <button onClick={save} style={{ ...primaryBtn, width: "100%" }}>Save to journal</button>
      </div>
    </div>
  );
}
