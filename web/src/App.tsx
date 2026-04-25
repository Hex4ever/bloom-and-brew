import { createBrowserRouter, RouterProvider, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./AppContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { BottomNav } from "./components/BottomNav";
import { Sidebar } from "./components/Sidebar";
import { SettingsModal } from "./components/SettingsModal";
import { BrewPill } from "./components/BrewPill";
import { MusicPlayer } from "./components/MusicPlayer";
import { RequireAuth } from "./components/RequireAuth";
import { useViewport } from "./components/ui";
import type { NavScreen } from "./components/BottomNav";
import type { SidebarScreen } from "./components/Sidebar";
import { SignIn } from "./pages/auth/SignIn";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Landing } from "./pages/Landing";
import {
  Dashboard,
  MethodPicker,
  Setup,
  RecipeList,
  Brew,
  Rating,
  Journal,
  Tweak,
  Discover,
  Cafes,
  Glossary,
  Community,
  SubmitRecipe,
  BeanLog,
  ScanBean,
  Notifications,
} from "./pages";

// ─── Screen name ↔ path mapping ──────────────────────────────────────────────

const SCREEN_TO_PATH: Record<string, string> = {
  welcome:  "/home",
  methods:  "/methods",
  setup:    "/setup",
  recipes:  "/recipes",
  brew:     "/brew",
  journal:  "/journal",
  discover: "/discover",
  cafes:    "/cafes",
  beans:    "/beans",
  feed:          "/community",
  notifications: "/notifications",
  glossary:      "/glossary",
};

const PATH_TO_SCREEN: Record<string, string> = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([k, v]) => [v, k]),
);

// Screens where BottomNav is hidden on mobile
const NO_BOTTOM_NAV = new Set(["/home"]);

// ─── Layout ───────────────────────────────────────────────────────────────────

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDesktop } = useViewport();
  const { settings, setSettings, settingsOpen, setSettingsOpen, unreadNotifCount } = useAppContext();
  const { signOut } = useAuth();

  const currentScreen = PATH_TO_SCREEN[location.pathname] ?? location.pathname.slice(1);
  const showBottomNav = !isDesktop && !NO_BOTTOM_NAV.has(location.pathname);

  const go = (screen: NavScreen | SidebarScreen) => {
    // "Brew" nav item enters the flow at /setup (beans → grinder → method → recipes)
    const target = screen === "methods" ? "setup" : screen;
    const path = SCREEN_TO_PATH[target] ?? `/${target}`;
    navigate(path);
  };

  if (isDesktop) {
    return (
      <div style={{
        fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
        background: "#0a0807", color: "#ebe0c8",
        height: "100vh", overflow: "hidden", display: "flex", letterSpacing: "0.01em",
      }}>
        <Sidebar screen={currentScreen} go={go} openSettings={() => setSettingsOpen(true)} unreadNotifCount={unreadNotifCount} />
        <div style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 1100, position: "relative" }}>
            <div className="fade-up" key={location.pathname}>
              <Outlet />
            </div>
          </div>
        </div>
        <BrewPill />
        <MusicPlayer />
        {settingsOpen && (
          <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} onSignOut={() => { void signOut(); setSettingsOpen(false); }} />
        )}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
      background: "#0a0807", color: "#ebe0c8",
      minHeight: "100vh", display: "flex", justifyContent: "center", letterSpacing: "0.01em",
    }}>
      <div style={{
        width: "100%", maxWidth: 440, minHeight: "100vh", background: "#0a0807",
        position: "relative", paddingBottom: 80,
        borderLeft: "1px solid #2a2421", borderRight: "1px solid #2a2421",
      }}>
        <div className="fade-up" key={location.pathname}>
          <Outlet />
        </div>
        {showBottomNav && <BottomNav screen={currentScreen} go={go} openSettings={() => setSettingsOpen(true)} unreadNotifCount={unreadNotifCount} />}
      </div>
      <BrewPill />
      <MusicPlayer />
      {settingsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} onSignOut={() => { void signOut(); setSettingsOpen(false); }} />
      )}
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Public routes ──
  { path: "/",               element: <Landing /> },
  { path: "/signin",         element: <SignIn /> },
  { path: "/signup",         element: <Navigate to="/signin" replace /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password",  element: <ResetPassword /> },

  // ── Protected app routes ──
  {
    element: (
      <AppProvider>
        <RequireAuth />
      </AppProvider>
    ),
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/home",       element: <Dashboard /> },
          { path: "/methods",    element: <MethodPicker /> },
          { path: "/setup",      element: <Setup /> },
          { path: "/recipes",    element: <RecipeList /> },
          { path: "/brew",       element: <Brew /> },
          { path: "/rating",     element: <Rating /> },
          { path: "/journal",    element: <Journal /> },
          { path: "/tweak",      element: <Tweak /> },
          { path: "/discover",   element: <Discover /> },
          { path: "/cafes",      element: <Cafes /> },
          { path: "/glossary",   element: <Glossary /> },
          { path: "/community",  element: <Community /> },
          { path: "/submit",     element: <SubmitRecipe /> },
          { path: "/beans",          element: <BeanLog /> },
          { path: "/scan",           element: <ScanBean /> },
          { path: "/notifications",  element: <Notifications /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
