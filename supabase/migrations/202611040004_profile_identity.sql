-- A readable club contact record, without a second member table.
-- Auth remains authoritative for verified sign-in emails and credentials.
begin;
alter table public.ecc_web_profiles add column full_name text, add column email text;

-- Backfill only accounts that already own an ECC website profile.
update public.ecc_web_profiles p
set full_name = coalesce(nullif(left(trim(coalesce(u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name','')),160),''),split_part(u.email,'@',1),'ECC account'),
    email = lower(trim(u.email))
from auth.users u where u.id=p.user_id;

alter table public.ecc_web_profiles
  alter column full_name set not null,
  alter column email set not null,
  add constraint ecc_web_profiles_name_valid check (length(trim(full_name)) between 1 and 160),
  add constraint ecc_web_profiles_email_valid check (length(email) between 3 and 254 and email=lower(trim(email)));

drop policy ecc_web_profiles_insert_own on public.ecc_web_profiles;
drop policy ecc_web_profiles_update_own on public.ecc_web_profiles;
create policy ecc_web_profiles_insert_own on public.ecc_web_profiles for insert to authenticated
  with check (user_id=(select auth.uid()) and email=lower((select auth.jwt())->>'email'));
create policy ecc_web_profiles_update_own on public.ecc_web_profiles for update to authenticated
  using (user_id=(select auth.uid()))
  with check (user_id=(select auth.uid()) and email=lower((select auth.jwt())->>'email'));
comment on table public.ecc_web_profiles is 'ECC website contact record: identity subject, full name, verified email snapshot, address and phone. No active membership or staff grant.';
commit;
