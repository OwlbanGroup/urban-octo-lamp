# Global AI Postal System

This project is a demonstration of a Global AI Postal System with backend API and frontend customer interface.

## Backend

The backend is built with FastAPI and uses SQLite for data storage.

### Backend Setup and Run

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:

   ```bash
   uvicorn main:app --reload
   ```

The backend API will be available at `http://localhost:8000`.

## Frontend Setup

The frontend is a React app that interacts with the backend API.

### Setup and Run

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the React development server:

   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`.

## Features

- Package tracking
- Address validation
- Delivery route optimization (placeholder AI)
- Simple customer interface

## Notes

- This is a demonstration project with simple AI placeholders.
- The backend uses SQLite for simplicity; for production, consider using a more robust database.
- The frontend communicates with the backend API at `localhost:8000`; ensure CORS settings allow this in production.

## Deployment Instructions

This project consists of a backend FastAPI service and a frontend React application.

### Backend Deployment

The backend is containerized using Docker. To build and run the backend container:

```bash
docker build -t backend-image .
docker run -p 8000:8000 --env DATABASE_URL=sqlite:///./test.db --env PROD_FRONTEND_URL=http://localhost -d backend-image
```

### Frontend Deployment

The frontend is a React app containerized using Docker. To build and run the frontend container:

```bash
cd frontend
docker build -t frontend-image .
docker run -p 3000:80 frontend-image
```

### Using Docker Compose

You can also use docker-compose to build and run both backend and frontend together:

```bash
docker-compose up --build
```

This will start the backend on port 8000 and the frontend on port 3000.

### Environment Variables

- `DATABASE_URL`: Database connection string for the backend.
- `PROD_FRONTEND_URL`: URL of the deployed frontend, used by the backend for CORS or other settings.

Make sure to update these variables as needed for your production environment.

### Production Deployment

For production deployment, use the provided `docker-compose.prod.yml` file which is configured without volume mounts and with production environment variables.

To build and run the production containers:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

This will start the backend on port 8000 and the frontend on port 3000 with production settings.

## Deployment Notes

- The backend uses Uvicorn to serve the FastAPI app.
- The frontend is served by Nginx in production.
- Adjust configurations as needed for your deployment environment.

<!-- Removed duplicate headings to fix markdown lint warnings -->
