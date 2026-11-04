-- Optional ECC PIN quick login. Exactly one extra table; no passwords or sessions.
begin;
create table public.ecc_web_device_pins (
  device_hash text primary key check (device_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid not null references public.ecc_web_staff(user_id) on delete cascade,
  pin_hash text not null check (pin_hash ~ '^[0-9a-f]{64}$'),
  failed_attempts integer not null default 0 check (failed_attempts between 0 and 5),
  expires_at timestamptz not null default now() + interval '30 days'
);
alter table public.ecc_web_device_pins enable row level security;
revoke all on public.ecc_web_device_pins from public, anon, authenticated, service_role;
comment on table public.ecc_web_device_pins is 'ECC website only: optional password-approved browser PIN credentials. No raw PIN, password or session tokens.';

create function public.ecc_web_set_pin(owner_id uuid, device_digest text, pin_digest text, previous_device text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.ecc_web_staff where user_id=owner_id and role='admin' and active) then
    raise exception 'Administrator required';
  end if;
  delete from public.ecc_web_device_pins where user_id=owner_id
    and (expires_at <= now() or device_hash=previous_device);
  insert into public.ecc_web_device_pins(device_hash,user_id,pin_hash)
    values(device_digest,owner_id,pin_digest);
end;
$$;

create function public.ecc_web_pin_available(device_digest text)
returns boolean language sql security definer set search_path = '' as $$
  select exists(select 1 from public.ecc_web_device_pins p join public.ecc_web_staff s on s.user_id=p.user_id
    where p.device_hash=device_digest and p.failed_attempts<5 and p.expires_at>now() and s.active and s.role='admin');
$$;

create function public.ecc_web_claim_pin(device_digest text, pin_digest text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare credential public.ecc_web_device_pins;
begin
  select * into credential from public.ecc_web_device_pins where device_hash=device_digest for update;
  if not found or credential.expires_at<=now() or credential.failed_attempts>=5 then return null; end if;
  if not exists (select 1 from public.ecc_web_staff where user_id=credential.user_id and active and role='admin') then return null; end if;
  if credential.pin_hash<>pin_digest then
    update public.ecc_web_device_pins set failed_attempts=failed_attempts+1 where device_hash=device_digest;
    return null;
  end if;
  update public.ecc_web_device_pins set failed_attempts=0 where device_hash=device_digest;
  return credential.user_id;
end;
$$;

create function public.ecc_web_remove_pins(owner_id uuid)
returns void language sql security definer set search_path = '' as $$
  delete from public.ecc_web_device_pins where user_id=owner_id;
$$;

revoke all on function public.ecc_web_set_pin(uuid,text,text,text), public.ecc_web_pin_available(text),
  public.ecc_web_claim_pin(text,text), public.ecc_web_remove_pins(uuid) from public, anon, authenticated;
grant execute on function public.ecc_web_set_pin(uuid,text,text,text), public.ecc_web_pin_available(text),
  public.ecc_web_claim_pin(text,text), public.ecc_web_remove_pins(uuid) to service_role;
commit;
