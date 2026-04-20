-- Bloom & Brew — initial schema
-- Run this in Supabase SQL editor or via supabase db push

-- ── profiles ──────────────────────────────────────────────────────────────────
create table public.profiles (
  id                 uuid references auth.users on delete cascade primary key,
  display_name       text,
  units              text not null default 'metric'  check (units in ('metric','imperial')),
  temperature_unit   text not null default 'c'       check (temperature_unit in ('c','f')),
  auto_play_music    boolean not null default false,
  step_notifications boolean not null default false,
  created_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── grinders ──────────────────────────────────────────────────────────────────
create table public.grinders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users on delete cascade,  -- null = curated
  name              text not null,
  clicks_per_1000um numeric(6,2) not null,
  detent_style      text not null default 'whole' check (detent_style in ('half','whole')),
  is_default        boolean not null default false,
  created_at        timestamptz not null default now()
);

alter table public.grinders enable row level security;

create policy "grinders: all can read curated" on public.grinders
  for select using (user_id is null or user_id = auth.uid());
create policy "grinders: own insert" on public.grinders
  for insert with check (user_id = auth.uid());
create policy "grinders: own update" on public.grinders
  for update using (user_id = auth.uid());
create policy "grinders: own delete" on public.grinders
  for delete using (user_id = auth.uid());

-- ── recipes ───────────────────────────────────────────────────────────────────
create table public.recipes (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid references auth.users on delete set null,   -- null = curated
  method         text not null check (method in
                   ('v60','aeropress','chemex','french','moka',
                    'espresso','latte','cappuccino','flatwhite')),
  title          text not null,
  dose_g         numeric(6,2) not null,
  water_g        numeric(6,2) not null,
  temp_c         integer not null,
  ratio          numeric(5,2) not null,
  brew_time_s    integer not null,
  difficulty     text not null default 'Intermediate'
                   check (difficulty in ('Beginner','Intermediate','Advanced','Expert')),
  steps          jsonb not null default '[]',
  flavor_profile jsonb not null default '{}',
  source_author  text,
  is_curated     boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "recipes: curated + own read" on public.recipes
  for select using (is_curated = true or author_id = auth.uid());
create policy "recipes: own insert" on public.recipes
  for insert with check (author_id = auth.uid());
create policy "recipes: own update" on public.recipes
  for update using (author_id = auth.uid());
create policy "recipes: own delete" on public.recipes
  for delete using (author_id = auth.uid());

-- ── beans ─────────────────────────────────────────────────────────────────────
create table public.beans (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users on delete cascade,  -- null = curated
  roaster       text,
  origin        text,
  roast_level   text,
  tasting_notes text,
  source        text not null default 'manual' check (source in ('scan','manual','curated')),
  image_url     text,
  created_at    timestamptz not null default now()
);

alter table public.beans enable row level security;

create policy "beans: curated readable by all" on public.beans
  for select using (source = 'curated' or user_id = auth.uid());
create policy "beans: own insert" on public.beans
  for insert with check (user_id = auth.uid());
create policy "beans: own update" on public.beans
  for update using (user_id = auth.uid());
create policy "beans: own delete" on public.beans
  for delete using (user_id = auth.uid());

-- ── journal_entries ───────────────────────────────────────────────────────────
create table public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  recipe_id   uuid references public.recipes on delete set null,
  bean_id     uuid references public.beans on delete set null,
  grinder_id  uuid references public.grinders on delete set null,
  servings    integer not null default 1,
  sweetness   integer check (sweetness between 1 and 10),
  acidity     integer check (acidity between 1 and 10),
  body        integer check (body between 1 and 10),
  bitterness  integer check (bitterness between 1 and 10),
  aftertaste  integer check (aftertaste between 1 and 10),
  overall     integer check (overall between 1 and 10),
  notes       text,
  quick_logged boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "journal: own all" on public.journal_entries
  for all using (user_id = auth.uid());

-- ── tweak_threads ─────────────────────────────────────────────────────────────
create table public.tweak_threads (
  id                uuid primary key default gen_random_uuid(),
  journal_entry_id  uuid references public.journal_entries on delete cascade not null,
  created_at        timestamptz not null default now()
);

alter table public.tweak_threads enable row level security;

create policy "tweak_threads: own all" on public.tweak_threads
  for all using (
    journal_entry_id in (
      select id from public.journal_entries where user_id = auth.uid()
    )
  );

-- ── tweak_messages ────────────────────────────────────────────────────────────
create table public.tweak_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid references public.tweak_threads on delete cascade not null,
  role        text not null check (role in ('user','assistant','system')),
  content     text not null,
  token_usage integer,
  created_at  timestamptz not null default now()
);

alter table public.tweak_messages enable row level security;

create policy "tweak_messages: own all" on public.tweak_messages
  for all using (
    thread_id in (
      select t.id from public.tweak_threads t
      join public.journal_entries j on j.id = t.journal_entry_id
      where j.user_id = auth.uid()
    )
  );

-- ── community_posts ───────────────────────────────────────────────────────────
create table public.community_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  caption     text,
  image_url   text,
  recipe_id   uuid references public.recipes on delete set null,
  likes_count integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "posts: all can read"  on public.community_posts for select using (true);
create policy "posts: own insert"    on public.community_posts for insert with check (user_id = auth.uid());
create policy "posts: own update"    on public.community_posts for update using (user_id = auth.uid());
create policy "posts: own delete"    on public.community_posts for delete using (user_id = auth.uid());

-- ── post_likes ────────────────────────────────────────────────────────────────
create table public.post_likes (
  post_id  uuid references public.community_posts on delete cascade,
  user_id  uuid references auth.users on delete cascade,
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "likes: all can read" on public.post_likes for select using (true);
create policy "likes: own all"      on public.post_likes for all   using (user_id = auth.uid());

-- ── post_comments ─────────────────────────────────────────────────────────────
create table public.post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references public.community_posts on delete cascade not null,
  user_id    uuid references auth.users on delete cascade not null,
  content    text not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "comments: all can read" on public.post_comments for select using (true);
create policy "comments: own insert"   on public.post_comments for insert with check (user_id = auth.uid());
create policy "comments: own delete"   on public.post_comments for delete using (user_id = auth.uid());

-- ── recipe_submissions ────────────────────────────────────────────────────────
create table public.recipe_submissions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  method     text not null,
  title      text not null,
  dose_g     numeric(6,2),
  water_g    numeric(6,2),
  temp_c     integer,
  notes      text,
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.recipe_submissions enable row level security;

create policy "submissions: own read"   on public.recipe_submissions for select using (user_id = auth.uid());
create policy "submissions: own insert" on public.recipe_submissions for insert with check (user_id = auth.uid());

-- ── cafes_cache ───────────────────────────────────────────────────────────────
create table public.cafes_cache (
  id        uuid primary key default gen_random_uuid(),
  lat       numeric(9,6) not null,
  lng       numeric(9,6) not null,
  place_id  text not null unique,
  data      jsonb not null default '{}',
  cached_at timestamptz not null default now()
);

alter table public.cafes_cache enable row level security;

-- writes happen only via service-role edge function
create policy "cafes_cache: all can read" on public.cafes_cache for select using (true);
