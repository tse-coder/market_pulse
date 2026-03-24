## Backend Service

### Overview

The backend is a FastAPI application that serves as the central API for the Market Pulse platform. It's responsible for handling requests from the frontend, interacting with the MongoDB database, and providing data to the user interface.

### Design and Architecture

The backend follows a standard layered architecture, separating concerns into different modules:

- **API Layer (`app/api`)**: Defines the API endpoints using FastAPI's `APIRouter`. It's responsible for handling incoming HTTP requests, validating data using Pydantic models, and sending responses.
- **Core Logic (`app/core`)**: Contains the core application settings and configuration. `config.py` loads environment variables and defines application-wide settings.
- **Database Layer (`app/db`)**: Manages the connection to the MongoDB database using the `motor` async driver. It provides a `db` object that other parts of the application can use to interact with the database.
- **Data Models (`app/models`)**: Defines the structure of the data stored in MongoDB using Pydantic models. These models are used for data validation and serialization.
- **Services (`app/services`)**: This directory is intended to contain business logic, though it's not heavily used in the current implementation.

### Core Components

- **`main.py`**: The entry point of the FastAPI application. It initializes the FastAPI app, includes the API routers, and sets up middleware (e.g., for CORS). It also manages the database connection lifecycle.
- **`api/routes/`**: This directory contains the different API endpoints. For example, `clusters.py` defines endpoints for retrieving cluster data and their associated signals.
- **`db/database.py`**: This file manages the connection to MongoDB. It provides `connect_to_mongo` and `close_mongo_connection` functions that are called during the application's startup and shutdown events.
- **`core/config.py`**: This file uses `pydantic-settings` to manage application configuration. It loads settings from environment variables, providing a single source of truth for configuration.

### Communication with Other Services

- **Frontend**: The backend communicates with the frontend via a RESTful API over HTTP. The frontend makes requests to the backend to fetch data (e.g., clusters, signals) and the backend responds with JSON data. The `NEXT_PUBLIC_API_URL` environment variable in the frontend's configuration points to the backend's URL.
- **MongoDB**: The backend connects to the MongoDB database to store and retrieve data. The connection URI is provided via the `MONGO_URI` environment variable.
- **Worker**: The backend does not directly communicate with the worker. The worker and the backend both interact with the same MongoDB database, which acts as a shared data store.

### Database Models

The backend primarily interacts with data through Pydantic models defined in `app/models/` and exposes them through schemas in `app/schemas/`. These models define the structure of data for API responses.

- **`SignalModel` (`app/models/signal.py`)**: Represents a single piece of information or "signal" ingested from an external source.
  - `platform`: The source of the signal (e.g., "hacker-news", "product-hunt").
  - `external_id`: The unique ID of the signal from the external platform.
  - `title`, `content`, `url`: Core content of the signal.
  - `type`: The category of the signal, either "discussion" or "startup".
  - `score`, `sentiment_score`, `total_score`: Various scores indicating the signal's importance and sentiment.
  - `embedding_vector`: A vector representation of the signal's content for semantic analysis.
  - `cluster_id`: The ID of the cluster this signal belongs to.
  - `ai_summary`, `ai_sentiment`, `ai_topics`: Fields populated by AI processing, providing summarized insights.

- **`TrendModel` (`app/models/trend.py`)**: Represents a trending topic identified from the signals.
  - `topic_name`: The name of the trending topic.
  - `volume`: The number of signals related to this topic.
  - `related_signals`: A list of signal IDs that contribute to this trend.
