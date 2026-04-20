import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true);
    const { error: err } = await signUp(email, password, name);
    setBusy(false);
    if (err) { setError(err); return; }
    setDone(true);
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
            Create your account
          </div>
        </div>

        {done ? (
          <div style={{
            textAlign: "center", padding: "28px 20px",
            background: T.bg2, borderRadius: 14, border: `1px solid ${T.line}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>☕</div>
            <div style={{ color: T.cream, fontSize: 17, marginBottom: 8 }}>Almost there!</div>
            <div style={{ color: T.creamDim, fontSize: 13, lineHeight: 1.6 }}>
              Check your inbox for a confirmation link, then{" "}
              <span
                onClick={() => navigate("/signin", { replace: true })}
                style={{ color: T.accent, cursor: "pointer", fontWeight: 500 }}
              >
                sign in
              </span>.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text" placeholder="Your name" value={name} required
              onChange={e => setName(e.target.value)} style={input}
              autoComplete="name"
            />
            <input
              type="email" placeholder="Email" value={email} required
              onChange={e => setEmail(e.target.value)} style={input}
              autoComplete="email"
            />
            <input
              type="password" placeholder="Password (min 8 chars)" value={password} required
              onChange={e => setPassword(e.target.value)} style={input}
              autoComplete="new-password"
            />
            {error && (
              <div style={{ fontSize: 13, color: "#e07070", padding: "8px 12px", background: "#2a1414", borderRadius: 8 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={busy} style={btn(busy)}>
              {busy ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}

        {!done && (
          <div style={{ textAlign: "center", marginTop: 32, color: T.creamDim, fontSize: 13 }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: T.accent, textDecoration: "none", fontWeight: 500 }}>
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
