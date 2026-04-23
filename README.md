# Market Pulse

Market Pulse is an AI-powered market intelligence platform that ingests public social signals, enriches them with AI, clusters related demand patterns, and serves ranked opportunities in a web feed.

This README is written for contributors. It explains how to run the project, how the system is structured, and how to contribute safely and consistently.

## What This Project Does

- Collects raw signals from external platforms.
- Enriches signals with AI sentiment, summary, and topics.
- Generates embeddings and clusters semantically related signals.
- Computes cluster-level opportunity metrics.
- Serves cluster and signal data via Next.js API routes.
- Renders an interactive feed UI for exploration.

## Repository Layout

```
market-pulse/
├── frontend/                 # Next.js app + API routes
├── worker/                   # Scheduled ingestion and processing pipeline
├── supabase/
│   └── schema.sql            # Postgres schema to initialize Supabase
├── docker-compose.yml        # Local multi-service runtime
├── .env.example              # Shared env template
└── README.md
```

## Architecture

### Frontend (`frontend/`)

- Framework: Next.js App Router.
- UI: React + Tailwind CSS.
- API: Route handlers under `frontend/app/api/*`.
- Data source: Supabase Postgres (server-side via `frontend/lib/server/supabase.ts`).

### Worker (`worker/`)

- Runtime: Python 3.11+.
- Scheduler: `worker/scheduler.py` runs pipeline every 10 minutes.
- Orchestration: `worker/tasks.py`.
- Ingestion: `worker/ingestion/*`.
- Processing: `worker/processing/*` (AI, embeddings, clustering, scoring).
- Persistence: Supabase client + Postgres tables.

### Database (`supabase/`)

- `supabase/schema.sql` defines the current schema.
- Core tables:
  - `signals`
  - `clusters`

## Prerequisites

- Docker + Docker Compose
- Node.js 20+
- Python 3.11+
- A Supabase project
- API credentials for data/AI providers you want to run

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Minimum required for both services:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Worker-specific values (recommended for full pipeline):

- `GOOGLE_API_KEY`
- `PH_TOKEN`
- `STACK_OVERFLOW_API_KEY`
- `REDDIT_CLIENT_ID`
- `REDDIT_SECRET`
- `REDDIT_USER_AGENT`
- `ENVIRONMENT`

Security notes:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.
- Never commit real secrets into git.

## First-Time Setup

1. Create your Supabase project.
2. Open Supabase SQL Editor.
3. Run all SQL from `supabase/schema.sql`.
4. Populate `.env` from `.env.example`.

## Run With Docker (Recommended)

```bash
docker compose up --build
```

Endpoints:

- Frontend: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`

## Run Locally Without Docker

### Worker

```bash
cd worker
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scheduler.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

If running frontend directly, ensure env vars are available in `frontend/.env.local` or your shell.

## Contributor Workflow

1. Fork/branch from `main`.
2. Keep PRs focused and small.
3. Write clear commit messages.
4. Update docs when behavior/config changes.
5. Open a PR with context, screenshots (if UI), and test notes.

Suggested branch naming:

- `feat/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`

## Coding Guidelines

### General

- Prefer simple, readable code over clever code.
- Keep functions focused and side effects explicit.
- Avoid unrelated refactors in feature/fix PRs.

### Frontend

- Keep API response shapes stable when possible.
- Use `lib/api.ts` for client-fetch patterns.
- Keep UI components in `app/feed/sections` focused/presentational.

### Worker

- Treat ingestion output as untrusted input; validate fields defensively.
- Keep pipeline steps idempotent where possible.
- Log key step boundaries and failures with useful context.

## Testing and Validation

Current repo has limited formal test automation.

Before opening a PR, run at least:

- Frontend dev build/lint flow (`npm run dev`, `npm run lint` if configured)
- Worker pipeline smoke run with representative env vars
- Manual API checks for:
  - `/api/health`
  - `/api/clusters`
  - `/api/signals`
  - `/api/clusters/:clusterId/signals`

If you add a bug fix, include reproduction and verification steps in the PR description.

## Common Pitfalls

- Using Supabase publishable key where service role key is required.
- Forgetting to run `supabase/schema.sql` before starting services.
- Introducing breaking API response changes without updating frontend consumers.
- Assuming all external API credentials are available in every environment.

## Roadmap

- [x] Hacker News and Product Hunt ingestion
- [x] AI semantic enrichment and clustering
- [ ] Reddit ingestion hardening
- [ ] Vector DB integration for high-scale similarity search
- [ ] Queue-based worker orchestration (Celery/RabbitMQ or equivalent)
- [ ] Auth and personalized dashboards
- [ ] Additional source connectors (X, LinkedIn, Telegram)

## Getting Help

If you get stuck while contributing:

- Open an issue with logs, env context (without secrets), and reproduction steps.
- Tag the affected area clearly: `frontend`, `worker`, `database`, or `infra`.
