-- Trigger: auto-maintain likes_count whenever post_likes rows are inserted or deleted.
-- This makes like counts atomic (no client-side read-then-write race).
create or replace function update_post_likes_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update community_posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update community_posts set likes_count = greatest(0, likes_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_post_likes_count on post_likes;
create trigger trg_post_likes_count
  after insert or delete on post_likes
  for each row execute function update_post_likes_count();

-- Atomic comments count increment used by the client instead of a stale read-then-write.
create or replace function increment_comments_count(p_post_id uuid)
returns void language sql security definer as $$
  update community_posts set comments_count = comments_count + 1 where id = p_post_id;
$$;

-- Enable full Realtime change events on community_posts so all connected
-- clients receive likes_count / comments_count updates in real time.
alter table community_posts replica identity full;

do $$
begin
  alter publication supabase_realtime add table community_posts;
exception when others then null;
end $$;
