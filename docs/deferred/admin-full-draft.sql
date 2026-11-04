-- ARCHIVED DESIGN ONLY. DO NOT DEPLOY. Superseded by incremental ecc_web_* migrations.
-- Run once in a new Supabase project. No real member data or admin grants are seeded.
create table public.ecc_staff (
 user_id uuid primary key references auth.users(id), email text not null,
 role text not null check (role in ('admin','moderator')), active boolean not null default true
);
create unique index ecc_staff_email on public.ecc_staff(lower(email));
create table public.ecc_members (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 160),
 email text not null check(length(email) between 3 and 254 and position('@' in email)>1),
 phone text not null default '' check(length(phone)<=40), created_at timestamptz not null default now()
);
create unique index ecc_members_email on public.ecc_members(lower(email));
create table public.ecc_programmes (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 160),
 season text not null check(length(trim(season)) between 1 and 20), fee_cents integer not null check(fee_cents between 0 and 100000000),
 status text not null check(status in ('draft','open','closed')), opens_on date, closes_on date,
 check(opens_on is null or closes_on is null or opens_on<=closes_on)
);
create table public.ecc_memberships (
 id uuid primary key default gen_random_uuid(), member_id uuid not null references public.ecc_members(id),
 programme_id uuid not null references public.ecc_programmes(id), season text not null,
 fee_cents integer not null check(fee_cents between 0 and 100000000),
 status text not null default 'pending' check(status in ('pending','active','rejected')),
 decision_note text not null default '' check(length(decision_note)<=1000), created_at timestamptz not null default now(),
 unique(member_id,programme_id,season)
);
create table public.ecc_payments (
 id uuid primary key default gen_random_uuid(), membership_id uuid not null references public.ecc_memberships(id),
 amount_cents integer not null check(amount_cents between 1 and 100000000), kind text not null check(kind in ('payment','refund')),
 method text not null check(method in ('bank','cash')), reference text not null check(length(trim(reference)) between 1 and 160),
 note text not null check(length(trim(note)) between 1 and 1000), received_on date not null,
 created_at timestamptz not null default now(), recorded_by uuid not null references auth.users(id),
 unique(membership_id,kind,method,reference)
);
create table public.ecc_assignments (
 id uuid primary key default gen_random_uuid(), member_id uuid not null references public.ecc_members(id),
 team text not null check(team in ('ECC1','ECC2','ECC3','ECC4','Youth 1','Youth 2')),
 season text not null check(length(trim(season)) between 1 and 20), unique(member_id,team,season)
);
create table public.ecc_invitations (
 id uuid primary key default gen_random_uuid(), email text not null check(length(email) between 3 and 254 and position('@' in email)>1),
 role text not null check(role in ('admin','moderator')), status text not null default 'pending' check(status in ('pending','accepted','revoked')),
 expires_at timestamptz not null default now()+interval '7 days', created_by uuid not null references auth.users(id)
);
create unique index ecc_pending_invitation on public.ecc_invitations(lower(email)) where status='pending';
create table public.ecc_notices (
 id uuid primary key default gen_random_uuid(), message text not null check(length(trim(message)) between 1 and 500),
 action_label text not null default '' check(length(action_label)<=80), action_href text not null default '' check(length(action_href)<=500),
 status text not null check(status in ('draft','published')), expires_at timestamptz, updated_at timestamptz not null default now(),
 check((action_href='' and action_label='') or (action_label<>'' and (action_href ~ '^/[^/]' or action_href='/' or action_href ~* '^https://')))
);
create table public.ecc_message_drafts (
 id uuid primary key default gen_random_uuid(), subject text not null check(length(trim(subject)) between 1 and 200),
 body text not null check(length(trim(body)) between 1 and 10000), audience text not null check(audience in ('All members','Active members','ECC1','ECC2','ECC3','ECC4','Youth 1','Youth 2')),
 status text not null default 'draft' check(status='draft'), created_by uuid not null references auth.users(id), created_at timestamptz not null default now()
);
create table public.ecc_audit (
 id bigint generated always as identity primary key, actor_id uuid references auth.users(id), action text not null, entity text not null,
 before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);
create index on public.ecc_memberships(member_id);
create index on public.ecc_payments(membership_id);
create index on public.ecc_assignments(member_id);

create function public.ecc_current_role() returns text language sql stable security definer set search_path='' as $$
 select role from public.ecc_staff where user_id=auth.uid() and active=true
$$;
revoke all on function public.ecc_current_role() from public,anon;
grant execute on function public.ecc_current_role() to authenticated;

-- No browser role can write tables directly. All writes pass through the checked RPC.
do $$ declare t text; begin
 foreach t in array array['ecc_staff','ecc_members','ecc_programmes','ecc_memberships','ecc_payments','ecc_assignments','ecc_invitations','ecc_notices','ecc_message_drafts','ecc_audit'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
 end loop;
 foreach t in array array['ecc_members','ecc_programmes','ecc_memberships','ecc_payments','ecc_assignments','ecc_invitations'] loop
  execute format('create policy admin_read on public.%I for select to authenticated using (public.ecc_current_role() = ''admin'')',t);
 end loop;
end $$;
create policy staff_read on public.ecc_staff for select to authenticated using (user_id=auth.uid() or public.ecc_current_role()='admin');
create policy notice_staff_read on public.ecc_notices for select to authenticated using (public.ecc_current_role() in ('admin','moderator'));
create policy draft_staff_read on public.ecc_message_drafts for select to authenticated using (public.ecc_current_role()='admin' or (public.ecc_current_role()='moderator' and created_by=auth.uid()));
create policy audit_staff_read on public.ecc_audit for select to authenticated using (public.ecc_current_role()='admin' or (public.ecc_current_role()='moderator' and actor_id=auth.uid() and entity in ('ecc_notices','ecc_message_drafts')));

create function public.ecc_audit_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.ecc_audit(actor_id,action,entity,before_data,after_data)
 values(auth.uid(),TG_OP,TG_TABLE_NAME,case when TG_OP<>'INSERT' then to_jsonb(OLD) end,case when TG_OP<>'DELETE' then to_jsonb(NEW) end);
 return null;
end $$;
revoke all on function public.ecc_audit_change() from public,anon,authenticated;
do $$ declare t text; begin
 foreach t in array array['ecc_staff','ecc_members','ecc_programmes','ecc_memberships','ecc_payments','ecc_assignments','ecc_invitations','ecc_notices','ecc_message_drafts'] loop
  execute format('create trigger audit_change after insert or update or delete on public.%I for each row execute function public.ecc_audit_change()',t);
 end loop;
end $$;

create function public.ecc_accept_invitation() returns void language plpgsql security definer set search_path='' as $$
declare account_email text; inv public.ecc_invitations;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if not exists(select 1 from auth.users u join auth.identities i on i.user_id=u.id where u.id=auth.uid() and u.email_confirmed_at is not null and i.provider='google') then raise exception 'Verified Google identity required'; end if;
 select lower(email) into account_email from auth.users where id=auth.uid();
 if exists(select 1 from public.ecc_staff where user_id=auth.uid() and active) then return; end if;
 select * into inv from public.ecc_invitations where lower(email)=account_email and status='pending' and expires_at>now() for update;
 if not found then return; end if;
 insert into public.ecc_staff(user_id,email,role,active) values(auth.uid(),account_email,inv.role,true)
 on conflict(user_id) do update set role=excluded.role,active=true,email=excluded.email;
 update public.ecc_invitations set status='accepted' where id=inv.id;
end $$;
revoke all on function public.ecc_accept_invitation() from public,anon;
grant execute on function public.ecc_accept_invitation() to authenticated;

create function public.ecc_admin_execute(action_name text,payload jsonb) returns void language plpgsql security definer set search_path='' as $$
declare actor_role text; row_id uuid; membership public.ecc_memberships; programme public.ecc_programmes; paid bigint; old_staff public.ecc_staff;
begin
 actor_role:=public.ecc_current_role();
 if actor_role is null then raise exception 'Access denied'; end if;
 if actor_role<>'admin' and action_name not in ('save_notice','save_message') then raise exception 'Administrator required'; end if;
 if payload is null or jsonb_typeof(payload)<>'object' then raise exception 'Invalid payload'; end if;
 case action_name
 when 'save_member' then
  if nullif(payload->>'id','') is null then
   insert into public.ecc_members(name,email,phone) values(trim(payload->>'name'),lower(trim(payload->>'email')),coalesce(payload->>'phone',''));
  else
   update public.ecc_members set name=trim(payload->>'name'),email=lower(trim(payload->>'email')),phone=coalesce(payload->>'phone','') where id=(payload->>'id')::uuid;
   if not found then raise exception 'Member not found'; end if;
  end if;
 when 'save_programme' then
  if nullif(payload->>'id','') is null then
   insert into public.ecc_programmes(name,season,fee_cents,status,opens_on,closes_on) values(trim(payload->>'name'),trim(payload->>'season'),(payload->>'fee_cents')::integer,payload->>'status',(payload->>'opens_on')::date,(payload->>'closes_on')::date);
  else
   update public.ecc_programmes set name=trim(payload->>'name'),season=trim(payload->>'season'),fee_cents=(payload->>'fee_cents')::integer,status=payload->>'status',opens_on=(payload->>'opens_on')::date,closes_on=(payload->>'closes_on')::date where id=(payload->>'id')::uuid;
   if not found then raise exception 'Programme not found'; end if;
  end if;
 when 'add_membership' then
  select * into programme from public.ecc_programmes where id=(payload->>'programme_id')::uuid and status='open' and (opens_on is null or opens_on<=current_date) and (closes_on is null or closes_on>=current_date) for share;
  if not found then raise exception 'Programme is not open'; end if;
  insert into public.ecc_memberships(member_id,programme_id,season,fee_cents) values((payload->>'member_id')::uuid,programme.id,programme.season,programme.fee_cents);
 when 'decide_application' then
  if payload->>'status' not in ('active','rejected') or length(trim(coalesce(payload->>'note',''))) not between 1 and 1000 then raise exception 'Decision and reason required'; end if;
  update public.ecc_memberships set status=payload->>'status',decision_note=trim(payload->>'note') where id=(payload->>'id')::uuid and status='pending';
  if not found then raise exception 'Application is no longer pending'; end if;
 when 'record_payment' then
  select * into membership from public.ecc_memberships where id=(payload->>'membership_id')::uuid for update;
  if not found then raise exception 'Membership not found'; end if;
  select coalesce(sum(case when kind='payment' then amount_cents else -amount_cents end),0) into paid from public.ecc_payments where membership_id=membership.id;
  if (payload->>'amount_cents')::integer is null or (payload->>'amount_cents')::integer<=0 then raise exception 'Invalid amount'; end if;
  if payload->>'kind'='refund' and (payload->>'amount_cents')::integer>paid then raise exception 'Refund exceeds recorded payments'; end if;
  if payload->>'kind'='payment' and (membership.status='rejected' or (payload->>'amount_cents')::integer>membership.fee_cents-paid) then raise exception 'Payment exceeds balance or membership rejected'; end if;
  insert into public.ecc_payments(membership_id,amount_cents,kind,method,reference,note,received_on,recorded_by) values(membership.id,(payload->>'amount_cents')::integer,payload->>'kind',payload->>'method',trim(payload->>'reference'),trim(payload->>'note'),(payload->>'received_on')::date,auth.uid());
 when 'assign_team' then
  if not exists(select 1 from public.ecc_memberships where member_id=(payload->>'member_id')::uuid and season=payload->>'season' and status='active') then raise exception 'Active membership in this season required'; end if;
  insert into public.ecc_assignments(member_id,team,season) values((payload->>'member_id')::uuid,payload->>'team',payload->>'season') on conflict(member_id,team,season) do nothing;
 when 'remove_assignment' then
  delete from public.ecc_assignments where id=(payload->>'id')::uuid;
  if not found then raise exception 'Assignment not found'; end if;
 when 'invite_staff' then
  if exists(select 1 from public.ecc_staff where lower(email)=lower(trim(payload->>'email')) and active) then raise exception 'Already has access'; end if;
  update public.ecc_invitations set status='revoked' where lower(email)=lower(trim(payload->>'email')) and status='pending' and expires_at<=now();
  insert into public.ecc_invitations(email,role,created_by) values(lower(trim(payload->>'email')),payload->>'role',auth.uid());
 when 'revoke_invitation' then
  update public.ecc_invitations set status='revoked' where id=(payload->>'id')::uuid and status='pending';
  if not found then raise exception 'Pending invitation not found'; end if;
 when 'update_staff' then
  perform pg_advisory_xact_lock(730301);
  select * into old_staff from public.ecc_staff where user_id=(payload->>'user_id')::uuid for update;
  if not found then raise exception 'Staff account not found'; end if;
  if payload->>'role' is null or payload->>'active' is null then raise exception 'Access state required'; end if;
  if old_staff.role='admin' and old_staff.active and ((payload->>'role')<>'admin' or not (payload->>'active')::boolean) and (select count(*) from public.ecc_staff where role='admin' and active)<2 then raise exception 'Keep at least one active administrator'; end if;
  update public.ecc_staff set role=payload->>'role',active=(payload->>'active')::boolean where user_id=old_staff.user_id;
 when 'save_notice' then
  if payload->>'status' not in ('draft','published') then raise exception 'Invalid notice status'; end if;
  row_id:=coalesce(nullif(payload->>'id','')::uuid,gen_random_uuid());
  if nullif(payload->>'id','') is not null and not exists(select 1 from public.ecc_notices where id=row_id) then raise exception 'Notice not found'; end if;
  insert into public.ecc_notices(id,message,action_label,action_href,status,expires_at) values(row_id,trim(payload->>'message'),coalesce(payload->>'action_label',''),coalesce(payload->>'action_href',''),payload->>'status',((payload->>'expires_on')::date+1)::timestamp at time zone 'Europe/Amsterdam')
  on conflict(id) do update set message=excluded.message,action_label=excluded.action_label,action_href=excluded.action_href,status=excluded.status,expires_at=excluded.expires_at,updated_at=now();
 when 'save_message' then
  insert into public.ecc_message_drafts(subject,body,audience,created_by) values(trim(payload->>'subject'),trim(payload->>'body'),payload->>'audience',auth.uid());
 else raise exception 'Unknown action';
 end case;
end $$;
revoke all on function public.ecc_admin_execute(text,jsonb) from public,anon;
grant execute on function public.ecc_admin_execute(text,jsonb) to authenticated;

create function public.ecc_public_notice() returns table(message text,action_label text,action_href text) language sql stable security definer set search_path='' as $$
 select n.message,n.action_label,n.action_href from public.ecc_notices n where n.status='published' and (n.expires_at is null or n.expires_at>now()) order by n.updated_at desc,n.id limit 1
$$;
revoke all on function public.ecc_public_notice() from public;
grant execute on function public.ecc_public_notice() to anon,authenticated;
