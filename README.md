# Global AI Postal System

This project is a demonstration of a Global AI Postal System with backend API and frontend customer interface.

## Backend

The backend is built with FastAPI and uses SQLite for data storage.

### Setup and Run

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependend
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:

   ```
   uvicorn main:app --reload
   ```

The backend API will be available at `http://localhost:8000`.

## Frontend

The frontend is a React app that interacts with the backend API.

### Setup and Run

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the React development server:

   ```
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
