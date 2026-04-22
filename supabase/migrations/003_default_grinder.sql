-- Add default_grinder_id to profiles so the user's preferred grinder persists
-- across devices regardless of whether it is a curated or custom grinder.
-- ON DELETE SET NULL means if a custom grinder is deleted, the preference
-- silently clears and the app falls back to the first available grinder.

alter table public.profiles
  add column default_grinder_id uuid
    references public.grinders(id)
    on delete set null;
