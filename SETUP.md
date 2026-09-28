# TAP production setup

## 1. Create Supabase

1. Create a free project at Supabase.
2. Open **SQL Editor**.
3. Run `supabase/migrations/001_initial.sql`.
4. Run `supabase/migrations/002_production_auth_fixes.sql`.
5. Run `supabase/migrations/003_search_avatar_discovery.sql`.
6. Run `supabase/migrations/004_stabilization_hardening.sql`.
7. Run `supabase/migrations/005_verified_stats_core.sql`.

## 2. Configure the app

1. Open **Project Settings → API**.
2. Copy the Project URL and anon/public key.
3. Copy `.env.example` to `.env.local`.
4. Paste those values into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Set `VITE_APP_URL` to your local or production site URL.

Never put the service-role key in a Vite environment variable.

## 3. Configure authentication

In **Authentication → URL Configuration**:

- Site URL: your production site URL.
- Redirect URLs: `http://localhost:5173/**` and `https://YOUR-DOMAIN/**`.

Email confirmation may be enabled or disabled; TAP supports both.

## 4. Deploy account deletion

Install the Supabase CLI, sign in, then run:

    supabase functions deploy delete-account
    supabase secrets set ALLOWED_ORIGINS=http://localhost:5173,https://YOUR-DOMAIN

Supabase automatically supplies the function's service-role secret. Do not copy it into the frontend.

## 5. Deploy on Cloudflare Pages

1. Connect the Git repository.
2. Build command: `pnpm build`
3. Output directory: `dist`
4. Node version: 20 or newer.
5. Add the three `VITE_*` environment variables from `.env.example`.
6. Deploy, then replace `YOUR-DOMAIN` in the Supabase URL settings and function secret.

The checked-in `public/_redirects` provides the SPA fallback.

## 6. Verified Stats 0.5A

Deploy the refresh scaffolding:

    supabase functions deploy refresh-verified-stats
    supabase functions deploy scheduled-verified-stats --no-verify-jwt
    supabase secrets set VERIFIED_STATS_CRON_SECRET=YOUR-LONG-RANDOM-SECRET

Configure Supabase Cron to POST to `scheduled-verified-stats` with the same
`x-cron-secret` header when scheduled refresh is enabled. The scheduled function
currently builds a bounded refresh queue; provider-specific dispatch is part of
0.5B.

Official provider API/OAuth secrets are not required for the 0.5A schema and UI.
Add them only to Supabase Edge Function secrets when individual adapters are
implemented. Never expose provider secrets through `VITE_*` variables.
