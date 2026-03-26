# Market Pulse

Market Pulse is an AI-powered market demand scanner. It ingests social platform data, processes it via AI to determine trending topics, and provides real-time market signals for SaaS builders and researchers.

## Architecture

```ascii
                           +---------------+
                           |   Frontend    |
                           |   (Next.js)   |
                           +-------+-------+
                              |
                       [Next.js Route Handlers /api/* (Node.js)]
                              |
                            [MongoDB store]
                              |
                      +-------v-------+
                      |    Worker     |
                      |  (Scheduler)  |
                      +-------+-------+
                              |
           [Hacker News / Product Hunt / Reddit / Gemini AI]
```

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **API Layer:** Next.js Route Handlers (serverless/server runtime)
- **Worker:** Python, Google Gemini SDK
- **AI/LLM:** Google Gemini (Generative AI & Semantic Embeddings)
- **Database:** MongoDB
- **Infrastructure:** Docker, Docker Compose

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

## Future Roadmap

- [x] Integrate Hacker News and Product Hunt ingestion
- [x] Implement semantic embeddings via Google Gemini API
- [ ] Connect Reddit API with PRAW
- [ ] Add vector database (e.g. Qdrant or Pinecone) for similarity search
- [ ] Switch Worker simple scheduler to a robust queue system (Celery/RabbitMQ)
- [ ] Implement user authentication and personalized dashboards
- [ ] Add support for X (Twitter), LinkedIn, and Telegram scanning
