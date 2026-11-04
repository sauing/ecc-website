-- Phase 1 only. Supabase manages auth.users; ECC needs just this access table.
-- Keep business rows independent of the auth provider: no FK to auth.users.
-- user_id stores the current provider's verified subject UUID. Remap it when migrating providers.
begin;
create table public.ecc_web_staff (
  user_id uuid primary key,
  role text not null check (role in ('admin', 'moderator')),
  active boolean not null default true
);
alter table public.ecc_web_staff enable row level security;
revoke all on public.ecc_web_staff from public, anon, authenticated;
grant select on public.ecc_web_staff to authenticated;
create policy own_active_access on public.ecc_web_staff
  for select to authenticated
  using (user_id = (select auth.uid()) and active);
comment on table public.ecc_web_staff is 'ECC website only: approved admin/moderator access. Managed by ecc-website migrations.';
-- No app-side inserts/updates/deletes. A database owner provisions approved access.
commit;
