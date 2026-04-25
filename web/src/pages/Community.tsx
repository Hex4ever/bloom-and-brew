import { useEffect, useRef, useState } from "react";
import { Plus, Heart, MessageCircle, Share2, Image, Send, X } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn, ghostBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  user_id: string;
  poster_name: string;
  caption: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  likedByMe: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  poster_name: string;
  content: string;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function avatarHue(userId: string) {
  return (userId.charCodeAt(0) % 36) * 10;
}

async function uploadPhoto(file: File, userId: string): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

// ─── CommentsSheet ────────────────────────────────────────────────────────────

function CommentsSheet({
  post,
  currentUserId,
  posterName,
  onClose,
  onCommentAdded,
  onCountSync,
}: {
  post: Post;
  currentUserId: string | undefined;
  posterName: string;
  onClose: () => void;
  onCommentAdded: (postId: string) => void;
  onCountSync: (postId: string, count: number) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("post_comments")
        .select("id, post_id, user_id, poster_name, content, created_at")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      const loaded = (data ?? []).map((c) => ({ ...c, poster_name: c.poster_name ?? "Anonymous" }));
      setComments(loaded);
      setLoading(false);
      // Sync the actual count back to the feed card in case the stored count is stale
      onCountSync(post.id, loaded.length);
    };
    void load();
  }, [post.id, onCountSync]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const submit = async () => {
    if (!currentUserId || !text.trim() || submitting) return;
    setSubmitting(true);
    const content = text.trim();
    setText("");

    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      post_id: post.id,
      user_id: currentUserId,
      poster_name: posterName,
      content,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, optimistic]);

    const { data } = await supabase
      .from("post_comments")
      .insert({ post_id: post.id, user_id: currentUserId, content, poster_name: posterName })
      .select("id, post_id, user_id, poster_name, content, created_at")
      .single();

    if (data) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimistic.id
            ? { ...data, poster_name: data.poster_name ?? posterName }
            : c,
        ),
      );
    }

    await supabase.rpc("increment_comments_count", { p_post_id: post.id });

    // Notify the post owner (skip if commenter is the owner)
    if (post.user_id && post.user_id !== currentUserId) {
      void supabase.from("notifications").insert({
        user_id: post.user_id,
        type: "comment",
        actor_name: posterName,
        post_id: post.id,
        post_caption: post.caption ? post.caption.slice(0, 80) : null,
      });
      void supabase.functions.invoke("send-push", {
        body: {
          userId: post.user_id,
          title: "New comment on your post",
          body: `${posterName}: ${content.slice(0, 80)}`,
          url: "/community",
        },
      });
    }

    onCommentAdded(post.id);
    setSubmitting(false);
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {/* Sheet — stop propagation so clicks inside don't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 540,
          maxHeight: "75vh",
          background: T.bg2,
          borderRadius: "20px 20px 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle + title */}
        <div
          style={{
            padding: "12px 18px 10px",
            borderBottom: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>Comments</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: T.creamDim, cursor: "pointer", padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Comment list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "24px 0", color: T.creamDim, fontSize: 12 }}>
              Loading…
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0", color: T.creamDim, fontSize: 12 }}>
              No comments yet. Be the first!
            </div>
          )}
          {comments.map((c) => {
            const hue = avatarHue(c.user_id);
            return (
              <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `hsl(${hue}, 30%, 30%)`,
                    color: T.cream,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  {c.poster_name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                    {c.poster_name}
                    <span style={{ fontWeight: 400, color: T.creamDim, marginLeft: 8 }}>
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{c.content}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        {currentUserId && (
          <div
            style={{
              padding: "10px 14px",
              borderTop: `1px solid ${T.line}`,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }}
              placeholder="Add a comment…"
              style={{ ...inputStyle, flex: 1, padding: "9px 12px" }}
            />
            <button
              onClick={() => void submit()}
              disabled={!text.trim() || submitting}
              style={{
                width: 34,
                height: 34,
                border: "none",
                borderRadius: "50%",
                background: text.trim() ? T.accent : T.line,
                color: T.bg,
                display: "grid",
                placeItems: "center",
                cursor: text.trim() ? "pointer" : "default",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
            >
              <Send size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composer ─────────────────────────────────────────────────────────────────

function Composer({
  onCancel,
  onPost,
  userId,
}: {
  onCancel: () => void;
  onPost: (caption: string, imageUrl: string | null) => void;
  userId: string;
}) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removePhoto = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async () => {
    if (!caption.trim() && !file) return;
    setUploading(true);
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadPhoto(file, userId);
    }
    onPost(caption, imageUrl);
    setUploading(false);
  };

  return (
    <div
      style={{
        background: T.bg2,
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
      }}
    >
      {/* Photo preview */}
      {preview && (
        <div style={{ position: "relative", marginBottom: 12 }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 12 }}
          />
          <button
            onClick={removePhoto}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.6)",
              border: "none",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's brewing?"
        style={{ ...inputStyle, minHeight: 80, resize: "none" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          alignItems: "center",
        }}
      >
        {/* Photo picker */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: `1px solid ${T.line}`,
            background: "transparent",
            borderRadius: 999,
            color: file ? T.accent : T.cream,
            cursor: "pointer",
            padding: "6px 14px",
            fontSize: 11,
          }}
        >
          <Image size={13} />
          {file ? "Change photo" : "Add photo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ ...ghostBtn, padding: "9px 18px" }}>
            Cancel
          </button>
          <button
            onClick={() => void submit()}
            disabled={uploading || (!caption.trim() && !file)}
            style={{ ...primaryBtn, padding: "9px 18px", opacity: uploading ? 0.6 : 1 }}
          >
            {uploading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────

function PostCard({
  p,
  onLike,
  onComment,
  onShare,
}: {
  p: Post;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}) {
  const hue = avatarHue(p.user_id);

  return (
    <div
      style={{
        background: T.bg2,
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `hsl(${hue}, 30%, 30%)`,
            color: T.cream,
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            flexShrink: 0,
          }}
        >
          {(p.poster_name || "?")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.poster_name || "Anonymous"}</div>
          <div style={{ fontSize: 10, color: T.creamDim }}>{timeAgo(p.created_at)}</div>
        </div>
      </div>

      {/* Photo or placeholder */}
      {p.image_url ? (
        <img
          src={p.image_url}
          alt={p.caption || "brew photo"}
          style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div
          style={{
            aspectRatio: "1/1",
            background: `radial-gradient(ellipse at 30% 30%, hsl(${hue}, 40%, 25%), ${T.bg})`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={{ fontSize: 36, opacity: 0.3 }}>☕</div>
        </div>
      )}

      {/* Caption + actions */}
      <div style={{ padding: "12px 16px" }}>
        {p.caption && (
          <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{p.caption}</div>
        )}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {/* Like */}
          <button
            onClick={onLike}
            style={{
              background: "none",
              border: "none",
              color: p.likedByMe ? T.accent : T.creamDim,
              display: "flex",
              gap: 5,
              alignItems: "center",
              padding: "6px 10px 6px 0",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            <Heart size={15} fill={p.likedByMe ? T.accent : "none"} />
            {p.likes_count > 0 && p.likes_count}
          </button>

          {/* Comment */}
          <button
            onClick={onComment}
            style={{
              background: "none",
              border: "none",
              color: T.creamDim,
              display: "flex",
              gap: 5,
              alignItems: "center",
              padding: "6px 10px 6px 6px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            <MessageCircle size={15} />
            {p.comments_count > 0 && p.comments_count}
          </button>

          {/* Share — pushed to the right */}
          <button
            onClick={onShare}
            style={{
              background: "none",
              border: "none",
              color: T.creamDim,
              display: "flex",
              gap: 5,
              alignItems: "center",
              padding: "6px 0 6px 6px",
              cursor: "pointer",
              fontSize: 12,
              marginLeft: "auto",
            }}
          >
            <Share2 size={15} />
          </button>
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
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [shareToast, setShareToast] = useState(false);

  // ── Fetch posts ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: postsData } = await supabase
        .from("community_posts")
        .select("id, user_id, poster_name, caption, image_url, likes_count, comments_count, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!postsData) { setLoading(false); return; }

      // Fetch all likes for these posts in one query (RLS allows all users to read).
      // Count per post gives the true likes_count; checking user_id gives likedByMe —
      // both in one round-trip, replacing the stale stored likes_count column.
      const postIds = postsData.map((p) => p.id);
      const { data: allLikes } = await supabase
        .from("post_likes")
        .select("post_id, user_id")
        .in("post_id", postIds);

      const likeCountMap = new Map<string, number>();
      const likedByMeIds = new Set<string>();
      for (const like of allLikes ?? []) {
        likeCountMap.set(like.post_id, (likeCountMap.get(like.post_id) ?? 0) + 1);
        if (user && like.user_id === user.id) likedByMeIds.add(like.post_id);
      }

      setPosts(
        postsData.map((p) => ({
          ...p,
          caption: p.caption ?? "",
          poster_name: p.poster_name ?? "Anonymous",
          likes_count: likeCountMap.get(p.id) ?? 0,
          comments_count: p.comments_count ?? 0,
          likedByMe: likedByMeIds.has(p.id),
        })),
      );
      setLoading(false);
    };
    void load();
  }, [user]);

  // ── Realtime: sync likes_count / comments_count when any user interacts ──
  useEffect(() => {
    const channel = supabase
      .channel("community-posts-live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "community_posts" },
        (payload) => {
          const row = payload.new as { id: string; likes_count: number; comments_count: number };
          setPosts((prev) =>
            prev.map((p) =>
              p.id === row.id
                ? { ...p, likes_count: row.likes_count, comments_count: row.comments_count }
                : p,
            ),
          );
        },
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  // ── Add post ──
  const addPost = async (caption: string, imageUrl: string | null) => {
    if (!user) return;
    const posterName = settings.name || "Anonymous";
    const optimistic: Post = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      poster_name: posterName,
      caption,
      image_url: imageUrl,
      likes_count: 0,
      comments_count: 0,
      likedByMe: false,
      created_at: new Date().toISOString(),
    };
    setPosts((prev) => [optimistic, ...prev]);
    setComposing(false);

    const { data } = await supabase
      .from("community_posts")
      .insert({ user_id: user.id, caption, image_url: imageUrl, poster_name: posterName })
      .select("id, user_id, poster_name, caption, image_url, likes_count, comments_count, created_at")
      .single();

    if (data) {
      const saved: Post = {
        ...data,
        caption: data.caption ?? "",
        poster_name: data.poster_name ?? posterName,
        comments_count: data.comments_count ?? 0,
        likedByMe: false,
      };
      setPosts((prev) => [saved, ...prev.filter((p) => p.id !== optimistic.id)]);
    }
  };

  // ── Like / unlike ──
  const toggleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const nowLiked = !post.likedByMe;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: nowLiked, likes_count: p.likes_count + (nowLiked ? 1 : -1) }
          : p,
      ),
    );
    if (nowLiked) {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      // DB trigger on post_likes auto-updates likes_count; Realtime pushes the new value back
      if (post.user_id && post.user_id !== user.id) {
        void supabase.from("notifications").insert({
          user_id: post.user_id,
          type: "like",
          actor_name: settings.name || "Someone",
          post_id: postId,
          post_caption: post.caption ? post.caption.slice(0, 80) : null,
        });
        void supabase.functions.invoke("send-push", {
          body: {
            userId: post.user_id,
            title: "Someone liked your post",
            body: post.caption ? `"${post.caption.slice(0, 60)}"` : "Your post got a like!",
            url: "/community",
          },
        });
      }
    } else {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      // DB trigger on post_likes auto-updates likes_count; Realtime pushes the new value back
    }
  };

  // ── Comments count increment (optimistic, for the current user's new comment) ──
  const handleCommentAdded = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p)),
    );
  };

  // ── Comments count sync (corrects stale stored count to actual DB count) ──
  const handleCountSync = (postId: string, count: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments_count: count } : p)),
    );
  };

  // ── Share ──
  const sharePost = async (post: Post) => {
    const url = `${window.location.origin}/community`;
    const text = post.caption ? `"${post.caption}" — on BeyondPours` : "Check out this brew on BeyondPours";
    if (navigator.share) {
      try {
        await navigator.share({ title: "BeyondPours", text, url });
      } catch {
        // user dismissed — do nothing
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div>
      <Header
        title="Community"
        right={
          <button
            onClick={() => setComposing(true)}
            style={{
              width: 34,
              height: 34,
              border: `1px solid ${T.line}`,
              background: "transparent",
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              color: T.cream,
              cursor: "pointer",
            }}
          >
            <Plus size={16} color={T.cream} />
          </button>
        }
      />

      <div style={{ padding: "20px 22px", maxWidth: isDesktop ? 700 : "none", margin: "0 auto" }}>
        {composing && user && (
          <Composer
            onCancel={() => setComposing(false)}
            onPost={(c, img) => void addPost(c, img)}
            userId={user.id}
          />
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.creamDim, fontSize: 13 }}>
            Loading posts…
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.creamDim, fontSize: 13 }}>
            No posts yet. Be the first to share!
          </div>
        )}

        <div style={{ display: "grid", gap: 18 }}>
          {posts.map((p) => (
            <PostCard
              key={p.id}
              p={p}
              onLike={() => void toggleLike(p.id)}
              onComment={() => setActiveCommentPost(p)}
              onShare={() => void sharePost(p)}
            />
          ))}
        </div>
      </div>

      {/* Comments sheet */}
      {activeCommentPost && (
        <CommentsSheet
          post={activeCommentPost}
          currentUserId={user?.id}
          posterName={settings.name || "Anonymous"}
          onClose={() => setActiveCommentPost(null)}
          onCommentAdded={handleCommentAdded}
          onCountSync={handleCountSync}
        />
      )}

      {/* Clipboard share toast */}
      {shareToast && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: T.bg2,
            border: `1px solid ${T.line}`,
            borderRadius: 999,
            padding: "10px 20px",
            fontSize: 13,
            color: T.cream,
            zIndex: 300,
            whiteSpace: "nowrap",
          }}
        >
          Link copied to clipboard
        </div>
      )}
    </div>
  );
}

// Suppress "FONT unused" warning
void FONT;
