# Eindhoven Cricket Club website

Next.js / React / TypeScript proof of concept for replacing the club's SportsPlus website.

## Local development

Install Node.js and pnpm, then run:

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
- `/join`: in-memory demonstration of registration, payment outcomes and a secretary email preview.
- `/login`: member and admin demo entry points.
- `/my-ecc`: fictional member dashboard with membership, team, stats, matches and an external availability-app link.

## POC boundaries

No real Google authentication, membership activation, payment processing or transactional email is implemented. Demo data is explicitly labelled. The contact form opens a local email draft rather than sending from the server. Social feeds are not synchronized. The admin tools are planned previews, not functional management pages. Never use this POC to store private member or payment data.

See `docs/` and `FEATURES.md` for implementation notes and planned capabilities. Public contact information and existing club assets are included; local environment files, dependencies and generated build output are excluded from Git.
