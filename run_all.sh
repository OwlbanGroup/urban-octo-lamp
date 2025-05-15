#!/bin/bash

# Run backend server
echo "Starting backend server..."
cd backend
pip install -r requirements.txt
uvicorn main:app --reload &

BACKEND_PID=$!

# Run frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm start &

FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo "Servers are running. Press Ctrl+C to stop."

# Wait for user to terminate
wait $BACKEND_PID
wait $FRONTEND_PID
