# ECC administration — confirmed requirements

Public club content, stats, team squads and social pages do not require login. Personal addresses, WhatsApp numbers, member records, payment information and mutation endpoints remain protected; public browsing does not mean public personal records.

## Initial administrator identities

Updated by the user on 4 November 2026: use only these accounts for now:

- info@eindhovencc.com
- secretary@eindhovencc.com

These supersede the earlier board list, including secretary1. Do not infer access from the public Contacts page. Latest workflow: email/password login with an optional separately created ECC PIN for password-approved browsers; Google remains optional. Each address must have an owner-verified identity before its exact subject can be approved. No public preview or typed email grants access.

## Admin capabilities to implement

### Access management — confirmed addition

Administrators must be able to invite additional administrators and moderators, assign their roles, and revoke access. Invitations do not grant access until the intended recipient signs in with a verified identity. Moderators must not be able to promote themselves or grant administrative access. Changes require server-enforced authorization and an audit record. This is a requirement, not implemented access provisioning.

### Core capabilities

1. Add membership programmes/types.
2. View members, filtered by membership type.
3. View payment status and payment type/method separately.
4. Assign members to a team for a season. Persist membership-to-team-to-season assignments; show the public squad on that season's team page without inventing player performance statistics.
5. Complete memberships on a member's behalf. Confirm exact completion semantics before implementing. Membership status must not silently mark an unpaid membership as paid; any override needs explicit reason/audit history.
6. Previously requested notice publishing and editing.

## Current implementation — incremental workflow

As requested on 4 November 2026, start with real admin login only. `ecc_web_staff` stores approved access. The requested optional PIN adds one five-column table, `ecc_web_device_pins`, for trusted-browser credentials, expiry and attempt limits. Its migration was applied to the personal Supabase project; no roles have been provisioned. Local project connection is configured; info@eindhovencc.com now has a user-created password account and explicitly approved active administrator access. Its successful password login and active administrator dashboard are verified. Secretary provisioning and PIN server credentials remain pending. Authentication code is separated behind a provider-independent contract.

The former sample-data preview and its links are removed. Only the protected /admin portal is served; /admin/preview redirects there. Other modules remain explicitly unconnected. Earlier full database work is archived outside active migrations. Develop members, programmes, payments, invitations, notices and other features one at a time, adding only necessary tables. See [setup](admin-setup.md) and [database boundaries](database-boundaries.md).

## Earlier POC (retired)
Compact `/login` page with disabled Google sign-in, explicit public demo preview, and planned-tool overview. Header/mobile labels say Admin login. No real credentials, sessions, member data or functional admin tools yet. Full admin dashboard and public team synchronization are pending.

## Production requirements
Verify the authenticated identity server-side, including confirmed email; provision roles against trusted identity records. Enforce authorization on every read/write endpoint, not in client UI alone. No admin grant from typed email, local storage, query string or a demo button. Record privileged changes in an audit log. Keep payment confirmation separate from admin completion. No real data in the public POC preview.

## Confirmed entry workflow

MY ECC / LOGIN → real email/password form → protected admin dashboard. Authenticated admins skip the form. The live portal now uses the sidebar/mobile administration shell with account/security settings; other modules remain explicitly not connected until their workflows are implemented.
