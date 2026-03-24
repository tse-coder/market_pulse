## Worker Service

### Overview

The worker is a background service responsible for ingesting data from various sources, processing it, and storing it in the MongoDB database. It's the engine that powers the Market Pulse platform.

### Design and Architecture

The worker is a Python application that uses a scheduler to run a pipeline of tasks at regular intervals.

- **`scheduler.py`**: The entry point of the worker. It uses the `schedule` library to run the main processing pipeline every 10 minutes.
- **`tasks.py`**: Defines the main `run_pipeline` function, which orchestrates the ingestion and processing of data.
- **`ingestion/`**: Contains modules for fetching data from different sources (e.g., `hacker_news.py`, `product_hunt.py`).
- **`processing/`**: Contains modules for processing the ingested data. This includes tasks like generating AI-powered intelligence (`intelligence.py`), performing semantic clustering (`clustering.py`), and calculating trend scores.
- **`database/`**: Manages the connection to the database and provides functions for saving the processed data.

### Core Components

- **`scheduler.py`**: This script runs an infinite loop that checks for scheduled jobs and runs them. It's configured to run the `run_pipeline` job every 10 minutes.
- **`tasks.py`**: The `run_pipeline` function in this file is the heart of the worker. It calls functions to ingest data from various sources, process it using AI, perform clustering, and refresh scores.
- **`ingestion/` modules**: Each module in this directory is responsible for fetching data from a specific platform (e.g., Hacker News).
- **`processing/clustering.py`**: This module is a key part of the processing pipeline. It uses cosine similarity to find the best cluster for a given signal and updates the cluster's centroid.

### Communication with Other Services

- **MongoDB**: The worker communicates with the MongoDB database to store the data it ingests and processes. It uses the same database as the backend, allowing the backend to serve the data that the worker produces.
- **External APIs**: The worker communicates with external APIs to ingest data. This includes the Hacker News API, the Product Hunt API, and the Google Gemini API for AI processing. API keys and other necessary credentials for these services are managed through environment variables.
- **Backend/Frontend**: The worker does not communicate directly with the backend or frontend. The data flow is unidirectional: the worker puts data into the database, and the backend reads it from there to serve it to the frontend.

### Database Models

The worker uses `mongoengine` to define and interact with the database models. These models are located in `worker/database/models/`.

- **`Signal` (`worker/database/models/signal.py`)**: This is the primary model for storing ingested data. It is very similar to the `SignalModel` in the backend.
  - `platform`, `external_id`, `title`, `content`, `url`, `score`, `time`: Basic information about the signal.
  - `type`: "startup" or "discussion".
  - `sentiment_score`, `ai_summary`, `ai_sentiment`, `ai_topics`: Fields populated by the AI processing steps.
  - `embedding_vector`: The semantic vector representation of the signal's content.
  - `cluster_id`: A reference to the `Cluster` this signal is associated with.

- **`Cluster` (`worker/database/models/cluster.py`)**: Represents a group of semantically similar signals.
  - `name`, `description`: An AI-generated title and summary for the cluster.
  - `embedding_centroid`: The central vector of the cluster, used to determine if new signals belong to it.
  - `total_signals`, `total_startups`, `total_discussions`: Counters for the different types of signals in the cluster.
  - `avg_sentiment`, `momentum_score`, `pain_score`, `opportunity_score`: Key metrics calculated for the cluster to gauge its market potential.
  - `primary_tags`: AI-generated tags that describe the cluster.

- **`ClusterSnapshot` (`worker/database/models/cluster.py`)**: Stores a historical snapshot of a cluster's metrics at a given point in time. This can be used to track the evolution of a cluster's performance.
  - `cluster_id`: A reference to the cluster.
  - `date`: The timestamp of the snapshot.
  - `signal_count`, `startup_count`, `discussion_count`, `avg_sentiment`, `momentum_score`, etc.: The metrics of the cluster at the time of the snapshot.
