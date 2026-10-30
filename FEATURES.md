# Eindhoven Cricket Club Website Features

Reviewed against the repository on 30 October 2026.

Statuses: `Developed` = implemented for the stated scope; `Demo` = fictional/in-memory prototype; `Partial` = some functionality exists; `Planned` = not implemented; `Blocked` = waiting on a named dependency. Only Developed items are checked. No items are currently classified as Blocked.

The public website is deployed on Vercel. Membership, payments and administrative operations are not production-ready. A deployed page or working demo does not mean the underlying service is implemented.

## Foundation and deployment

- [x] `Developed` — Next.js, React and TypeScript project with local development, typecheck and production build commands.
- [x] `Developed` — Personal GitHub repository and automatic Vercel deployment from main. Latest checked deployment: commit 0ff1779.
- [ ] `Planned` — Separate staging environment and documented environment/secrets management.
- [ ] `Planned` — Secure database, migrations and persistent application records.
- [ ] `Planned` — Google sign-in, verified identities, sessions and account linking.
- [ ] `Planned` — Server-enforced roles, permissions, ownership constraints and privileged-change audit history.
- [ ] `Planned` — GDPR consent, export and deletion tools.
- [ ] `Demo` — Public member/admin entry points at /login. Google sign-in is disabled; general admin tools are planned descriptions. Tournament admin has an interactive demo.
- [ ] `Planned` — Authenticated general admin dashboard.

## Player and membership management

- [x] `Developed` — Public /membership catalogue with seven programmes, descriptions and programme dates.
- [ ] `Partial` — Membership types are listed; approved fees, eligibility, availability and some programme dates need confirmation.
- [ ] `Demo` — /join walkthrough: sample identity, editable details, membership selection, junior/guardian fields, review and simulated payment outcomes. State is lost on refresh/restart.
- [ ] `Planned` — Real registration with server validation, persistent applications and approved policy/guardian requirements.
- [ ] `Planned` — Persistent player profiles and individual player season-statistics pages.
- [ ] `Demo` — /my-ecc fictional dashboard with membership, team, statistics, matches and an external availability-app link.
- [ ] `Planned` — Authenticated member login and self-service editing.
- [ ] `Planned` — Membership approvals and audited completion on a member's behalf, with membership status separate from payment status.
- [ ] `Planned` — Admin creation/editing of membership programmes and member filtering by membership type.
- [ ] `Planned` — Persistent team/player assignments by season, reflected on public squads.
- [ ] `Planned` — Membership renewal reminders.

## Payments

- [ ] `Demo` — Registration checkout success, cancellation and failure simulations; no money is collected.
- [ ] `Demo` — Tournament payment status, receipt previews and manual payment/refund simulations using fictional records.
- [ ] `Planned` — Stripe checkout and verified, idempotent server-side payment webhooks.
- [ ] `Planned` — Persistent payment status, payment method and transaction history, distinct from membership/entry approval.
- [ ] `Planned` — Real receipts, confirmations and failed-payment reminders.
- [ ] `Planned` — Treasurer payment reports and audit history for manual adjustments.
- [ ] `Planned` — Approved prices, refund/cancellation policies and production reconciliation.

## Cricket operations

- [x] `Developed` — Shared desktop/mobile navigation for ECC1–ECC4, Youth 1 and Youth 2.
- [x] `Developed` — Senior team pages with standings/records, result summaries, squad statistics and batter/bowler highlights. ECC1 includes ODI/T20 views; coverage varies by team and format.
- [x] `Developed` — Club batting/bowling/fielding statistics with format filters, search and sorting. Much of the data comes from stored snapshots; this is not a complete live career-data service.
- [x] `Developed` — Homepage matchday ribbon supports multiple matches on the same date.
- [ ] `Partial` — KNCB fixture/statistics API integration with cached refresh on relevant pages. Requests are tied to season 2026, external-service availability and stored/fallback data. Complete synchronization and season rollover remain pending.
- [ ] `Partial` — Fixtures/results display exists in the ribbon and team pages. A dedicated schedule/match-centre destination remains pending; the homepage Fixtures & Results card still links to #.
- [ ] `Partial` — Results and score summaries exist; comprehensive automatic updates and full match scorecards remain pending.
- [ ] `Planned` — Youth 1 and Youth 2 squads, fixtures and statistics; both team pages are placeholders.
- [ ] `Planned` — Integrated calendar and availability management; the member demo only links to an external app.
- [ ] `Planned` — Practice and club-event scheduling/management.
- [ ] `Partial` — Ground address, map and directions are on Contacts; dedicated grounds/facilities information remains pending.
- [ ] `Planned` — Ground and practice-net status.

## Tournaments

- [ ] `Demo` — Catalogue, format/period filters and rules dialogs with illustrative dates, fees and fixtures.
- [ ] `Demo` — Team registration, duplicate detection, separate approval/payment states and waitlist.
- [ ] `Demo` — Captain portal: entry status, squad editing, simulated checkout, receipt preview and cancellation/refund-pending state.
- [ ] `Demo` — Tournament admin: draft creation/publishing, capacity-aware approvals, payment filtering, payment/refund updates, CSV export and email-preview feedback.
- [ ] `Planned` — Real captain/admin authentication, persistent records, transactional capacity reservations and server-side duplicate controls.
- [ ] `Planned` — Real checkout/refunds, email delivery, fixtures/results and confirmed operational policies/content.

All tournament state is in memory and resets on refresh. Public demo access grants no real administrative privileges. See [tournament scope](docs/tournament-poc.md).

## Club content

- [x] `Developed` — Homepage with photo hero, matchday ribbon, feature links, club story/statistics, social tabs and sponsor strip.
- [x] `Developed` — About page with history, mission and community details.
- [x] `Developed` — Dedicated photo-led Youth page using club photographs.
- [x] `Developed` — Automatic homepage slideshow and photo content on public pages.
- [ ] `Planned` — Dedicated gallery and media-management tools.
- [ ] `Planned` — Club videos.
- [x] `Developed` — Homepage sponsor logos/links and dedicated Partners page with a shared partner catalogue.
- [x] `Developed` — Partnership-interest selection and enquiry form preparing an email draft for the visitor to review and send.
- [ ] `Planned` — Sponsor management in admin and server-side partnership enquiry storage/delivery.
- [x] `Developed` — Contacts page with address, map, directions and board contact listings.
- [x] `Developed` — Contact form with email-draft handoff; no server-side email is sent or stored.
- [ ] `Planned` — Server-side contact delivery and enquiry management.
- [ ] `Partial` — Board information exists on Contacts; dedicated management/board pages and content administration remain pending.
- [ ] `Planned` — News and announcement publishing.
- [x] `Developed` — Shared responsive notice bar with central public configuration, optional action link and club-motto fallback. No active announcement is currently configured.
- [ ] `Planned` — Authenticated notice/urgent-flash editor, publishing permissions, editing/unpublishing and expiry scheduling.
- [ ] `Planned` — Documents and policies.
- [ ] `Planned` — Quick links management.
- [ ] `Planned` — Online club store.

## Communications

- [x] `Developed` — Social page and Instagram/Facebook homepage tabs with curated content and external links.
- [ ] `Planned` — Automatic Instagram/Facebook feed synchronization.
- [ ] `Planned` — Zoho domain email configuration; external mailbox setup is not verified by this repository.
- [ ] `Demo` — Registration/secretary and tournament email previews; nothing is delivered.
- [ ] `Planned` — Verified sender, email queue and automated registration/payment emails.
- [ ] `Planned` — Team/fixture notifications, renewal reminders and admin announcement delivery.

## Launch and quality

- [x] `Developed` — Responsive layouts across 20 routes, compact mobile menu with grouped team links, larger touch controls, phone-friendly forms/dialogs and labeled scrollable tables with sticky player names.
- [x] `Developed` — Browser verification across seven widths (320–1440px), totaling 140 route/width combinations, plus selected interaction checks. Mobile changes passed typecheck and production build; the rebased push passed typecheck.
- [ ] `Planned` — Physical iOS/Android testing and comprehensive accessibility/screen-reader audit.
- [ ] `Partial` — Selected club content/assets incorporated; complete SportsPlus migration and reconciliation remain pending.
- [ ] `Partial` — Site/page titles and descriptions exist; comprehensive SEO, redirects, sitemap and migration validation remain pending.
- [ ] `Planned` — Security/dependency and permissions review, including the Next.js security upgrade reported by the local development server.
- [ ] `Planned` — Club domain connection and DNS verification.
- [ ] `Planned` — Operational production launch: real authentication, storage, payments, notifications, approved content/policies and final acceptance checks. Vercel deployment alone does not complete this item.

Supporting notes: [mobile QA](docs/mobile-compatibility-qa.md), [admin requirements](docs/admin-requirements.md), [registration demo boundaries](docs/join-demo.md).
