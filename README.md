# Market Pulse

Market Pulse is an AI-powered market demand scanner. It ingests social platform data, processes it via AI to determine trending topics, and provides real-time market signals for SaaS builders and researchers.

## Architecture

```ascii
                      +---------------+
                      |   Frontend    |
                      |  (Next.js)    |
                      +-------+-------+
                              |
                     [REST API (FastAPI)]
                              |
                      +-------v-------+
                      |    Backend    |
                      |  (FastAPI)    |
                      +-------+-------+
                              |
                       [MongoDB store]
                              |
                      +-------v-------+
                      |    Worker     |
                      |  (Scheduler)  |
                      +-------+-------+
                              |
                    [Reddit / Twitter / AI ]
```

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** FastAPI, Pydantic, Motor (MongoDB async)
- **Worker:** Python, Schedule (moving to Celery later)
- **Database:** MongoDB
- **Infrastructure:** Docker, Docker Compose

## Folder Structure

```
market-pulse/
├── frontend/                # Next.js app
├── backend/                 # FastAPI API layer
├── worker/                  # Background jobs (AI + ingestion)
├── infrastructure/          # Deployment configs
├── docker-compose.yml       # Composes all services
├── .env.example             # Shared environment vars
└── README.md                # Project documentation
```

## 💻 Setup Instructions

### Pre-requisites

- Docker & Docker Compose
- Node.js (for local frontend dev)
- Python 3.11+ (for local backend/worker dev)

### Docker Flow

1. Clone the project.
2. Copy `.env.example` to `.env` and fill the variables.
   ```bash
   cp .env.example .env
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access applications:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000/api/health`
   - Swagger Docs: `http://localhost:8000/docs`

### Development Flow (Local)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Worker:**

```bash
cd worker
pip install -r requirements.txt
python scheduler.py
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## 🔮 Future Roadmap

- [ ] Connect Reddit API with PRAW
- [ ] Implement actual vector embeddings via OpenAI API
- [ ] Add vector database (e.g. Qdrant or Pinecone) for similarity search
- [ ] Switch Worker simple scheduler to a robust queue system (Celery/RabbitMQ)
- [ ] Implement user authentication and personalized dashboards
