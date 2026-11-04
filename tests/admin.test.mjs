import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { validateAction, canPerform, balance, csvCell } from "../app/admin/domain.ts";

const db = new PGlite();
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
create table auth.identities(user_id uuid references auth.users(id),provider text);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to anon,authenticated;`);
for (const [n, email, verified] of [[1,"admin@example.com",true],[2,"moderator@example.com",true],[3,"ordinary@example.com",true],[4,"invited@example.com",true],[5,"unverified@example.com",false]]) {
 await db.query("insert into auth.users values($1,$2,$3)", [uid(n),email,verified?"2026-10-30T00:00:00Z":null]);
 await db.query("insert into auth.identities values($1,'google')", [uid(n)]);
}
await db.exec(await readFile(new URL("../docs/deferred/admin-full-draft.sql", import.meta.url),"utf8"));
await db.query("insert into public.ecc_staff values($1,'admin@example.com','admin',true),($2,'moderator@example.com','moderator',true)",[uid(1),uid(2)]);
async function as(n, role="authenticated") { await db.exec(`reset role; set role ${role}`); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[n?uid(n):""]); }
const rpc = (action,payload) => db.query("select public.ecc_admin_execute($1,$2::jsonb)",[action,JSON.stringify(payload)]);
const rows = async table => (await db.query(`select * from public.${table}`)).rows;
let memberId,programmeId,membershipId;

test("input validation, role limits and CSV formula protection",()=>{
 assert.equal(canPerform("moderator","update_staff"),false);
 assert.equal(canPerform("moderator","save_notice"),true);
 assert.throws(()=>validateAction("save_notice",{message:"Hello",status:"published",action_label:"Click",action_href:"javascript:alert(1)"}));
 assert.equal(csvCell("=SUM(A1:A5)"),'"\'=SUM(A1:A5)"');
 assert.equal(balance({id:"x",fee_cents:10000},[{membership_id:"x",kind:"payment",amount_cents:7000},{membership_id:"x",kind:"refund",amount_cents:2000}]),5000);
});
test("anonymous and ordinary accounts cannot access administration",async()=>{
 await as(null,"anon"); await assert.rejects(rows("ecc_members"),/permission denied/);
 await assert.rejects(rpc("invite_staff",{email:"x@example.com",role:"admin"}),/permission denied/);
 await as(3); assert.equal((await rows("ecc_members")).length,0);
 await assert.rejects(rpc("invite_staff",{email:"ordinary@example.com",role:"admin"}),/Access denied/);
});
test("real database writes snapshot membership fees and reject duplicates",async()=>{
 await as(1);
 await rpc("save_member",{name:"Test Member",email:"member@example.com",phone:""});
 await rpc("save_programme",{name:"Test Season",season:"2027",fee_cents:10000,status:"open",opens_on:null,closes_on:null});
 memberId=(await rows("ecc_members"))[0].id;programmeId=(await rows("ecc_programmes"))[0].id;
 await rpc("add_membership",{member_id:memberId,programme_id:programmeId});membershipId=(await rows("ecc_memberships"))[0].id;
 await rpc("save_programme",{id:programmeId,name:"Test Season",season:"2027",fee_cents:20000,status:"open",opens_on:null,closes_on:null});
 assert.equal((await rows("ecc_memberships"))[0].fee_cents,10000);
 await assert.rejects(rpc("add_membership",{member_id:memberId,programme_id:programmeId}),/duplicate key/);
});
test("moderators cannot read member records or escalate access",async()=>{
 await as(2);assert.equal((await rows("ecc_members")).length,0);
 await assert.rejects(rpc("update_staff",{user_id:uid(2),role:"admin",active:true}),/Administrator required/);
 await assert.rejects(db.query("delete from public.ecc_audit"),/permission denied/);
});
test("payments and approval stay independent; excessive amounts roll back atomically",async()=>{
 await as(1);const base={membership_id:membershipId,method:"bank",reference:"TEST-1",note:"Confirmed outside site",received_on:"2026-10-30"};
 await rpc("record_payment",{...base,amount_cents:6000,kind:"payment"});assert.equal((await rows("ecc_memberships"))[0].status,"pending");
 await assert.rejects(rpc("record_payment",{...base,amount_cents:1000,kind:"payment"}),/duplicate key/);
 await rpc("decide_application",{id:membershipId,status:"active",note:"Approved for test"});assert.equal((await rows("ecc_payments")).length,1);
 const before=(await rows("ecc_audit")).length;
 await assert.rejects(rpc("record_payment",{...base,amount_cents:5000,kind:"payment"}),/exceeds balance/);
 await assert.rejects(rpc("record_payment",{...base,amount_cents:7000,kind:"refund"}),/exceeds recorded/);
 assert.equal((await rows("ecc_audit")).length,before);
 assert.equal(balance((await rows("ecc_memberships"))[0],await rows("ecc_payments")),4000);
 await assert.rejects(rpc("decide_application",{id:membershipId,status:"rejected",note:"Stale request"}),/no longer pending/);
});
test("team assignment needs active membership in the exact season",async()=>{
 await as(1);await assert.rejects(rpc("assign_team",{member_id:memberId,team:"ECC1",season:"2028"}),/Active membership/);
 await rpc("assign_team",{member_id:memberId,team:"ECC1",season:"2027"});assert.equal((await rows("ecc_assignments")).length,1);
});
test("the last administrator cannot be disabled or downgraded",async()=>{
 await as(1);await assert.rejects(rpc("update_staff",{user_id:uid(1),role:"moderator",active:true}),/at least one/);
 await assert.rejects(rpc("update_staff",{user_id:uid(1),role:"admin",active:false}),/at least one/);
});
test("invitation checks verified Google identity and exact email; revocation is immediate",async()=>{
 await as(1);await rpc("invite_staff",{email:"invited@example.com",role:"admin"});
 await as(3);await db.query("select public.ecc_accept_invitation()");assert.equal((await rows("ecc_staff")).length,0);
 await as(4);await db.query("select public.ecc_accept_invitation()");assert.equal((await rows("ecc_staff")).find(x=>x.user_id===uid(4)).role,"admin");
 await as(1);await rpc("invite_staff",{email:"unverified@example.com",role:"admin"});
 await as(5);await assert.rejects(db.query("select public.ecc_accept_invitation()"),/Verified Google/);
 await as(1);await rpc("update_staff",{user_id:uid(4),role:"admin",active:false});
 await as(4);await assert.rejects(rpc("save_member",{name:"Blocked",email:"blocked@example.com"}),/Access denied/);
 assert.equal((await rows("ecc_members")).length,0);
});
test("only published, unexpired notice content is public",async()=>{
 await as(2);const base={action_label:"",action_href:"",expires_on:null};
 await rpc("save_notice",{...base,message:"Public notice",status:"published"});
 await rpc("save_notice",{...base,message:"Private draft",status:"draft"});
 await rpc("save_notice",{...base,message:"Expired notice",status:"published",expires_on:"2020-01-01"});
 await as(null,"anon");assert.deepEqual((await db.query("select * from public.ecc_public_notice()")).rows,[{message:"Public notice",action_label:"",action_href:""}]);
 await assert.rejects(rows("ecc_notices"),/permission denied/);
});
test("moderator drafts and audit history do not expose other people's records",async()=>{
 await as(1);await rpc("save_message",{subject:"Admin only",body:"Private draft",audience:"All members"});
 await as(2);await rpc("save_message",{subject:"Moderator draft",body:"Draft content",audience:"ECC1"});
 assert.deepEqual((await rows("ecc_message_drafts")).map(x=>x.subject),["Moderator draft"]);
 await assert.rejects(rpc("send_message",{}),/Administrator required/);
 assert.equal((await rows("ecc_audit")).every(x=>["ecc_notices","ecc_message_drafts"].includes(x.entity)&&x.actor_id===uid(2)),true);
});
after(async()=>{await db.close();});
