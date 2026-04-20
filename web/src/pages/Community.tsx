import { useEffect, useState } from "react";
import { Plus, Heart, MessageCircle, Image } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn, ghostBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabase";

// ─── Local types ──────────────────────────────────────────────────────────────

interface Post {
  id: string;
  user_id: string;
  poster_name: string;
  caption: string;
  likes_count: number;
  likedByMe: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PostCard({ p, onLike }: { p: Post; onLike: () => void }) {
  const hue = (p.user_id.charCodeAt(0) % 36) * 10;
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `hsl(${hue}, 30%, 30%)`, color: T.cream, display: "grid", placeItems: "center", fontSize: 11 }}>
          {(p.poster_name || "?")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13 }}>{p.poster_name || "Anonymous"}</div>
          <div style={{ fontSize: 10, color: T.creamDim }}>{timeAgo(p.created_at)}</div>
        </div>
      </div>
      <div style={{ aspectRatio: "1.1", background: `radial-gradient(ellipse at 30% 30%, hsl(${hue}, 40%, 25%), ${T.bg})`, position: "relative", display: "grid", placeItems: "center" }}>
        <div style={{ fontSize: 36, opacity: 0.3 }}>☕</div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 13, marginBottom: 12 }}>{p.caption}</div>
        <div style={{ display: "flex", gap: 18, color: T.creamDim, fontSize: 12 }}>
          <button onClick={onLike} style={{ background: "none", border: "none", color: p.likedByMe ? T.accent : T.creamDim, display: "flex", gap: 6, alignItems: "center", padding: 0, cursor: "pointer" }}>
            <Heart size={14} fill={p.likedByMe ? T.accent : "none"} /> {p.likes_count}
          </button>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <MessageCircle size={14} /> 0
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
  const { user } = useAuth();
  const { isDesktop } = useViewport();
  const [posts, setPosts] = useState<Post[]>([]);
  const [composing, setComposing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch posts + liked status
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: postsData } = await supabase
        .from("community_posts")
        .select("id, user_id, poster_name, caption, likes_count, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!postsData) { setLoading(false); return; }

      let likedIds = new Set<string>();
      if (user) {
        const { data: likedData } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id);
        likedIds = new Set((likedData ?? []).map(l => l.post_id));
      }

      setPosts(postsData.map(p => ({
        ...p,
        caption:    p.caption ?? "",
        poster_name: p.poster_name ?? "Anonymous",
        likedByMe:  likedIds.has(p.id),
      })));
      setLoading(false);
    };
    void load();
  }, [user]);

  const addPost = async (caption: string) => {
    if (!user) return;
    const posterName = settings.name || "Anonymous";
    // Optimistic
    const optimistic: Post = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      poster_name: posterName,
      caption,
      likes_count: 0,
      likedByMe: false,
      created_at: new Date().toISOString(),
    };
    setPosts(prev => [optimistic, ...prev]);
    setComposing(false);

    const { data } = await supabase
      .from("community_posts")
      .insert({ user_id: user.id, caption, poster_name: posterName })
      .select("id, user_id, poster_name, caption, likes_count, created_at")
      .single();

    if (data) {
      const row = data as { id: string; user_id: string; poster_name: string | null; caption: string | null; likes_count: number; created_at: string };
      const saved: Post = { ...row, caption: row.caption ?? "", poster_name: row.poster_name ?? posterName, likedByMe: false };
      setPosts(prev => [saved, ...prev.filter(p => p.id !== optimistic.id)]);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const nowLiked = !post.likedByMe;
    // Optimistic
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likedByMe: nowLiked, likes_count: p.likes_count + (nowLiked ? 1 : -1) }
        : p,
    ));

    if (nowLiked) {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      await supabase.from("community_posts").update({ likes_count: post.likes_count + 1 }).eq("id", postId);
    } else {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      await supabase.from("community_posts").update({ likes_count: Math.max(0, post.likes_count - 1) }).eq("id", postId);
    }
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
        {composing && <Composer onCancel={() => setComposing(false)} onPost={(c) => void addPost(c)} />}
        {loading && <div style={{ textAlign: "center", padding: "40px 0", color: T.creamDim, fontSize: 13 }}>Loading posts…</div>}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.creamDim, fontSize: 13 }}>
            No posts yet. Be the first to share!
          </div>
        )}
        <div style={{ display: "grid", gap: 18 }}>
          {posts.map((p) => (
            <PostCard key={p.id} p={p} onLike={() => void toggleLike(p.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Suppress "FONT unused" warning
void FONT;
