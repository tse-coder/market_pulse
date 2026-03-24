## Frontend Service

### Overview

The frontend is a Next.js application that provides the user interface for Market Pulse. It allows users to view market trends, clusters of related signals, and detailed information about each signal.

### Design and Architecture

The frontend is built using Next.js with the App Router, which allows for a modern, component-based architecture.

- **`app/`**: This directory contains the main application structure, including pages, layouts, and components.
- **`app/page.tsx`**: The main landing page of the application.
- **`app/feed/page.tsx`**: The main feed page where users can see the clusters of signals.
- **`components/`**: Contains reusable React components used throughout the application (e.g., `BrandAlignmentBar.tsx`).
- **`lib/`**: Contains utility functions and API communication logic. `api.ts` is responsible for making requests to the backend API.
- **`public/`**: Contains static assets like images and icons.

### Core Components

- **`app/feed/page.tsx`**: This is the core of the user-facing application. It fetches and displays the clusters of signals, manages state for the selected cluster, and handles infinite scrolling.
- **`lib/api.ts`**: This file abstracts away the details of making API calls to the backend. It provides functions like `fetchClusters` and `fetchClusterSignals` that can be used in the components to fetch data.
- **`app/feed/sections/feedCard.tsx` and `app/feed/sections/detail.tsx`**: These components are responsible for rendering individual clusters in the feed and the detailed view of a selected cluster, respectively.

### Communication with Other Services

- **Backend**: The frontend communicates with the backend exclusively through the REST API. It uses the `fetch` API to make GET requests to the backend endpoints defined in `lib/api.ts`. The backend's URL is configured via the `NEXT_PUBLIC_API_URL` environment variable.
