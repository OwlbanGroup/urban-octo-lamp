#!/bin/bash
# Script to install dependencies and run all frontend tests with coverage and watchAll flag

echo "Navigating to frontend directory..."
cd frontend

echo "Installing dependencies..."
npm install

echo "Running all tests with coverage and watchAll flag..."
npm test -- --runInBand --coverage --watchAll
