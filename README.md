# TAP

TAP is a mobile-first social identity app with Supabase authentication, persistent profiles, connections and cards, public/private share pages, avatar storage and a PWA shell.

## Prerequisites

- Node.js 20+
- pnpm
- A free Supabase project for real accounts

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Without Supabase environment values, TAP enters an isolated Example mode. It never treats local storage as real account data.

## Supabase

1. Create a project.
2. Run migrations `001_initial.sql`, `002_production_auth_fixes.sql`, then `003_search_avatar_discovery.sql`.
3. Enable email/password authentication.
4. Copy the project URL and anon key into `.env.local`.
5. Add local and production Auth redirect URLs.
6. Deploy the `delete-account` Edge Function if account deletion is required.

See [SETUP.md](SETUP.md) for the beginner-friendly dashboard steps.

## Environment

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (public anon key only)
- `VITE_APP_URL`
- Optional `VITE_ENABLE_*_OAUTH` feature flags

Never expose a service-role key or provider secret in frontend variables.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Free deployment

Cloudflare Pages:

- Build command: `pnpm build`
- Output directory: `dist`
- Node: 20+
- Add the `VITE_*` environment variables

`public/_redirects` supplies the SPA fallback, so direct routes such as `/login` and `/u/name` work. The PWA caches the static shell only; Supabase API responses are not runtime-cached.

In Supabase Auth URL Configuration, allow:

- `http://localhost:5173/**`
- `https://YOUR-DOMAIN/**`

These cover email confirmation, password recovery and future OAuth callbacks.
