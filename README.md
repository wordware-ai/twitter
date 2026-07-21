# Twitter Personality 🐦🧠

Twitter Personality is a web application that analyzes your Twitter/X handle to create a personalized personality profile using an AI agent — built by the team behind [Sauna](https://sauna.ai), your AI coworker.

The site went viral in 2024. This is the relaunched version: official X API for data, Vercel AI SDK + AI Gateway for generation (model swappable via one env var), Next.js 15, and Sauna branding. All previously generated analyses remain cached in the database and keep rendering.

## How it works

1. Enter a Twitter/X username (or two, for a compatibility check).
2. The profile and ~15 recent posts are fetched via the official **X API v2** (SocialData as fallback) and cached in Neon Postgres.
3. An LLM (default `xai/grok-4.20-non-reasoning`, via the **Vercel AI Gateway**) streams a structured analysis — roast, strengths, love life, spirit animal, pickup lines and more — straight into the page.
4. The result is cached, shareable, and rendered into dynamic OG images.

## Setting up the project 🛠️

1. **Clone the repository** and run `npm install`.
2. **Environment variables**: create `.env.local` based on `.env.example`:
   - `DATABASE_URL`: Neon Postgres connection string.
   - `AI_GATEWAY_API_KEY`: Vercel AI Gateway key (omit on Vercel — OIDC is automatic).
   - `AI_MODEL` (optional): any [Gateway model string](https://vercel.com/ai-gateway/models), e.g. `xai/grok-4.20-non-reasoning`, `zai/glm-5.2`, `openai/gpt-5.2`. Swapping models is just changing this var.
   - `X_API_BEARER_TOKEN`: official X API v2 bearer token (pay-per-use; buy credits in the [X developer console](https://developer.x.com)).
   - `SOCIALDATA_API_KEY`: fallback scraper.
   - `NEXT_PUBLIC_BASE_URL`: base URL of the deployment — share links derive from it.
   - `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`: analytics (optional).
   - `STRIPE_*`: paywall plumbing — the paywall is off by default (see `src/lib/config.tsx`).
3. **Run**: `npm run dev`.

## Architecture notes

- **Prompts** live in `src/lib/prompts.ts` (the original viral prompts, ported from Wordware). Prompts enumerate the exact output keys (structured-output mode is deliberately avoided — constrained decoding flattens the voice); `src/lib/schemas.ts` documents the shapes, which mirror the cached JSONB analyses key-for-key, so do not change keys casually.
- **Streaming contract**: `/api/analysis` and `/api/analysis/pair` stream raw JSON text; the client renders partial JSON as it arrives (`src/lib/parse-partial-json.ts`).
- **Caching/dedupe**: `users`/`pairs` rows carry status flags (`wordware*` columns — historical names kept for data compatibility) with staleness windows to dedupe concurrent generations.
- **Brand**: Sauna tokens are defined in `tailwind.config.ts` + `src/app/globals.css`; official logo SVGs in `public/brand/`.

Deployed on Vercel.
