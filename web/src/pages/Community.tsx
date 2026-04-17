import { useState } from "react";
import { Plus, Heart, MessageCircle, Image } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn, ghostBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { FEED } from "../data";
import type { CommunityPost } from "../data";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PostCard({ p, onLike }: { p: CommunityPost; onLike: () => void }) {
  const { T: _T } = { T }; // local alias for brevity inside JSX
  void _T;
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `hsl(${p.hue}, 30%, 30%)`, color: T.cream, display: "grid", placeItems: "center", fontSize: 11 }}>
          {p.user[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13 }}>{p.user}</div>
          <div style={{ fontSize: 10, color: T.creamDim }}>{p.time} ago</div>
        </div>
      </div>
      <div style={{ aspectRatio: "1.1", background: `radial-gradient(ellipse at 30% 30%, hsl(${p.hue}, 40%, 25%), ${T.bg})`, position: "relative", display: "grid", placeItems: "center" }}>
        <div style={{ fontSize: 36, opacity: 0.3 }}>☕</div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 13, marginBottom: 12 }}>{p.caption}</div>
        <div style={{ display: "flex", gap: 18, color: T.creamDim, fontSize: 12 }}>
          <button onClick={onLike} style={{ background: "none", border: "none", color: T.creamDim, display: "flex", gap: 6, alignItems: "center", padding: 0, cursor: "pointer" }}>
            <Heart size={14} /> {p.likes}
          </button>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <MessageCircle size={14} /> {p.comments}
          </span>
        </div>
      </div>
    </div>
  );
}

function Composer({ onCancel, onPost }: { onCancel: () => void; onPost: (caption: string) => void }) {
  const [caption, setCaption] = useState("");
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, padding: 16, marginBottom: 18 }}>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's brewing?"
        style={{ ...inputStyle, minHeight: 80, resize: "none" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
        <button style={{ width: 34, height: 34, border: `1px solid ${T.line}`, background: "transparent", borderRadius: 999, display: "flex", alignItems: "center", gap: 6, color: T.cream, cursor: "pointer", padding: "0 14px" }}>
          <Image size={14} color={T.cream} /><span style={{ fontSize: 11 }}>Photo</span>
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ ...ghostBtn, padding: "10px 18px" }}>Cancel</button>
          <button onClick={() => caption.trim() && onPost(caption)} style={{ ...primaryBtn, padding: "10px 18px" }}>Post</button>
        </div>
      </div>
    </div>
  );
}

// ─── Community page ───────────────────────────────────────────────────────────

export function Community() {
  const { settings } = useAppContext();
  const { isDesktop } = useViewport();
  const [posts, setPosts] = useState<CommunityPost[]>(FEED);
  const [composing, setComposing] = useState(false);

  const addPost = (caption: string) => {
    setPosts([{
      id: String(Date.now()),
      user: settings.name?.toLowerCase() || "you",
      time: "now",
      caption,
      likes: 0,
      comments: 0,
      hue: 35,
    }, ...posts]);
    setComposing(false);
  };

  return (
    <div>
      <Header
        title="Community"
        right={
          <button onClick={() => setComposing(true)} style={{ width: 34, height: 34, border: `1px solid ${T.line}`, background: "transparent", borderRadius: 999, display: "grid", placeItems: "center", color: T.cream, cursor: "pointer" }}>
            <Plus size={16} color={T.cream} />
          </button>
        }
      />
      <div style={{ padding: "20px 22px", maxWidth: isDesktop ? 700 : "none", margin: "0 auto" }}>
        {composing && <Composer onCancel={() => setComposing(false)} onPost={addPost} />}
        <div style={{ display: "grid", gap: 18 }}>
          {posts.map((p) => (
            <PostCard key={p.id} p={p} onLike={() =>
              setPosts((arr) => arr.map((x) => x.id === p.id ? { ...x, likes: x.likes + 1 } : x))
            } />
          ))}
        </div>
      </div>
    </div>
  );
}

// Suppress "FONT unused" warning
void FONT;
