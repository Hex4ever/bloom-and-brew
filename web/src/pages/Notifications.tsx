import { useEffect, useState } from "react";
import { Heart, MessageCircle, Bell } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabase";

interface Notif {
  id: string;
  type: "like" | "comment";
  actor_name: string;
  post_caption: string | null;
  read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function NotifIcon({ type }: { type: Notif["type"] }) {
  const size = 15;
  if (type === "like") {
    return (
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: "rgba(251,146,60,0.15)",
        display: "grid", placeItems: "center",
      }}>
        <Heart size={size} color={T.accent} fill={T.accent} />
      </div>
    );
  }
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
      background: "rgba(94,234,212,0.12)",
      display: "grid", placeItems: "center",
    }}>
      <MessageCircle size={size} color="#5eead4" />
    </div>
  );
}

function NotifRow({ n }: { n: Notif }) {
  const message = n.type === "like"
    ? <><strong>{n.actor_name}</strong> liked your post</>
    : <><strong>{n.actor_name}</strong> commented on your post</>;

  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "14px 0",
      borderBottom: `1px solid ${T.line}`,
      opacity: n.read ? 0.65 : 1,
    }}>
      <NotifIcon type={n.type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.4, marginBottom: n.post_caption ? 4 : 0 }}>
          {message}
        </div>
        {n.post_caption && (
          <div style={{
            fontSize: 12, color: T.creamDim, lineHeight: 1.4,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            "{n.post_caption}"
          </div>
        )}
        <div style={{ fontSize: 11, color: T.creamDim, marginTop: 4 }}>{timeAgo(n.created_at)}</div>
      </div>
      {!n.read && (
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: T.accent, flexShrink: 0, marginTop: 6,
        }} />
      )}
    </div>
  );
}

export function Notifications() {
  const { user } = useAuth();
  const { clearUnreadNotifCount } = useAppContext();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, type, actor_name, post_caption, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      setNotifs((data ?? []) as Notif[]);
      setLoading(false);

      // Mark all as read in DB + clear badge
      clearUnreadNotifCount();
    };

    void load();
  }, [user, clearUnreadNotifCount]);

  // Group into day buckets
  const groups: { label: string; items: Notif[] }[] = [];
  for (const n of notifs) {
    const label = dayLabel(n.created_at);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(n);
    } else {
      groups.push({ label, items: [n] });
    }
  }

  return (
    <div>
      <Header title="Notifications" />

      <div style={{ padding: "20px 22px", maxWidth: 600, margin: "0 auto" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: T.creamDim, fontSize: 13 }}>
            Loading…
          </div>
        )}

        {!loading && notifs.length === 0 && (
          <div style={{ textAlign: "center", padding: "72px 0 48px" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: T.bg2, border: `1px solid ${T.line}`,
              display: "grid", placeItems: "center", margin: "0 auto 16px",
            }}>
              <Bell size={22} color={T.creamDim} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No notifications yet</div>
            <div style={{ fontSize: 13, color: T.creamDim, lineHeight: 1.5 }}>
              Likes and comments on your posts will appear here.
            </div>
          </div>
        )}

        {groups.map((g) => (
          <div key={g.label}>
            <div style={{
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: T.creamDim, padding: "18px 0 2px",
            }}>
              {g.label}
            </div>
            {g.items.map((n) => <NotifRow key={n.id} n={n} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

void FONT;
