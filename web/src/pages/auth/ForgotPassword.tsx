import { useState } from "react";
import { Link } from "react-router-dom";
import { T, FONT } from "../../styles/theme";
import { useAuth } from "../../AuthContext";

const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: T.bg3, border: `1px solid ${T.line}`,
  borderRadius: 10, padding: "12px 14px",
  color: T.cream, fontFamily: FONT, fontSize: 15,
  outline: "none",
};

const btn = (disabled: boolean): React.CSSProperties => ({
  width: "100%", padding: "13px 0",
  background: disabled ? T.espresso : T.accent,
  color: disabled ? T.creamDim : T.bg,
  border: "none", borderRadius: 12,
  fontFamily: FONT, fontSize: 15, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background 0.15s",
});

export function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [busy, setBusy]   = useState(false);
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: err } = await resetPassword(email);
    setBusy(false);
    if (err) { setError(err); return; }
    setSent(true);
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
            Bloom &amp; Brew
          </div>
          <div style={{ fontSize: 26, color: T.cream, fontWeight: 300, letterSpacing: "-0.01em" }}>
            Reset password
          </div>
        </div>

        {sent ? (
          <div style={{
            textAlign: "center", padding: "24px 16px",
            background: T.bg2, borderRadius: 12, border: `1px solid ${T.line}`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
            <div style={{ color: T.cream, marginBottom: 6 }}>Link sent</div>
            <div style={{ color: T.creamDim, fontSize: 13 }}>
              Check <strong style={{ color: T.cream }}>{email}</strong> for a password reset link.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ color: T.creamDim, fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>
              Enter your email and we'll send a reset link.
            </div>
            <input
              type="email" placeholder="Email" value={email} required
              onChange={e => setEmail(e.target.value)} style={input}
              autoComplete="email"
            />
            {error && (
              <div style={{ fontSize: 13, color: "#e07070", padding: "8px 12px", background: "#2a1414", borderRadius: 8 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={busy} style={btn(busy)}>
              {busy ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: 32, color: T.creamDim, fontSize: 13 }}>
          <Link to="/signin" style={{ color: T.accent, textDecoration: "none", fontWeight: 500 }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
