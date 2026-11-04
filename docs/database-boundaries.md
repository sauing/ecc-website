# ECC website database boundaries

Website-owned tables, indexes and functions use `ecc_web_`, distinct from the existing auction/season/fantasy data in this shared personal Supabase project. Never modify unrelated tables, auth accounts, providers or redirect settings as a side effect.

## Current inventory

| Object | Purpose |
| --- | --- |
| public.ecc_web_staff | Approved identity UUID, role and active flag |
| public.ecc_web_device_pins | Optional trusted-browser PIN: device/PIN digests, owner, attempt count and expiry |
| public.ecc_web_profiles | Account subject, full_name, verified email snapshot, postal address and phone |
| auth identities, passwords and sessions | Supabase Auth, shared project; no ECC duplicate |

The PIN table exists only because the requested optional PIN workflow needs revocation and persistent atomic attempt limits. Its five fields have concrete uses. No membership, payment, notice, message, invitation or general audit tables are deployed. Add a table only for a concrete agreed workflow. Privileged business-editing workflows need their audit requirements implemented before release.

PIN credentials reference the website's access table, never unrelated project records. Staff IDs have no foreign key into the shared Supabase auth schema. Browser clients have no access to PIN data; fixed server-only RPCs are the only application interface. No passwords, raw PINs, email codes or refresh tokens are stored in website tables.

## Moving later

1. Export only ecc_web_staff and ecc_web_profiles schema/data and the reviewed current migrations. Verify backup and row counts. Never export unrelated shared-project accounts/data.
2. Authentication migration is separate. Export only the approved accounts' necessary ID-to-verified-identity mapping, then remap staff and profile user_id to the destination identity subjects. UUIDs and password/session portability must not be assumed.
3. Do not carry browser PIN credentials to a new origin/provider. Start the PIN table empty and have admins reapprove browsers after password sign-in. Browser cookies and protection keys belong to the deployment. Invalidate retired PINs deliberately.
4. With Supabase retained, update project URL/keys and callbacks. With another provider, replace lib/supabase adapters, proxy refresh and the policy auth.uid() expression. Auth session issuance in the PIN adapter must use the destination provider's supported secure mechanism. UI/domain contracts stay separate.
5. Test approved/unapproved/revoked accounts, PIN lockout/expiry/removal and both roles before retiring the old connection. Remove old credentials and callbacks after acceptance.

The archived full draft under docs/deferred is not a deployable migration or an import script.

## Account profiles

There are three website tables. Profiles remain separate from authentication through `lib/account` contracts and `lib/supabase` adapters. The profile identity columns are a readable contact record requested by the club; credentials and verified login email authority remain in Supabase Auth. The API derives name/email and subject from the verified session and accepts only address/phone from the form. Database policies require the subject and email to match the authenticated identity. Owners can read/update their own profile; anonymous users and other account owners cannot access it.

Migration 202611040004 backfills only existing ECC website profile rows from their matching auth identity. It changes no unrelated account or table. Administrative directory/edit permissions and verified-email changes are future workflows. Creating a profile grants neither staff access nor an active cricket membership.
