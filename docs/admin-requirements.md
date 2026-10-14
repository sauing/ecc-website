# ECC administration — confirmed requirements

Public club content, stats, team squads and social pages do not require login. Personal addresses, WhatsApp numbers, member records, payment information and mutation endpoints remain protected; public browsing does not mean public personal records.

## Initial administrator identities
User requested admin privileges for the current contact-page board emails:
- chairman@eindhovencc.com
- vicechairman@eindhovencc.com
- info@eindhovencc.com
- treasurer@eindhovencc.com
- secretary1@eindhovencc.com
- shravanparakala@gmail.com

Amit Sharma is no longer with the club and must not receive access. The duplicate Shravan entry was consolidated by the user. This list records intended provisioning only, not a working authorization mechanism. Do not automatically grant access to every future contact-page entry.

## Admin capabilities to implement
1. Add membership programmes/types.
2. View members, filtered by membership type.
3. View payment status and payment type/method separately.
4. Assign members to a team for a season. Persist membership-to-team-to-season assignments; show the public squad on that season's team page without inventing player performance statistics.
5. Complete memberships on a member's behalf. Confirm exact completion semantics before implementing. Membership status must not silently mark an unpaid membership as paid; any override needs explicit reason/audit history.
6. Previously requested notice publishing and editing.

## POC delivered
Compact `/login` page with disabled Google sign-in, explicit public demo preview, and planned-tool overview. Header/mobile labels say Admin login. No real credentials, sessions, member data or functional admin tools yet. Full admin dashboard and public team synchronization are pending.

## Production requirements
Verify Google identity server-side, including verified email; provision roles against trusted identity records. Enforce authorization on every read/write endpoint, not in client UI alone. No admin grant from typed email, local storage, query string or a demo button. Record privileged changes in an audit log. Keep payment confirmation separate from admin completion. No real data in the public POC preview.
