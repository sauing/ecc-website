# Current admin access verification — 4 November 2026

Current scope: password sign-in and optional trusted-browser ECC PIN. No SMTP is needed. Supabase manages password hashes and sessions; website tables contain only access and keyed PIN credential data.

- `pnpm test:admin`: 15 checks passed against the actual migrations in isolated PostgreSQL, plus input/cryptography checks. Covers active/ordinary/moderator access, self-promotion denial, device-bound PIN digest, table/RPC isolation, correct login lookup, five-attempt lockout, credential replacement, success reset, expiry, revocation and removing saved PIN devices.
- `pnpm typecheck` passed after regenerating route types to remove the deleted email-OTP route.
- `pnpm build` passed with password and PIN handlers.
- Hosted PIN migration was applied successfully through the SQL Editor. It adds only ecc_web_device_pins (five fields), RLS and backend-only functions. No real PIN credential was enrolled. The user subsequently created info@eindhovencc.com; its confirmed identity was checked, and after explicit action-time approval one active admin access row was inserted and verified.
- The first password account, info@eindhovencc.com, is created and has active ECC admin access. Secretary provisioning and the server-only key for issuing PIN sessions remain pending. Successful password sign-in was verified in the local browser against hosted Supabase: info@eindhovencc.com reached the active Administrator landing page. PIN enrollment/logout/login remain unverified pending its server-key configuration. No passwords, PINs or real member records were entered into tools or stored in code. Password login page checked at 320px without page overflow; Show/Hide password toggles correctly. PIN RPC permissions checked in hosted SQL: anonymous=false, authenticated=false, service_role=true.

## Archived broader preview verification

The following describes the earlier full draft and its design preview, not activated production capabilities. Run its tests separately with `pnpm test:admin:draft`.

# Core administration verification

Verified locally on 2 November 2026. Supabase and Google are not configured in this checkout; no real accounts, member records, payments or emails were used.

## Automated checks

- `pnpm typecheck`: passed.
- `pnpm test:admin`: 10 tests passed against the actual migration in an isolated PGlite PostgreSQL engine. The Supabase auth schema/identity function are represented by a small fixture; hosted authentication itself is not simulated as verified.
- Tests cover anonymous/private access, ordinary-user and moderator privilege escalation, persistent writes, duplicate membership/transaction protection, snapshotted fees, payment/approval independence, rejected overpayments/refunds with atomic rollback, season assignment eligibility, last-admin protection, exact-email verified-Google invitations, revocation, public notice filtering and ownership of moderator drafts/audit reads.
- `pnpm audit --prod`: no known vulnerabilities after patching Next.js to 16.4.1.
- `pnpm build`: passed with all 28 generated pages/handlers and the auth proxy.

## Browser checks

- All 12 admin sections inspected at 320, 390, 768 and 1280 CSS pixels: 48 combinations, no page-level horizontal overflow or clipped inspected headings/paragraphs/buttons. Wide tables deliberately scroll within labeled regions.
- Member search for the fictional Jamie record returned one row.
- Member preview form accepted fictional input, then clearly reported that nothing was saved. No request granting live access was made.
- Staff invitation form offers admin and moderator roles with verified-identity/manual-sharing information.
- At 320 × 568, the invitation dialog remained within the viewport and its 44px close control was reachable.
- Browser error logs: none during the inspected flow.
- Screenshots and raw layout measurements: ignored `.tmp/admin-qa/` directory.

## Closed access without configuration

- `/admin` displays setup rather than club records, with private/no-store caching.
- `/admin/preview` displays fictional records only.
- `GET /api/admin`: 503, no records returned.
- Unauthenticated/origin-less `POST /api/admin`: 403, no write.
- Unconfigured `POST /auth/google` and callback: 503.
- `/api/club-notice`: public null result without database configuration.

## Not yet verified

Real Supabase hosting/migrations, Google OAuth callback/cookie refresh, real invitations/sign-out, hosted persistence and concurrent database transactions, email delivery, backups/restore, physical-device and exhaustive accessibility testing. These require the club's configured staging project. See [admin setup](admin-setup.md).

## Local sign-in certificate fix

A direct Node fetch reproduced SELF_SIGNED_CERT_IN_CHAIN. The same public-provider settings check returned HTTP 200 with email enabled when Node used --use-system-ca. Startup/dev/build scripts now use the existing OS certificate store with certificate verification enabled. After rebuilding and restarting, retrying the already-filled user login form reached the active administrator portal. The password was neither read nor revealed. An additional regression check separates invalid credentials, provider/network failures and throttling (401/503/429).

## Portal entry and navigation

Production build passed. Anonymous HTTP request to /login follows the redirect and returns the real password form (no demo chooser). In the authenticated browser, homepage MY ECC / LOGIN reached /admin and its Club dashboard. Account & security navigation, a pending Members module and mobile-menu dismissal were verified. Dashboard/settings/pending module passed 12 width/view combinations (320,390,768,1280): no horizontal overflow or clipped headings. Login issuance and access guards are unchanged. The user remains signed in; no password or session was exposed. No new tables or role changes were introduced.

## Admin preview retirement

The old preview panel, fictional data source and unused demo login component/styles were removed. No application link points to /admin/preview. That URL now redirects to /admin: authenticated browser verification reached the real Club dashboard with zero preview links and no admin@example.com sample identity. Anonymous HTTP verification reached the actual password form. Production build passed. Existing module placeholders remain honest about pending backend workflows; no new table, account or access grant was involved.
