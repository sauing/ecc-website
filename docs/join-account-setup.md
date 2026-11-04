# Join ECC and My ECC

Updated 4 November 2026.

1. Open `/join` and choose Continue with Google.
2. Choose your Google account and approve Google's sign-in request.
3. Enter your full postal address and phone number, including country code.
4. Save to open My ECC. Membership can be chosen later.

Returning users enter through MY ECC / LOGIN. Approved staff go to `/admin`; other accounts go to `/my-ecc`. Accounts without contact details are asked to complete their profile first.

My ECC has Overview, My profile and Membership navigation. Contact editing saves to the database. Membership currently links to the programme catalogue and club contact page; enrolment, approvals, team assignments and payments are not connected. No fictional membership/payment/statistics records are displayed.

## Agreed membership access workflow — not yet implemented

An account without an active membership keeps the current basic portal. An active membership unlocks the fuller dashboard with My memberships, My teams, My stats and My matches, following the earlier member dashboard reference. The admin assigns the member to a team; the assigned squad and availability-portal link become available after that assignment. Signing in or completing a profile must never activate membership features. Future access checks must use persisted, server-verified membership and assignment records rather than browser state.

## Where details are saved

- Supabase Authentication → Users: verified identity, Google name/email and sessions.
- Table Editor → public.ecc_web_profiles: user_id, full_name, email, address and phone. One row per completed account.
- The IDs connect both records. The profile API takes identity from the verified session. Users cannot submit another account ID/email or read someone else's record.
- Admin directory/editing is not connected yet. Editing a contact record must not silently change its authentication email.

## Google configuration

The personal Google Cloud project is ECC Website (`ecc-website-513712`). The support/contact address is `board.eindhovencc@gmail.com`. The personal owner retains project ownership; the board account has OAuth Config Editor access. Some console pages need additional read permissions, so project-owner access was used for the remaining setup. No billing or paid trial was enabled.

Google's web OAuth client redirects to `https://vyvcdiocumkwfusywvdl.supabase.co/auth/v1/callback`. Its client ID and secret are configured in Supabase Authentication → Sign In / Providers → Google. Never commit the client secret or place it in browser code.

For local development, `.env.local` uses `APP_URL=http://127.0.0.1:3000` and `AUTH_GOOGLE_ENABLED=true`, alongside the public Supabase URL/key. Supabase allows the exact return URL `http://127.0.0.1:3000/auth/callback`. Use 127.0.0.1 consistently rather than switching to localhost. The shared project's default Site URL was preserved.

The production website still needs its own exact allowed return URL and deployment environment configuration before production Google login is claimed ready. Do not add broad wildcard redirects or change unrelated shared-project settings.

## Verified

Google login and initial contact saving were completed by the user. The member portal loads the saved account. The identity backfill migration was applied to the hosted project. Seven isolated database tests cover backfill, the five-column schema, input validation, own-account persistence, isolation, email matching and deletion denial. Responsive portal checks are recorded in `.tmp/join-qa` (local QA evidence, not committed).
