import { X } from "lucide-react";
import { T, FONT } from "../styles/theme";
import type { UserSettings, Units, TempUnit } from "../types";

// ─── Sub-components ────────────────────────────────────────────────────────

interface SetFieldProps {
  label: string;
  children: React.ReactNode;
}

export function SetField({ label, children }: SetFieldProps) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 10 }}>
        {label.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

interface ToggleProps<T extends string> {
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}

export function Toggle<V extends string>({ options, value, onChange }: ToggleProps<V>) {
  return (
    <div style={{ display: "flex", background: T.bg3, padding: 4, borderRadius: 12, gap: 4 }}>
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 9, border: "none",
            background: value === v ? T.cream : "transparent",
            color: value === v ? T.bg : T.creamDim,
            fontSize: 12, fontFamily: FONT,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

interface SwitchProps {
  on: boolean;
  onChange: (v: boolean) => void;
}

export function Switch({ on, onChange }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 50, height: 28,
        background: on ? T.accent : T.bg3,
        border: `1px solid ${T.line}`,
        borderRadius: 999, position: "relative", padding: 0,
        transition: "background 0.2s",
      }}
    >
      <div style={{
        width: 20, height: 20, background: T.cream, borderRadius: "50%",
        position: "absolute", top: 3,
        left: on ? 26 : 3,
        transition: "left 0.2s",
      }} />
    </button>
  );
}

// ─── SettingsModal ─────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 10,
  color: T.cream, fontFamily: FONT, fontSize: 13, outline: "none",
};

const iconBtnStyle: React.CSSProperties = {
  width: 34, height: 34, borderRadius: "50%",
  background: "transparent", border: `1px solid ${T.line}`,
  display: "grid", placeItems: "center", cursor: "pointer",
};

interface Props {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  onClose: () => void;
  onSignOut?: () => void;
}

export function SettingsModal({ settings, setSettings, onClose, onSignOut }: Props) {
  function set<K extends keyof UserSettings>(k: K, v: UserSettings[K]) {
    setSettings({ ...settings, [k]: v });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 20,
          width: "100%", maxWidth: 460, maxHeight: "85vh", overflow: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "22px 24px 18px", borderBottom: `1px solid ${T.line}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: T.creamDim }}>
            Settings
          </div>
          <button onClick={onClose} style={iconBtnStyle}>
            <X size={16} color={T.cream} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "26px 24px 30px" }}>
          <SetField label="Display name">
            <input
              value={settings.name}
              onChange={(e) => set("name", e.target.value)}
              style={inputStyle}
            />
          </SetField>

          <SetField label="Units">
            <Toggle<Units>
              options={[["metric", "Metric (g)"], ["imperial", "Imperial (oz)"]]}
              value={settings.units}
              onChange={(v) => set("units", v)}
            />
          </SetField>

          <SetField label="Temperature">
            <Toggle<TempUnit>
              options={[["C", "Celsius"], ["F", "Fahrenheit"]]}
              value={settings.tempUnit}
              onChange={(v) => set("tempUnit", v)}
            />
          </SetField>

          <SetField label="Auto-play music during brew">
            <Switch on={settings.musicAuto} onChange={(v) => set("musicAuto", v)} />
          </SetField>

          <SetField label="Step notifications">
            <Switch on={settings.notifications} onChange={(v) => set("notifications", v)} />
          </SetField>

          {/* About */}
          <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 12 }}>
              ABOUT
            </div>
            <div style={{ fontSize: 12, color: T.creamDim, lineHeight: 1.6 }}>
              BeyondPours · v0.2<br />
              A space to brew slower, drink better.
            </div>
          </div>

          {/* Sign out */}
          {onSignOut && (
            <div style={{ marginTop: 22, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
              <button
                onClick={onSignOut}
                style={{
                  width: "100%", padding: "12px 0",
                  background: "transparent", border: `1px solid ${T.line}`,
                  borderRadius: 10, color: T.creamDim,
                  fontFamily: FONT, fontSize: 13, cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
