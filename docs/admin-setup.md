# Admin login setup

Current scope: email/password sign-in, a protected dashboard with desktop/mobile navigation and Account & security and an optional ECC PIN for quick login on password-approved browsers. Google remains an optional integration. Zoho SMTP is not needed for password or ECC PIN login. No email codes or password-reset emails are currently sent.

## Database — three website tables, each required

| Table | Purpose | Fields |
| --- | --- | --- |
| ecc_web_staff | Approved admin/moderator access | user_id, role, active |
| ecc_web_device_pins | Optional trusted-browser PIN credentials | device_hash, user_id, pin_hash, failed_attempts, expires_at |
| ecc_web_profiles | Private account contact record | user_id, full_name, email, address, phone |

Supabase Auth owns identities, password hashes and sessions. ECC stores no passwords, raw PINs or session tokens in its tables. Both tables use RLS; browser accounts can read only their own active staff row and cannot read PIN records or call PIN functions. The PIN functions are available only to the backend's server role. No extra membership/payment/content tables are deployed.

Apply the reviewed files in `supabase/migrations/` in order on a new project. The first access migration was applied to personal project `vyvcdiocumkwfusywvdl` on 4 November 2026. The PIN migration was also applied successfully on 4 November 2026; hosted checks confirmed its functions are backend-only. See admin-qa.md for evidence. Do not rerun an already-applied migration. The old full schema in `docs/deferred/` is archived and must not be deployed.

## Connect the app

Copy `.env.example` to `.env.local` and set APP_URL, project URL and publishable key. The current local checkout already connects to the personal project at `http://127.0.0.1:3000`. Localhost and 127.0.0.1 differ: always use the configured origin. Run `pnpm dev` and open `/admin`.

Ordinary password sign-in needs only the publishable key and does not depend on the PIN backend secret. Google sign-in is now connected locally; see [account setup](join-account-setup.md) for its exact callback and production configuration still required. Never disable confirmation project-wide to get around email setup: this shared project also serves other apps.

## Create the two approved accounts

Initial administrators requested by the user:

- info@eindhovencc.com
- secretary@eindhovencc.com

1. A trusted project owner verifies who controls each staff address outside the website. Public Google account creation grants no staff access.
2. In Supabase Authentication → Users → Add user → Create new user, enter the exact email and a strong, unique website password. The account owner should enter their password directly, without sharing it in chat. Do not reuse the Zoho mailbox password. Use at least 12 characters for a new password.
3. Confirm this particular account only after the owner has been verified. Manual confirmation is an explicit owner decision; do not weaken project-wide confirmation settings. Creating the account through the administrative interface avoids sending a confirmation email. An account alone has no ECC access.
4. Provision only those verified identities with the following owner-run SQL. Review the selected identities before executing the insert:

```sql
select id, email, email_confirmed_at
from auth.users
where lower(email) in ('info@eindhovencc.com','secretary@eindhovencc.com');

insert into public.ecc_web_staff(user_id,role,active)
select id,'admin',true from auth.users
where lower(email) in ('info@eindhovencc.com','secretary@eindhovencc.com')
  and email_confirmed_at is not null;
```

Confirm exactly the intended accounts were granted. Current hosted state (4 November 2026): info@eindhovencc.com was created by the user, confirmed, and explicitly granted active administrator access. Secretary provisioning remains pending. No account or role is created automatically by this code. The public Contacts page is never an authorization source.

5. Sign in at `/admin`; the server verifies Supabase identity and a fresh access row every time. No session/client metadata grants a role. A non-admin gets an access-required page. Revoking active access also invalidates future PIN logins.
6. Forgotten-password email is unavailable until email delivery is added. A trusted maintainer must verify the owner and perform a manual reset. The password cannot be retrieved. Supabase, not ECC, owns password storage.

## Optional separate ECC PIN

After signing in with a password, an admin can set a six-digit ECC PIN for their current private browser. Enrollment and removal require the current password again. Moderators cannot enroll. The PIN never works from a new browser without its cryptographically random HttpOnly device cookie.

- Thirty-day credential lifetime; signing in does not extend it.
- Five failed PIN attempts disable that saved credential, including further correct attempts. SQL row locking makes the limit atomic.
- Password sign-in remains available; reenrollment rotates the browser credential and removes the replaced one.
- Remove all my ECC PIN quick logins revokes every saved browser credential for that admin.
- Ordinary sign-out intentionally leaves the trusted-browser PIN available. Remove quick logins to forget browsers.
- No raw PIN, password or refresh token is saved in ECC tables or localStorage. The table stores a SHA-256 device digest and a per-device HMAC-SHA-256 PIN digest protected by a server-only random key.
- PIN session issuance refuses users with a verified MFA factor; an MFA challenge flow must be added before combining the features.

### PIN backend configuration

Set these only on the server:

```text
AUTH_PIN_ENABLED=true
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET_KEY
AUTH_PIN_SECRET=RANDOM_SERVER_SECRET_AT_LEAST_32_BYTES
```

The secret key has broad Supabase project privileges and needs explicit approval before granting the application this access. Store it only in `.env.local` (Git-ignored) or the deployment's secret environment; never prefix it NEXT_PUBLIC, print it or send it to the browser. The PIN key should be a cryptographically random 32-byte value encoded as base64 or hex (at least 43 characters). Rotating it makes existing PIN digests unusable; users then sign in with passwords and reenroll. Do not rotate it silently.

HTTPS is required except on loopback development hosts. The production device cookie uses Secure, HttpOnly, SameSite=Strict and the __Host prefix. The server uses a narrowly exposed PIN RPC, validates the existing account and active admin role, generates and consumes a one-time Supabase credential on the server, then checks the role again before accepting the session. No email is sent and the one-time credential is never returned to the browser. The app must never offer an endpoint to generate arbitrary account sessions.

Without the secret key or PIN enable flag, password login works and PIN setup clearly remains unavailable. No mock PIN login is substituted.

## Google later

Google sign-in remains in the code and UI, disabled until provider setup. Follow [Supabase Google setup](https://supabase.com/docs/guides/auth/social-login/auth-google), preserve other applications' redirect URLs, then set `AUTH_GOOGLE_ENABLED=true`. A Zoho email address must itself have a Google account to use that method. A Google-only admin must establish a website password before enrolling an ECC PIN.

## Code boundaries and checks

`lib/admin/auth.ts` and `lib/admin/quick-login.ts` define provider-independent interfaces; `lib/admin/service.ts` selects adapters. `lib/supabase/` implements provider calls, while `lib/admin/pin-crypto.ts` contains standalone server cryptography. UI/API routes use the contracts. `proxy.ts` refreshes Supabase cookies.

Run `pnpm test:admin`, `pnpm typecheck`, and `pnpm build`. Fifteen checks cover the actual access/PIN migrations, role restrictions, revocation, expiry, concurrency, hashes, replacement and input rules. The first account creation and successful password login against hosted Supabase were verified on 4 November 2026. Full PIN enrollment/logout/login still requires the server-key configuration and account-owner acceptance. Member, payment, messaging, invitation and CMS modules are marked not connected in the live portal. The former sample-data preview has been removed; /admin/preview redirects to the protected /admin portal.

## Local HTTPS certificate troubleshooting

The start/dev/build scripts use Node's `--use-system-ca` flag (use Node.js 24.6 or newer). This trusts the operating system's existing certificate authorities in addition to Node's bundled roots. It fixes managed-network certificate-chain failures while retaining certificate validation. Never use NODE_TLS_REJECT_UNAUTHORIZED=0 as a workaround.

A provider connection/configuration failure now returns 503 with a service-unavailable message. Only an actual credentials/account rejection is shown as a sign-in error; rate limits return 429. No password, tokens, raw auth response or request body is logged.

## Website entry workflow

MY ECC / LOGIN links to /login, which redirects to /admin. Signed-out visitors get the real password form. A successful login returns to /admin and renders the dashboard shell. Existing sessions go directly to the dashboard. Sidebar links use /admin?section=... and reverify identity and role on every request. Account & security contains the optional PIN controls. Unconnected modules show an honest pending state and never display fabricated club statistics. No new tables were added for this UI.
