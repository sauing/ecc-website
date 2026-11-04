import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { normalizeEmail, validEmail, validPassword, validPin } from "../lib/admin/login-policy.ts";
import { passwordFailure } from "../lib/admin/auth-errors.ts";

const db = new PGlite();
test("network, certificate and provider configuration errors are not reported as bad passwords", () => {
  assert.equal(passwordFailure({ code: "invalid_credentials", status: 400 }), "invalid");
  assert.equal(passwordFailure({ code: "email_not_confirmed", status: 400 }), "invalid");
  assert.equal(passwordFailure({ status: 0 }), "unavailable");
  assert.equal(passwordFailure({ code: "unexpected_failure", status: 500 }), "unavailable");
  assert.equal(passwordFailure({ code: "invalid_api_key", status: 401 }), "unavailable");
  assert.equal(passwordFailure({ status: 429 }), "limited");
});
test("password and PIN input validation preserves leading zeros", () => {
  assert.equal(normalizeEmail(" INFO@EINDHOVENCC.COM "), "info@eindhovencc.com");
  assert.equal(validEmail("info@eindhovencc.com"), true);
  assert.equal(validEmail("bad email"), false);
  assert.equal(normalizeEmail(null), "");
  assert.equal(validPassword("a long example password"), true);
  assert.equal(validPassword(null), false);
  assert.equal(validPassword(""), false);
  assert.equal(validPin("001234"), true);
  assert.equal(validPin("12345"), false);
  assert.equal(validPin(123456), false);
  assert.equal(validPin("123456<script>"), false);
});
const admin = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
await db.exec(`create role anon; create role authenticated; create schema auth;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated;`);
await db.exec(await readFile(new URL("../supabase/migrations/202611040001_admin_access.sql", import.meta.url), "utf8"));
await db.query("insert into public.ecc_web_staff values($1,'admin',true),($2,'moderator',true)", [admin, other]);
const rows = async () => (await db.query("select * from public.ecc_web_staff")).rows;
async function as(id, role = "authenticated") {
  await db.exec(`reset role; set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id ?? ""]);
}
test("phase one creates exactly one application table", async () => {
  const result = await db.query("select tablename from pg_tables where schemaname='public'");
  assert.deepEqual(result.rows.map(row => row.tablename), ["ecc_web_staff"]);
});
test("anonymous and unapproved identities cannot read access records", async () => {
  await as(null, "anon"); await assert.rejects(rows, /permission denied/);
  await as("00000000-0000-4000-8000-000000000003"); assert.equal((await rows()).length, 0);
});
test("approved users see only their own active access", async () => {
  await as(admin); assert.deepEqual(await rows(), [{ user_id: admin, role: "admin", active: true }]);
  await as(other); assert.equal((await rows())[0].role, "moderator");
});
test("users cannot provision, promote or delete access", async () => {
  await as(other);
  await assert.rejects(db.query("update public.ecc_web_staff set role='admin'"), /permission denied/);
  await assert.rejects(db.query("insert into public.ecc_web_staff values(gen_random_uuid(),'admin',true)"), /permission denied/);
  await assert.rejects(db.query("delete from public.ecc_web_staff"), /permission denied/);
});
test("revocation takes effect on the next read", async () => {
  await db.exec("reset role");
  await db.query("update public.ecc_web_staff set active=false where user_id=$1", [admin]);
  await as(admin); assert.equal((await rows()).length, 0);
});
after(async () => { await db.close(); });
