# Eindhoven Cricket Club website

Next.js / React / TypeScript proof of concept for replacing the club's SportsPlus website.

## Local development

New to running websites? Follow [START-HERE.md](START-HERE.md) for the step-by-step Windows guide.

Install Node.js 24.6 or newer and pnpm, then run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. `pnpm typecheck` checks TypeScript; `pnpm build` produces a production build; `pnpm start` serves it.

## Included

- Club homepage, match ribbon, photo galleries and club information.
- Club statistics and season-specific team pages.
- Membership catalogue, photo-led youth cricket page, contacts and social pages.
- Dedicated `/partners` showcase and interest-based partnership enquiry; prepares an email draft for review and sending.
- Responsive phone/tablet layouts, touch-sized controls and scrollable statistics tables. See `docs/mobile-compatibility-qa.md` for the route and interaction checks.
- `/join`: real Google account creation followed by required address and phone; membership can be selected later.
- `/login`: real role-aware sign-in; approved staff enter administration and other users enter My ECC.
- `/my-ecc`: authenticated member portal with Overview, My profile, saved contact editing and Membership information. See [account setup](docs/join-account-setup.md).
- `/admin`: a protected dashboard with desktop/mobile navigation, account/security settings, email/password sign-in and optional trusted-browser ECC PIN, with separate provider adapters. Account provisioning and PIN server-key activation are required. See [admin setup](docs/admin-setup.md); the retired `/admin/preview` URL redirects to `/admin`.
- `pnpm test:admin`: 15 isolated PostgreSQL/policy checks of access and PIN credentials, attempt limits, revocation and expiry.

## POC boundaries

Join and My ECC use real authentication and private profiles. The tournament flows remain demos. Club-management modules remain unconnected, with no admin demo data or preview interface. Three minimal website tables are deployed; see docs/database-boundaries.md for ownership and portability. Membership enrolment, online payments and transactional email are not connected. The contact form opens a local email draft rather than sending from the server. Social feeds are not synchronized. Never enter real records in a tournament demo.

See `docs/` and `FEATURES.md` for implementation notes and planned capabilities. Public contact information and existing club assets are included; local environment files, dependencies and generated build output are excluded from Git.

The dev/build/start commands use Node’s system certificate trust so HTTPS works on managed Windows networks. Certificate verification stays enabled.
