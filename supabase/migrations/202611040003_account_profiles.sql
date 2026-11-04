-- Account-first joining. Sign-in/name/email remain in Supabase Auth.
-- Only one new table for the required address and phone number.
begin;
create table public.ecc_web_profiles (
  user_id uuid primary key,
  address text not null check (length(trim(address)) between 8 and 500),
  phone text not null check (phone ~ '^\+[1-9][0-9]{7,14}$')
);
alter table public.ecc_web_profiles enable row level security;
revoke all on public.ecc_web_profiles from public, anon, authenticated;
grant select, insert, update on public.ecc_web_profiles to authenticated;
create policy ecc_web_profiles_read_own on public.ecc_web_profiles for select to authenticated using (user_id=(select auth.uid()));
create policy ecc_web_profiles_insert_own on public.ecc_web_profiles for insert to authenticated with check (user_id=(select auth.uid()));
create policy ecc_web_profiles_update_own on public.ecc_web_profiles for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
comment on table public.ecc_web_profiles is 'ECC website only: account-owner address and phone. No membership choice or administrative grant.';
commit;
