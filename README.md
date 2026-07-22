# Founder Dashboard

A calm daily briefing for founders: overnight revenue, urgent customer issues, threads waiting on you, and one recommended next action — synced from Gmail every 15 minutes.

## Quick start (local)

### 1. Install and configure

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` (see [Environment variables](#environment-variables) below).

Generate an encryption key:

```bash
openssl rand -base64 32
```

### 2. Apply database migration

In Supabase SQL editor, run:

[`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

### 3. Configure Google OAuth

**Google Cloud Console**

- Enable Gmail API
- OAuth consent screen configured
- Authorized redirect URIs:
  - `https://<project-ref>.supabase.co/auth/v1/callback`
  - `http://localhost:3000/auth/callback`

**Supabase → Auth → Google provider**

- Client ID + secret
- Additional scope: `https://www.googleapis.com/auth/gmail.readonly`

**Supabase → Auth → URL Configuration**

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Run the app

Terminal 1 — Next.js:

```bash
npm run dev
```

Terminal 2 — Inngest (background sync):

```bash
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role (server-side only) |
| `TOKEN_ENCRYPTION_KEY` | Yes | 32-byte base64 key for Gmail refresh tokens |
| `GOOGLE_CLIENT_ID` | Yes | For Gmail token refresh |
| `GOOGLE_CLIENT_SECRET` | Yes | For Gmail token refresh |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key for classification + draft replies |
| `OPENROUTER_CLASSIFY_MODEL` | No | Model for urgent classification (default: `anthropic/claude-3.5-haiku`) |
| `OPENROUTER_DRAFT_MODEL` | No | Model for draft replies (default: `anthropic/claude-3.5-sonnet`) |
| `INNGEST_EVENT_KEY` | Prod | Inngest event key |
| `INNGEST_SIGNING_KEY` | Prod | Inngest signing key |
| `DODO_PAYMENTS_API_KEY` | Billing | Dodo Payments API key |
| `DODO_PAYMENTS_ENVIRONMENT` | Billing | `test_mode` or `live_mode` |
| `DODO_PRODUCT_ID` | Billing | Subscription product ID from Dodo dashboard |
| `DODO_WEBHOOK_SECRET` | Billing | Webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` locally; your Vercel URL in prod |

---

## What you need to set up (your side)

### Supabase
1. Create project
2. Run migration SQL
3. Enable Google auth provider with Gmail readonly scope
4. Copy URL, anon key, service role key into `.env.local`

### Google Cloud
1. Create OAuth 2.0 credentials (Web application)
2. Enable Gmail API
3. Add Supabase callback URL as authorized redirect
4. Copy client ID/secret to Supabase Google provider **and** `.env.local`

### OpenRouter (AI)
1. Create API key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Add `OPENROUTER_API_KEY` to `.env.local`
3. Optional: set `OPENROUTER_CLASSIFY_MODEL` and `OPENROUTER_DRAFT_MODEL` (see [openrouter.ai/models](https://openrouter.ai/models))

### Dodo Payments (billing)
1. Create account at [dodopayments.com](https://dodopayments.com)
2. Create a **subscription product** (~$17/month) with 14-day trial enabled
3. Copy product ID → `DODO_PRODUCT_ID`
4. Copy API key → `DODO_PAYMENTS_API_KEY`
5. Create webhook endpoint: `https://your-domain.com/api/webhooks/dodo`
6. Subscribe to: `subscription.active`, `subscription.renewed`, `subscription.cancelled`, `subscription.on_hold`, `payment.failed`
7. Copy webhook secret → `DODO_WEBHOOK_SECRET`

### Inngest (background jobs)
1. Create account at [inngest.com](https://www.inngest.com)
2. Add Inngest integration on Vercel (or set keys manually)
3. Locally: `npx inngest-cli@latest dev` syncs functions from `/api/inngest`

### Vercel (production deploy)
1. Push repo to GitHub
2. Import project in Vercel
3. Add all env vars from `.env.local.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy — Inngest cron runs every 15 minutes automatically

---

## End-to-end test checklist

### Auth & Gmail
1. Visit `/` → landing page loads
2. Click **Get started** → `/login`
3. Google consent shows **Gmail read-only** scope
4. After consent → `/dashboard` with greeting
5. Supabase `users` row has encrypted `google_refresh_token`
6. Supabase `sync_state` row exists

### Sync & dashboard
7. Click **Sync now** on dashboard
8. Wait for sync to complete (check terminal for errors)
9. Verify Supabase tables:
   - `revenue_events` — Stripe/Paddle payment emails
   - `waiting_threads` — threads where you replied 24h+ ago
   - `emails` — urgent issues (`category = urgent`)
10. Dashboard cards populate from DB (instant reload, no Gmail API call)
11. Click **Sync now** again within 30s → rate limited (`429`)

### AI drafts
12. **Do this first** card shows oldest urgent issue or waiting thread
13. Click **Draft reply** → modal with editable AI draft
14. **Copy** and **Open in Gmail** work

### Billing
15. Visit `/settings` → plan status, Gmail connection, billing link
16. Visit `/billing` → start checkout (Dodo test mode)
17. Complete test payment → webhook updates `users.plan_status` to `active`

### Background jobs
18. Inngest dev UI shows `sync-all-users-cron` and `sync-user` functions
19. Cron triggers every 15 minutes (or invoke manually from Inngest UI)

---

## Architecture

```
Landing (/) → Login → OAuth callback → Dashboard
                                         ↓
                              Reads from Supabase (instant)
                                         ↑
Inngest cron (15m) → syncGmailForUser → Gmail history.list
                              ↓
                    Revenue regex → Waiting metadata → Claude urgent classify
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Google OAuth sign-in |
| `/dashboard` | Main 4-card dashboard |
| `/settings` | Gmail disconnect, plan, billing |
| `/billing` | Upgrade / subscription checkout |
| `/api/sync` | Manual sync (POST) / status (GET) |
| `/api/draft` | Generate AI reply draft |
| `/api/inngest` | Inngest function handler |
| `/api/webhooks/dodo` | Dodo Payments webhooks |

## Tech stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL + Auth)
- Gmail API (read-only)
- Inngest (15-minute background sync)
- OpenRouter (Claude and other models for urgent classification + draft replies)
- Dodo Payments (subscription billing)
- Vercel (hosting)
