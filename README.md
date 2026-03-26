# Market Pulse

Market Pulse is an AI-powered market demand scanner. It ingests social platform data, processes it via AI to determine trending topics, and provides real-time market signals for SaaS builders and researchers.

## Folder Structure

```
market-pulse/
├── frontend/                # Next.js app
├── backend/                 # legacy FastAPI API layer (optional, no longer required)
├── worker/                  # Background jobs (Gemini API + ingestion)
├── infrastructure/          # Deployment configs
├── docker-compose.yml       # Composes all services
├── .env.example             # Shared environment vars
└── README.md                # Project documentation
```

## Setup Instructions

### Pre-requisites

- Docker & Docker Compose
- Node.js (for local frontend dev)
- Python 3.11+ (for local worker dev)

### Docker Flow

1. Clone the project.
2. Copy `.env.example` to `.env` and fill the variables (especially `GOOGLE_API_KEY` and `PH_TOKEN`).
   ```bash
   cp .env.example .env
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access applications:
   - Frontend: `http://localhost:3000`
   - API Health: `http://localhost:3000/api/health`

### Development Flow (Local)

**Worker:**

```bash
cd worker
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scheduler.py
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Core Software Functionality

Market Pulse is built around a recurring data pipeline that turns raw social signals into structured market intelligence.

### 1) Data Ingestion (Scraping / Collection)

- Periodically collects public signals from external platforms.
- Current active ingestion includes Hacker News and Product Hunt.
- Reddit ingestion support exists in the worker codebase and can be enabled as part of roadmap progression.
- Each ingested item is normalized into a common signal format (source, title/content, URL, timestamp, engagement metadata).

### 2) AI Enrichment

- Generates AI summaries for each signal.
- Assigns AI sentiment and topical tags.
- Produces embedding vectors for semantic similarity analysis.
- Enriched fields are stored with the original signal for downstream clustering and ranking.

### 3) Semantic Clustering

- Groups related signals into market clusters using embedding similarity.
- Maintains a centroid per cluster and assigns new signals to the best-fitting cluster.
- Supports creating new clusters when no existing centroid is close enough.
- Maintains cluster snapshots over time for historical trend analysis.

### 4) Opportunity Scoring

- Computes cluster-level metrics such as:
   - total signal volume
   - startup vs discussion distribution
   - average sentiment
   - momentum score
   - pain score
   - opportunity score
- These scores are used to rank and surface high-potential market opportunities.

### 5) Feed and API Functionality

- Exposes cluster and signal data through API endpoints.
- Supports paginated/infinite feed loading.
- Provides per-cluster detail views with signal-level AI metadata.
- Uses MongoDB as the shared store between worker processing and API reads.

### 6) Scheduling and Runtime

- Worker runs as a scheduled background process (default interval: every 10 minutes).
- The pipeline is designed to continuously refresh intelligence as new external signals arrive.
- Can run locally or through Docker Compose as part of the full stack.

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **API Layer:** Next.js Route Handlers (serverless/server runtime)
- **Worker:** Python, Google Gemini SDK
- **AI/LLM:** Google Gemini (Generative AI & Semantic Embeddings)
- **Database:** MongoDB
- **Infrastructure:** Docker, Docker Compose

## Future Roadmap

- [x] Integrate Hacker News and Product Hunt ingestion
- [x] Implement semantic embeddings via Google Gemini API
- [ ] Connect Reddit API with PRAW
- [ ] Add vector database (e.g. Qdrant or Pinecone) for similarity search
- [ ] Switch Worker simple scheduler to a robust queue system (Celery/RabbitMQ)
- [ ] Implement user authentication and personalized dashboards
- [ ] Add support for X (Twitter), LinkedIn, and Telegram scanning
