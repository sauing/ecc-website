import {test,after} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";
import {parseProfile} from "../lib/account/profile.ts";
const db=new PGlite();
const first="00000000-0000-4000-8000-000000000001",second="00000000-0000-4000-8000-000000000002";
await db.exec(`create role anon;create role authenticated;create schema auth;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('email',current_setting('request.jwt.claim.email',true))$$;
create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
grant usage on schema auth to authenticated;`);
await db.exec(await readFile(new URL("../supabase/migrations/202611040003_account_profiles.sql",import.meta.url),"utf8"));
const backfillId="00000000-0000-4000-8000-000000000003";
await db.query("insert into auth.users values($1,'Backfill@example.com','{\"full_name\":\"Existing Member\"}')",[backfillId]);
await db.query("insert into public.ecc_web_profiles values($1,'Existing Street 12, Test City','+31612345678')",[backfillId]);
await db.exec(await readFile(new URL("../supabase/migrations/202611040004_profile_identity.sql",import.meta.url),"utf8"));
async function as(id,role="authenticated"){await db.exec(`reset role;set role ${role}`);await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.email',$2,false)",[id??"",`${id}@example.com`]);}
const insert=(id,address="Test Street 10, 1234 AB Test City, NL",phone="+31612345678")=>db.query("insert into public.ecc_web_profiles(user_id,address,phone,full_name,email) values($1,$2,$3,'Test Member',$4)",[id,address,phone,`${id}@example.com`]);
const rows=async()=> (await db.query("select * from public.ecc_web_profiles")).rows;
test("address/phone validation rejects missing data and privilege fields",()=>{
 assert.deepEqual(parseProfile({address:"  Test Street 10, 1234 AB Test City, NL  ",phone:"+31 (6) 1234-5678"}),{address:"Test Street 10, 1234 AB Test City, NL",phone:"+31612345678"});
 for(const value of [null,{address:"",phone:"+31612345678"},{address:"Test Street 10",phone:"0612345678"},{address:"Test Street 10",phone:"+00000000"},...['user_id','role','email','fullName'].map(key=>({address:"Test Street 10",phone:"+31612345678",[key]:second}))]) assert.throws(()=>parseProfile(value));
});
test("profile keeps the five agreed fields and backfills existing account identity",async()=>{
 const {rows}=await db.query("select column_name from information_schema.columns where table_name='ecc_web_profiles' order by ordinal_position");
 assert.deepEqual(rows.map(row=>row.column_name),["user_id","address","phone","full_name","email"]);
 const existing=(await db.query("select full_name,email from public.ecc_web_profiles where user_id=$1",[backfillId])).rows[0];
 assert.deepEqual(existing,{full_name:"Existing Member",email:"backfill@example.com"});
});
test("anonymous visitors cannot read or save profiles",async()=>{
 await as(null,"anon");await assert.rejects(rows,/permission denied/);await assert.rejects(insert(first),/permission denied/);
});
test("a signed-in user saves and reloads their own required details",async()=>{
 await as(first);await insert(first);assert.equal((await rows())[0].phone,"+31612345678");
 await db.query("update public.ecc_web_profiles set address=$1 where user_id=$2",["Updated Street 20, 2345 BC Test City, NL",first]);
 assert.match((await rows())[0].address,/Updated Street/);
});
test("users cannot read, replace or create another account's profile",async()=>{
 await as(second);assert.equal((await rows()).length,0);await assert.rejects(insert(first),/row-level security/);
 assert.equal((await db.query("update public.ecc_web_profiles set phone='+31622222222' where user_id=$1 returning user_id",[first])).rows.length,0);
 await insert(second);await assert.rejects(db.query("update public.ecc_web_profiles set user_id=$1 where user_id=$2",[first,second]),/row-level security/);
});
test("database rejects missing contact details and denies profile deletion",async()=>{
 await as(second);await assert.rejects(db.query("update public.ecc_web_profiles set address=''"),/check constraint/);
 await assert.rejects(db.query("update public.ecc_web_profiles set phone='123'"),/check constraint/);
 await assert.rejects(db.query("delete from public.ecc_web_profiles"),/permission denied/);
});
test("profile email must match the authenticated identity",async()=>{
 await as(second);
 await assert.rejects(db.query("update public.ecc_web_profiles set email='another@example.com' where user_id=$1",[second]),/row-level security/);
 await assert.rejects(db.query("update public.ecc_web_profiles set full_name='' where user_id=$1",[second]),/check constraint/);
});
after(async()=>{await db.close();});
