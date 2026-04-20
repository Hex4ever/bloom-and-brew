import { Navigate, Outlet } from "react-router-dom";
import { T, FONT } from "../styles/theme";
import { useAuth } from "../AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, color: T.creamDim, fontSize: 13,
      }}>
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  return <Outlet />;
}
