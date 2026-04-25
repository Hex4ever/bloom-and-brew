-- Persistent notification inbox for social interactions (likes + comments).
-- Each like or comment on another user's post writes a row here for the post owner.

create table public.notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  type         text not null check (type in ('like', 'comment')),
  actor_name   text not null,
  post_id      uuid references public.community_posts(id) on delete cascade,
  post_caption text,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Post owner reads and marks their own notifications
create policy "notifications: read own"
  on public.notifications for select using (auth.uid() = user_id);

create policy "notifications: update own"
  on public.notifications for update using (auth.uid() = user_id);

-- Any authenticated user may insert (to notify post owners of likes/comments)
create policy "notifications: insert auth"
  on public.notifications for insert with check (auth.role() = 'authenticated');

-- Enable Realtime so the badge count updates live
alter table public.notifications replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when others then null;
end $$;
