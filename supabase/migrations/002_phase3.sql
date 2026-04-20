-- Bloom & Brew — Phase 3: Core data flows
-- Run in Supabase SQL editor after 001_initial_schema.sql

-- ── beans: add name column ─────────────────────────────────────────────────────
alter table public.beans
  add column if not exists name text;

-- ── grinders: add display type ─────────────────────────────────────────────────
alter table public.grinders
  add column if not exists grinder_type text not null default 'Hand';

update public.grinders
  set grinder_type = 'Electric'
  where name in ('Baratza Encore', 'Fellow Ode Gen 2');

-- ── journal_entries: add denormalized display fields ───────────────────────────
-- These mirror the local JournalEntry shape so the UI can render without joins.
-- FK columns (recipe_id, bean_id, grinder_id) remain for future relational use.
alter table public.journal_entries
  add column if not exists recipe_title  text,
  add column if not exists bean_name     text,
  add column if not exists grinder_name  text,
  add column if not exists method_id     text,
  add column if not exists dose_g_used   numeric(6,2),
  add column if not exists water_g_used  numeric(6,2),
  add column if not exists temp_c_used   integer,
  add column if not exists clicks_used   integer;

-- ── community_posts: add display_name for the poster ──────────────────────────
-- Avoid a separate profiles join on every post list.
alter table public.community_posts
  add column if not exists poster_name text;

-- ── RLS: allow liked_by_me check per post ─────────────────────────────────────
-- (post_likes already has "all can read" policy — nothing new needed)
