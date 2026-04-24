-- Returns the total count of registered members (bypasses RLS).
-- Used by the Dashboard community card to show a live member count.
create or replace function public.get_member_count()
returns bigint
language sql
security definer
stable
as $$
  select count(*) from public.profiles;
$$;
