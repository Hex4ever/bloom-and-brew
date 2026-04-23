-- ── post-images storage bucket ────────────────────────────────────────────────
-- Public bucket: objects served via public URL without auth.
-- RLS still governs who can upload / delete.

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "post-images: public read"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "post-images: authenticated upload"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

-- Files are stored under {user_id}/{filename}; only the owner may delete.
create policy "post-images: owner delete"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── community_posts: add comments_count ───────────────────────────────────────
alter table public.community_posts
  add column if not exists comments_count integer not null default 0;

-- ── post_comments: add poster_name ────────────────────────────────────────────
-- Denormalized display name — same pattern as community_posts.poster_name.
alter table public.post_comments
  add column if not exists poster_name text;
