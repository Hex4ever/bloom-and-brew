import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppContextProvider, useAppContext } from "./AppContext";
import { BottomNav } from "./components/BottomNav";
import { Sidebar } from "./components/Sidebar";
import { SettingsModal } from "./components/SettingsModal";
import { useViewport } from "./components/ui";
import type { NavScreen } from "./components/BottomNav";
import type { SidebarScreen } from "./components/Sidebar";
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
} from "./pages";

// ─── Screen name ↔ path mapping ──────────────────────────────────────────────

const SCREEN_TO_PATH: Record<string, string> = {
  welcome:  "/",
  methods:  "/methods",
  setup:    "/setup",
  recipes:  "/recipes",
  brew:     "/brew",
  journal:  "/journal",
  discover: "/discover",
  cafes:    "/cafes",
  beans:    "/beans",
  feed:     "/community",
  glossary: "/glossary",
};

const PATH_TO_SCREEN: Record<string, string> = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([k, v]) => [v, k]),
);

// ─── Layout ───────────────────────────────────────────────────────────────────

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDesktop } = useViewport();
  const { settings, setSettings, settingsOpen, setSettingsOpen } = useAppContext();

  const currentScreen = PATH_TO_SCREEN[location.pathname] ?? location.pathname.slice(1);

  const go = (screen: NavScreen | SidebarScreen) => {
    const path = SCREEN_TO_PATH[screen] ?? `/${screen}`;
    navigate(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isDesktop && (
        <Sidebar
          screen={currentScreen}
          go={go}
          openSettings={() => setSettingsOpen(true)}
        />
      )}

      <div style={{ flex: 1, paddingBottom: isDesktop ? 0 : 72, minWidth: 0 }}>
        <Outlet />
      </div>

      {!isDesktop && (
        <BottomNav screen={currentScreen} go={go} />
      )}

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    element: (
      <AppContextProvider>
        <Layout />
      </AppContextProvider>
    ),
    children: [
      { path: "/",           element: <Dashboard /> },
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
      { path: "/beans",      element: <BeanLog /> },
      { path: "/scan",       element: <ScanBean /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
