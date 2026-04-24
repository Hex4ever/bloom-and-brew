import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { T, FONT } from "../../styles/theme";
import { useAuth } from "../../AuthContext";

type Tab = "signin" | "signup";

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

const googleBtn: React.CSSProperties = {
  width: "100%", padding: "13px 0",
  background: T.bg2, border: `1px solid ${T.line}`,
  borderRadius: 12, color: T.cream,
  fontFamily: FONT, fontSize: 15,
  cursor: "pointer", display: "flex", alignItems: "center",
  justifyContent: "center", gap: 10,
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: T.line }} />
      <span style={{ fontSize: 11, color: T.creamDim, letterSpacing: "0.1em" }}>OR</span>
      <div style={{ flex: 1, height: 1, background: T.line }} />
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div style={{ fontSize: 13, color: "#e07070", padding: "8px 12px", background: "#2a1414", borderRadius: 8 }}>
      {msg}
    </div>
  );
}

export function SignIn() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [tab, setTab] = useState<Tab>("signin");

  // Sign in state
  const [siEmail, setSiEmail]       = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign up state
  const [suName, setSuName]         = useState("");
  const [suEmail, setSuEmail]       = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suDone, setSuDone]         = useState(false);

  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchTab(t: Tab) {
    setTab(t);
    setError(null);
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: err } = await signIn(siEmail, siPassword);
    setBusy(false);
    if (err) { setError(err); return; }
    navigate("/", { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (suPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true);
    const { error: err } = await signUp(suEmail, suPassword, suName);
    setBusy(false);
    if (err) { setError(err); return; }
    setSuDone(true);
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
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", background: T.bg2,
          borderRadius: 10, padding: 4, marginBottom: 28,
          border: `1px solid ${T.line}`,
        }}>
          {(["signin", "signup"] as Tab[]).map(t => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex: 1, padding: "9px 0",
              background: tab === t ? T.bg3 : "transparent",
              border: tab === t ? `1px solid ${T.line}` : "1px solid transparent",
              borderRadius: 8, color: tab === t ? T.cream : T.creamDim,
              fontFamily: FONT, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
            }}>
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* ── Sign In tab ── */}
        {tab === "signin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="email" placeholder="Email" value={siEmail} required
                onChange={e => setSiEmail(e.target.value)} style={inputStyle}
                autoComplete="email"
              />
              <input
                type="password" placeholder="Password" value={siPassword} required
                onChange={e => setSiPassword(e.target.value)} style={inputStyle}
                autoComplete="current-password"
              />
              {error && <ErrorBanner msg={error} />}
              <button type="submit" disabled={busy} style={btnStyle(busy)}>
                {busy ? "Signing in…" : "Sign In"}
              </button>
              <div style={{ textAlign: "right" }}>
                <Link to="/forgot-password" style={{ fontSize: 13, color: T.creamDim, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
            </form>
            <Divider />
            <button onClick={() => void signInWithGoogle()} style={googleBtn}>
              <GoogleIcon /> Continue with Google
            </button>
          </div>
        )}

        {/* ── Sign Up tab ── */}
        {tab === "signup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {suDone ? (
              <div style={{
                textAlign: "center", padding: "28px 20px",
                background: T.bg2, borderRadius: 14, border: `1px solid ${T.line}`,
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>☕</div>
                <div style={{ color: T.cream, fontSize: 17, marginBottom: 8 }}>Almost there!</div>
                <div style={{ color: T.creamDim, fontSize: 13, lineHeight: 1.6 }}>
                  We sent a confirmation link to{" "}
                  <strong style={{ color: T.cream }}>{suEmail}</strong>.
                  Click it and you'll be signed in automatically.
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input
                    type="text" placeholder="Your name" value={suName} required
                    onChange={e => setSuName(e.target.value)} style={inputStyle}
                    autoComplete="name"
                  />
                  <input
                    type="email" placeholder="Email" value={suEmail} required
                    onChange={e => setSuEmail(e.target.value)} style={inputStyle}
                    autoComplete="email"
                  />
                  <input
                    type="password" placeholder="Password (min 8 chars)" value={suPassword} required
                    onChange={e => setSuPassword(e.target.value)} style={inputStyle}
                    autoComplete="new-password"
                  />
                  {error && <ErrorBanner msg={error} />}
                  <button type="submit" disabled={busy} style={btnStyle(busy)}>
                    {busy ? "Creating account…" : "Create Account"}
                  </button>
                </form>
                <Divider />
                <button onClick={() => void signInWithGoogle()} style={googleBtn}>
                  <GoogleIcon /> Sign up with Google
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
