# Eindhoven Cricket Club Website Features

Reviewed against the repository and local account flow on 4 November 2026. Google sign-in, required contact-profile saving and a real My ECC member portal are connected locally. Three necessary ecc_web_ tables are deployed in the personal Supabase project. Profiles include name, verified email, address and phone, with existing rows backfilled. Approved admins enter the admin portal. Production Google callbacks/environment setup, secretary provisioning and PIN server-key activation remain pending.

Statuses: `Developed` = implemented for the stated scope; `Demo` = fictional/in-memory prototype; `Partial` = some functionality exists; `Planned` = not implemented; `Blocked` = waiting on a named dependency. Only Developed items are checked. No items are currently classified as Blocked.

The public website is deployed on Vercel. Membership, payments and administrative operations are not production-ready. A deployed page or working demo does not mean the underlying service is implemented.

## Foundation and deployment

- [x] `Developed` — Next.js, React and TypeScript project with local development, typecheck and production build commands.
- [x] `Developed` — Personal GitHub repository and automatic Vercel deployment from main. Latest checked deployment: commit 0ff1779.
- [ ] `Planned` — Separate staging environment and documented environment/secrets management.
- [ ] `Partial` — Three minimal website tables are deployed: ecc_web_staff for approved access, ecc_web_device_pins for optional browser PIN credentials, and ecc_web_profiles for user ID, full name, verified email snapshot, address and phone. Existing profiles are backfilled; broader business schema remains archived.
- [ ] `Partial` — Email/password admin login and Google sign-in are connected locally without SMTP. Google identity and initial contact saving were tested by the user. Optional six-digit PIN remains gated by server-key activation. Secretary provisioning and production Google deployment configuration remain pending.
- [ ] `Partial` — Current admin/moderator role is checked server-side from ecc_web_staff. PIN login also checks active admin access, expires after 30 days, locks after five failures and supports removing all saved PIN devices. Invitations, access-management UI and business audit workflows are deferred.
- [ ] `Planned` — GDPR consent, export and deletion tools.
- [x] `Developed` — MY ECC / LOGIN enters real role-aware authentication: approved staff go to /admin, other accounts go to /my-ecc, and incomplete profiles go to contact onboarding. The demo chooser is removed. The retired /admin/preview URL redirects to the protected admin portal.
- [ ] `Partial` — Protected /admin now renders a responsive dashboard with sidebar/mobile navigation, real account status, sign-out and Account & security. Optional PIN setup/removal remains gated by its configuration. Other modules are explicitly marked not connected; no business-record mutations are enabled.

- [x] `Developed` — Responsive authenticated portal; the former sample-data preview and its links have been removed. Portal dashboard, settings and pending module checked at 320, 390, 768 and 1280px with no overflow/clipped headings; mobile navigation closes after selection. Earlier preview checks are retained only as historical QA evidence.
- [x] `Developed` — Fifteen PostgreSQL/policy checks cover access isolation, password/PIN inputs, per-device keyed PIN digests, five-attempt lockout, expiry, replacement, removal and revocation. Ten older tests remain separate for the archived full draft.

## Player and membership management

- [x] `Developed` — Public /membership catalogue with seven programmes, descriptions and programme dates.
- [ ] `Partial` — Membership types are listed; approved fees, eligibility, availability and some programme dates need confirmation.
- [x] `Developed` — Account-first /join uses Google sign-in, asks for required postal address and phone, and saves a private profile. Name and verified email are recorded from the authenticated identity. No membership choice or payment is required at signup. Verified locally; production configuration remains separate.
- [ ] `Planned` — Real registration with server validation, persistent applications and approved policy/guardian requirements.
- [ ] `Planned` — Persistent player profiles and individual player season-statistics pages.
- [x] `Developed` — Real /my-ecc member portal with desktop sidebar, mobile navigation, Overview, My profile and Membership views, saved profile details and club links. No fictional membership, payment or player statistics. Checked at 320, 390 and 1280px; tested views have no horizontal overflow.
- [x] `Developed` — Authenticated member login and own address/phone editing persist to Supabase. Seven isolated database tests cover validation, five agreed fields, existing-account backfill, isolation, persistence, verified-email matching and deletion denial. Admin directory/editing and login-email changes are separate future workflows.
- [ ] `Planned` — Membership application approval/rejection is planned. No live application workflow or public admin demo remains; on-behalf completion semantics still need agreement.
- [ ] `Planned` — Programme editing, fee snapshots and member filtering are planned. Reference schema/validation drafts are archived; no programme or membership tables are deployed.
- [ ] `Planned` — Season assignments/removal and public squad synchronization are planned; their live module is not connected.
- [ ] `Planned` — Membership renewal reminders.

- [ ] `Planned` — Member directory, pending applications and guardian records are planned; the live Members section is not connected.

## Payments

- [ ] `Planned` — Member registration checkout is not connected; the retired Join demo checkout is removed. No money is collected.
- [ ] `Demo` — Tournament payment status, receipt previews and manual payment/refund simulations using fictional records.
- [ ] `Planned` — Stripe checkout and verified, idempotent server-side payment webhooks.
- [ ] `Planned` — Manual payment/refund ledger and balances are planned. Reference schema/validation drafts are archived; no payment table or real transactions are enabled.
- [ ] `Planned` — Real receipts, confirmations and failed-payment reminders.
- [ ] `Planned` — Real member, season-squad and payment CSV exports are planned. The fictional admin export UI has been retired.
- [ ] `Planned` — Approved prices, refund/cancellation policies and production reconciliation.

## Cricket operations

- [x] `Developed` — Shared desktop/mobile navigation for ECC1–ECC4, Youth 1 and Youth 2.
- [x] `Developed` — Senior team pages with standings/records, result summaries, squad statistics and batter/bowler highlights. ECC1 includes ODI/T20 views; coverage varies by team and format.
- [x] `Developed` — Club batting/bowling/fielding statistics with format filters, search and sorting. Much of the data comes from stored snapshots; this is not a complete live career-data service.
- [x] `Developed` — Homepage matchday ribbon supports multiple matches on the same date.
- [ ] `Partial` — KNCB fixture/statistics API integration with cached refresh on relevant pages. Requests are tied to season 2026, external-service availability and stored/fallback data. Complete synchronization and season rollover remain pending.
- [x] `Developed` — Fixtures and results are available by team and season on the existing team pages, with a homepage matchday ribbon. This satisfies the requested scope; a separate club-wide match-centre page is not required.
- [ ] `Partial` — Results and score summaries exist; comprehensive automatic updates and full match scorecards remain pending.
- [ ] `Planned` — Youth 1 and Youth 2 squads, fixtures and statistics; both team pages are placeholders.
- [ ] `Planned` — Integrated calendar and availability management; the real member portal has no linked availability workflow yet.
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
- [x] `Developed` — Automatic homepage slideshows retain the existing photos and include eight approved club photos from October 2026. The story slideshow has 15 photos, photo selection and pause/play controls; imported photos are resized WebP files with no original metadata.
- [x] `Developed` — Photo gallery requirement fulfilled by the curated homepage slideshows, using selected club-approved photos alongside the existing images. No public album links or separate gallery page are required; online media management is outside this scope.
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
- [ ] `Planned` — Admin notice editing and publishing are planned. No notices table is deployed; the public website retains its existing notice fallback.
- [ ] `Planned` — Documents and policies.
- [ ] `Planned` — Quick links management.
- [ ] `Planned` — Online club store.

## Communications

- [x] `Developed` — Social page and Instagram/Facebook homepage tabs with curated content and external links.
- [ ] `Planned` — Automatic Instagram/Facebook feed synchronization.
- [ ] `Planned` — Zoho domain email configuration; external mailbox setup is not verified by this repository.
- [ ] `Demo` — Tournament email previews remain fictional; the retired Join secretary preview is removed. No transactional email is delivered.
- [ ] `Planned` — Verified sender, email queue and automated registration/payment emails.
- [ ] `Planned` — Team/fixture notifications, renewal reminders and admin announcement delivery.

- [ ] `Planned` — Admin communication drafts and delivery are planned. No message table, Zoho sending or scheduling is enabled.

## Launch and quality

- [x] `Developed` — Responsive layouts across 20 routes, compact mobile menu with grouped team links, larger touch controls, phone-friendly forms/dialogs and labeled scrollable tables with sticky player names.
- [x] `Developed` — Browser verification across seven widths (320–1440px), totaling 140 route/width combinations, plus selected interaction checks. Mobile changes passed typecheck and production build; the rebased push passed typecheck.
- [ ] `Planned` — Physical iOS/Android testing and comprehensive accessibility/screen-reader audit.
- [ ] `Partial` — Selected club content/assets incorporated; complete SportsPlus migration and reconciliation remain pending.
- [ ] `Partial` — Site/page titles and descriptions exist; comprehensive SEO, redirects, sitemap and migration validation remain pending.
- [ ] `Partial` — Next.js patched to 16.4.1; production dependency audit reports no known vulnerabilities. Local database permission tests pass. Local HTTPS uses system certificate trust; auth connection failures return service errors rather than incorrect-password messages. Full hosted security review remains pending.
- [ ] `Planned` — Club domain connection and DNS verification.
- [ ] `Planned` — Operational production launch: real authentication, storage, payments, notifications, approved content/policies and final acceptance checks. Vercel deployment alone does not complete this item.

Supporting notes: [mobile QA](docs/mobile-compatibility-qa.md), [admin requirements](docs/admin-requirements.md), [account setup](docs/join-account-setup.md).
