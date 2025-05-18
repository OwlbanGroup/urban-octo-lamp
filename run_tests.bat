@echo off
REM Run backend tests
echo Running backend tests...
cd backend
pip install -r requirements.txt
pytest --maxfail=1 --disable-warnings -q
if errorlevel 1 (
    echo Backend tests failed.
    exit /b 1
)
cd ..

REM Run frontend tests
echo Running frontend tests...
cd frontend
npm install
npm test -- --watchAll=false --verbose --runInBand
if errorlevel 1 (
    echo Frontend tests failed.
    exit /b 1
)
cd ..

echo All tests passed successfully.
exit /b 0
