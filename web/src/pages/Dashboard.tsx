import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass, MapPin, Book, Plus, Coffee,
  Users, Lightbulb, Sparkles,
} from "lucide-react";
import { ChevronRight, Settings } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, iconBtn } from "../components/ui";
import { useAppContext } from "../AppContext";
import { supabase } from "../lib/supabase";
import { TIPS, FUN_FACTS } from "../data";

// ─── Sub-components (Dashboard-only) ─────────────────────────────────────────

function DashCard({ icon, label, sub, onClick }: {
  icon: React.ReactNode; label: string; sub: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      background: T.bg2, border: `1px solid ${T.line}`,
      borderRadius: 18, padding: 20, textAlign: "left", color: T.cream,
      cursor: "pointer", fontFamily: FONT, width: "100%", boxSizing: "border-box",
    }}>
      <div style={{ color: T.accent, marginBottom: 18 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 400 }}>{label}</div>
      <div style={{ fontSize: 11, color: T.creamDim, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 200 }}>{n}</div>
      <div style={{ fontSize: 9, color: T.creamDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{l}</div>
    </div>
  );
}

function WeekStats() {
  const { brewLog } = useAppContext();

  const { weekEntries, dailyCounts, todayIndex } = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const entries = brewLog.filter(e => {
      if (!e.createdAt) return false;
      const t = new Date(e.createdAt).getTime();
      return t >= weekStart.getTime() && t < weekEnd.getTime();
    });

    const counts = [0, 0, 0, 0, 0, 0, 0]; // Mon–Sun
    entries.forEach(e => {
      const d = new Date(e.createdAt!);
      counts[(d.getDay() + 6) % 7]++;
    });

    return {
      weekEntries: entries,
      dailyCounts: counts,
      todayIndex: (now.getDay() + 6) % 7,
    };
  }, [brewLog]);

  const brewCount = weekEntries.length;
  const avgScore = brewCount > 0
    ? (weekEntries.reduce((s, e) => s + e.scores.overall, 0) / brewCount).toFixed(1)
    : "—";
  const methodCount = new Set(weekEntries.map(e => e.method)).size;
  const maxCount = Math.max(...dailyCounts, 1);

  return (
    <div style={{ border: `1px solid ${T.line}`, borderRadius: 18, padding: 22, background: T.bg2 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim, marginBottom: 18 }}>THIS WEEK</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <Stat n={String(brewCount)} l="brews" />
        <Stat n={avgScore} l="avg score" />
        <Stat n={String(methodCount)} l="methods" />
      </div>
      <div style={{ display: "flex", gap: 4, height: 50, alignItems: "flex-end" }}>
        {dailyCounts.map((c, i) => (
          <div key={i} style={{
            flex: 1,
            background: i === todayIndex ? T.accent : T.brownDeep,
            height: `${Math.max((c / maxCount) * 100, 8)}%`,
            borderRadius: 2,
            opacity: c === 0 ? 0.3 : 1,
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{ flex: 1, fontSize: 9, color: i === todayIndex ? T.accent : T.creamDim, textAlign: "center" }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

function TipCard({ tip }: { tip: string }) {
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Lightbulb size={14} color={T.accent} />
        <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>TIP OF THE DAY</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: T.cream }}>{tip}</div>
    </div>
  );
}

function FactCard({ fact }: { fact: string }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})`, border: `1px solid ${T.line}`, borderRadius: 18, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Sparkles size={14} color={T.accent} />
        <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>FUN FACT</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: T.cream, fontStyle: "italic" }}>"{fact}"</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const tipOfTheDay  = TIPS[Math.floor(Math.random() * TIPS.length)];
const factOfTheDay = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];

export function Dashboard() {
  const navigate = useNavigate();
  const { settings, setSettingsOpen, brewLog, beanLog } = useAppContext();
  const { isDesktop } = useViewport();
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.rpc("get_member_count").then(({ data }) => {
      if (typeof data === "number") setMemberCount(data);
    });
  }, []);

  const memberSub = memberCount === null ? "Loading…" : `${memberCount} member${memberCount !== 1 ? "s" : ""}`;

  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const padX = isDesktop ? 60 : 26;

  return (
    <div style={{ padding: `${isDesktop ? 50 : 60}px ${padX}px 60px`, minHeight: "100vh", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Logo row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isDesktop ? 50 : 70 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, background: T.cream, borderRadius: 7, display: "grid", placeItems: "center", color: T.bg, fontSize: 12 }}>✿</div>
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: T.creamDim }}>BEYONDPOURS</div>
        </div>
        {!isDesktop && (
          <button onClick={() => setSettingsOpen(true)} style={iconBtn}>
            <Settings size={16} color={T.cream} />
          </button>
        )}
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: 50 }}>
        <div style={{ fontSize: 13, color: T.creamDim, marginBottom: 12, letterSpacing: "0.1em" }}>
          {greet}{settings.name ? `, ${settings.name}` : ""}.
        </div>
        <div style={{ fontSize: isDesktop ? 60 : 42, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          What are we{isDesktop ? " " : <br />}brewing today?
        </div>
      </div>

      {/* Cards grid */}
      {isDesktop ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, marginBottom: 22 }}>
          <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
            <button onClick={() => navigate("/setup")} style={{
              background: T.cream, color: T.bg, border: "none", padding: "30px 32px",
              borderRadius: 22, display: "flex", justifyContent: "space-between",
              alignItems: "center", cursor: "pointer", fontFamily: FONT,
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6 }}>Start</div>
                <div style={{ fontSize: 32, fontWeight: 300, marginTop: 6 }}>New brew</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Nine methods · Including milk drinks</div>
              </div>
              <ChevronRight size={28} />
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <DashCard onClick={() => navigate("/journal")}  icon={<Book size={18} />}    label="Brew journal"   sub={`${brewLog.length} logged`} />
              <DashCard onClick={() => navigate("/discover")} icon={<Compass size={18} />} label="Discover beans" sub="Indian roasters" />
              <DashCard onClick={() => navigate("/cafes")}    icon={<MapPin size={18} />}  label="Cafes near me"  sub="Find a spot" />
              <DashCard onClick={() => navigate("/glossary")} icon={<Book size={18} />}    label="Coffee glossary" sub="Learn the lingo" />
              <DashCard onClick={() => navigate("/submit")}    icon={<Plus size={18} />}    label="Add new recipe" sub="Share with us" />
              <DashCard onClick={() => navigate("/beans")}    icon={<Coffee size={18} />}  label="Bean Log"       sub={`${beanLog.length} active`} />
              <DashCard onClick={() => navigate("/community")} icon={<Users size={18} />}  label="Community"      sub={memberSub} />
            </div>
          </div>
          <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
            <WeekStats />
            <TipCard tip={tipOfTheDay} />
            <FactCard fact={factOfTheDay} />
          </div>
        </div>
      ) : (
        <>
          <button onClick={() => navigate("/setup")} style={{
            width: "100%", background: T.cream, color: T.bg, border: "none",
            padding: "22px 26px", borderRadius: 18, display: "flex",
            justifyContent: "space-between", alignItems: "center", marginBottom: 14,
            cursor: "pointer", fontFamily: FONT,
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6 }}>Start</div>
              <div style={{ fontSize: 22, fontWeight: 300, marginTop: 4 }}>New brew</div>
            </div>
            <ChevronRight size={22} />
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <DashCard onClick={() => navigate("/journal")}   icon={<Book size={18} />}    label="Brew journal"   sub={`${brewLog.length} logged`} />
            <DashCard onClick={() => navigate("/discover")}  icon={<Compass size={18} />} label="Discover beans" sub="Indian roasters" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <DashCard onClick={() => navigate("/cafes")}    icon={<MapPin size={18} />} label="Cafes near me" sub="Find a spot" />
            <DashCard onClick={() => navigate("/glossary")} icon={<Book size={18} />}   label="Glossary"      sub="Coffee terms" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
            <DashCard onClick={() => navigate("/beans")}     icon={<Coffee size={18} />} label="Bean log"    sub={`${beanLog.length} active`} />
            <DashCard onClick={() => navigate("/community")} icon={<Users size={18} />}  label="Community"   sub={memberSub} />
          </div>
          <div style={{ display: "grid", gap: 14, marginBottom: 22 }}>
            <TipCard tip={tipOfTheDay} />
            <FactCard fact={factOfTheDay} />
          </div>
          <WeekStats />
        </>
      )}
    </div>
  );
}
