# Tournament experience

Routes: `/tournaments`, `/tournaments/team`, `/tournaments/admin`.

This is an explicitly labelled, public, in-memory prototype. React context shares changes across client-side navigation under the tournament layout. Refresh resets the prototype. There is no authentication, database, payment gateway, email delivery or real booking. Use fictional data only. Admin preview does not grant privileges.

Implemented: catalogue and format/period filters; rules dialog; sample team registration with duplicate detection; separate entry/payment status; waitlist; captain status, squad editing and demo receipt; simulated successful/failed checkout; cancellation/refund-pending; admin creation and draft publishing, capacity-aware approval, payment filtering and demo payment/refund updates, CSV export and email preview feedback.

Approved/confirmed entries reserve capacity. Waitlisted or submitted entries do not. Payment is requested only after approval. Cancellation releases capacity. All dates, fees and fixture examples are illustrative; live/past lists intentionally empty. No public personal/payment records are exposed; seed entries are fictional. The shared header retains existing sections and adds Tournaments.

Before production: authenticated captains and server-enforced board roles; persistent database with tenant/ownership constraints; transactional slot reservations and duplicate controls; provider checkout with verified idempotent webhooks (never trust client success); audit trail for manual payments; verified sender/email queue; price/refund/weather/eligibility policies; final dates and assets; real fixtures/results and accessibility/security testing. No real data or money may be used until those are in place.

## Verification (18 October 2026)

- Production build: all 21 routes generated successfully.
- Browser: register fictional QA Demo XI, verify submitted entry in admin, approve, reject another approval at capacity, simulate failed payment then successful retry, confirm shared totals/status.
- Browser: create fictional QA Invitational draft, publish, verify on public catalogue.
- Mobile 390px: page width stays within viewport. Tablet 900px: compact navigation bounds fit, including crest and Join ECC. Desktop public page visually inspected.
- Browser console error check: none observed during tested flow.
- Tests use in-memory records; no test data is included in the deployed seed.
