# Use official Python image as base
FROM python:3.11.4-slim-bullseye

# Set working directory
WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend ./backend

# Expose port for FastAPI
EXPOSE 8000

# Set environment variables with defaults, can be overridden at runtime
ARG DATABASE_URL=sqlite:///./test.db
ARG PROD_FRONTEND_URL=http://localhost:3000

ENV DATABASE_URL=$DATABASE_URL
ENV PROD_FRONTEND_URL=$PROD_FRONTEND_URL

# Start the FastAPI server with uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
