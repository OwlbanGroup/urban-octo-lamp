#!/bin/bash

# Run backend tests
echo "Running backend tests..."
cd backend
pip install -r requirements.txt
pytest --maxfail=1 --disable-warnings -q
BACKEND_TEST_RESULT=$?

# Run frontend tests
echo "Running frontend tests..."
cd ../frontend
npm install
npm test -- --watchAll=false --verbose --runInBand
FRONTEND_TEST_RESULT=$?

if [ $BACKEND_TEST_RESULT -eq 0 ] && [ $FRONTEND_TEST_RESULT -eq 0 ]; then
  echo "All tests passed successfully."
  exit 0
else
  echo "Some tests failed."
  exit 1
fi
