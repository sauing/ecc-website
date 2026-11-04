import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { newDeviceSecret, deviceDigest, pinDigest, validDeviceSecret } from "../lib/admin/pin-crypto.ts";
const db = new PGlite();
const admin = "00000000-0000-4000-8000-000000000001";
const moderator = "00000000-0000-4000-8000-000000000002";
const pepper = "local-test-only-secret-never-used-in-the-application-1234";
const secret = newDeviceSecret(), device = deviceDigest(secret), correct = pinDigest(secret,"001234",pepper), wrong = pinDigest(secret,"111111",pepper);
await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated;`);
for (const file of ["202611040001_admin_access.sql", "202611040002_admin_device_pins.sql"]) await db.exec(await readFile(new URL(`../supabase/migrations/${file}`,import.meta.url),"utf8"));
await db.query("insert into public.ecc_web_staff values($1,'admin',true),($2,'moderator',true)",[admin,moderator]);
const service = () => db.exec("reset role; set role service_role");
const setup = (id=admin, hash=device, pin=correct, previous=null) => db.query("select public.ecc_web_set_pin($1,$2,$3,$4)",[id,hash,pin,previous]);
const claim = async (hash=device,pin=correct) => (await db.query("select public.ecc_web_claim_pin($1,$2) as id",[hash,pin])).rows[0].id;
const available = async () => (await db.query("select public.ecc_web_pin_available($1) as available",[device])).rows[0].available;

test("PIN protection depends on both browser secret and server secret",()=>{
  assert.equal(validDeviceSecret(secret),true);assert.notEqual(secret,newDeviceSecret());
  assert.equal(device.length,64);assert.equal(correct.length,64);assert.notEqual(correct,wrong);
  assert.notEqual(correct,pinDigest(newDeviceSecret(),"001234",pepper));
  assert.notEqual(correct,pinDigest(secret,"001234",pepper+"other"));
  assert.throws(()=>pinDigest(secret,"001234","short"));
});
test("quick login adds only one five-column table",async()=>{
  const {rows}=await db.query("select table_name,column_name from information_schema.columns where table_schema='public' and table_name like 'ecc_web_%'");
  assert.deepEqual([...new Set(rows.map(row=>row.table_name))].sort(),["ecc_web_device_pins","ecc_web_staff"]);
  assert.equal(rows.filter(row=>row.table_name==='ecc_web_device_pins').length,5);
});
test("browser clients cannot read PIN hashes or execute privileged PIN functions",async()=>{
  for(const role of ["anon","authenticated"]){
    await db.exec(`reset role; set role ${role}`);
    await assert.rejects(db.query("select * from public.ecc_web_device_pins"),/permission denied/);
    await assert.rejects(setup(),/permission denied/);
    await assert.rejects(claim(),/permission denied/);
    await assert.rejects(db.query("select public.ecc_web_remove_pins($1)",[admin]),/permission denied/);
    await assert.rejects(db.query("select public.ecc_web_pin_available($1)",[device]),/permission denied/);
  }
});
test("only an active admin can enroll; a browser secret is required for quick login",async()=>{
  await service();await assert.rejects(setup(moderator),/Administrator required/);
  await setup();assert.equal(await available(),true);assert.equal(await claim(),admin);
  assert.equal(await claim(deviceDigest(newDeviceSecret())),null);
});
test("five wrong PIN attempts disable the credential, including a subsequent correct PIN",async()=>{
  await service();
  await Promise.all(Array.from({length:5},()=>claim(device,wrong)));
  assert.equal(await available(),false);assert.equal(await claim(),null);
  await db.exec("reset role");
  const {rows}=await db.query("select failed_attempts from public.ecc_web_device_pins where device_hash=$1",[device]);
  assert.equal(rows[0].failed_attempts,5);
});
test("replacement removes the old browser credential and successful login resets failures",async()=>{
  await service();const nextSecret=newDeviceSecret(), nextDevice=deviceDigest(nextSecret), nextPin=pinDigest(nextSecret,"001234",pepper);
  await setup(admin,nextDevice,nextPin,device);assert.equal(await claim(),null);
  assert.equal(await claim(nextDevice,wrong),null);assert.equal(await claim(nextDevice,nextPin),admin);
  await db.exec("reset role");
  assert.equal((await db.query("select failed_attempts from public.ecc_web_device_pins where device_hash=$1",[nextDevice])).rows[0].failed_attempts,0);
});
test("expired credentials and revoked admin access cannot issue a login",async()=>{
  await db.exec("reset role");await db.exec("delete from public.ecc_web_device_pins");
  await service();await setup();
  await db.exec("reset role");await db.exec("update public.ecc_web_device_pins set expires_at=now()-interval '1 second'");
  await service();assert.equal(await claim(),null);assert.equal(await available(),false);
  await setup(admin,device,correct,device);
  await db.exec("reset role");await db.query("update public.ecc_web_staff set active=false where user_id=$1",[admin]);
  await service();assert.equal(await claim(),null);assert.equal(await available(),false);
});
test("removing all quick logins invalidates saved browser credentials",async()=>{
  await service();await db.query("select public.ecc_web_remove_pins($1)",[admin]);
  assert.equal(await claim(),null);assert.equal(await available(),false);
});
after(async()=>{await db.close();});
