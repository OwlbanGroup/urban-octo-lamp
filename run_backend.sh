#!/bin/bash
# Script to run the backend FastAPI server

cd backend
uvicorn main:app --reload
