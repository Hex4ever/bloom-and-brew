import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { T, FONT } from "../../styles/theme";
import { supabase } from "../../lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: T.bg3, border: `1px solid ${T.line}`,
  borderRadius: 10, padding: "12px 14px",
  color: T.cream, fontFamily: FONT, fontSize: 15,
  outline: "none",
};

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%", padding: "13px 0",
  background: disabled ? T.espresso : T.accent,
  color: disabled ? T.creamDim : T.bg,
  border: "none", borderRadius: 12,
  fontFamily: FONT, fontSize: 15, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background 0.15s",
});

export function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady]       = useState(false);  // true once PASSWORD_RECOVERY fires
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    // Supabase processes the reset token in the URL and fires PASSWORD_RECOVERY.
    // We also check getSession() in case the event fired before this component mounted.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => navigate("/", { replace: true }), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, padding: "24px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.18em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>
            BeyondPours
          </div>
          <div style={{ fontSize: 26, color: T.cream, fontWeight: 300, letterSpacing: "-0.01em" }}>
            Set new password
          </div>
        </div>

        {done ? (
          <div style={{
            textAlign: "center", padding: "28px 20px",
            background: T.bg2, borderRadius: 14, border: `1px solid ${T.line}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>✓</div>
            <div style={{ color: T.cream, fontSize: 17, marginBottom: 8 }}>Password updated!</div>
            <div style={{ color: T.creamDim, fontSize: 13 }}>Taking you to the app…</div>
          </div>
        ) : !ready ? (
          <div style={{
            textAlign: "center", padding: "28px 20px",
            background: T.bg2, borderRadius: 14, border: `1px solid ${T.line}`,
          }}>
            <div style={{ color: T.creamDim, fontSize: 13 }}>Verifying reset link…</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="password" placeholder="New password (min 8 chars)" value={password} required
              onChange={e => setPassword(e.target.value)} style={inputStyle}
              autoComplete="new-password"
            />
            <input
              type="password" placeholder="Confirm new password" value={confirm} required
              onChange={e => setConfirm(e.target.value)} style={inputStyle}
              autoComplete="new-password"
            />
            {error && (
              <div style={{ fontSize: 13, color: "#e07070", padding: "8px 12px", background: "#2a1414", borderRadius: 8 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={busy} style={btnStyle(busy)}>
              {busy ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
