# PowerShell script to run backend and frontend tests with environment activation

Write-Host "Running backend tests..."

# Change to backend directory
Set-Location -Path ".\backend"

# Check if virtual environment folder exists (e.g., venv)
if (Test-Path ".\venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..."
    . .\venv\Scripts\Activate.ps1
} else {
    Write-Host "No virtual environment found, using system Python."
}

# Install requirements
Write-Host "Installing backend requirements..."
python -m pip install --upgrade pip
pip install -r requirements.txt

# Run backend tests
Write-Host "Running pytest..."
pytest --maxfail=1 --disable-warnings -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend tests failed."
    exit $LASTEXITCODE
}

# Return to root directory
Set-Location -Path ".."

Write-Host "Running frontend tests..."

# Change to frontend directory
Set-Location -Path ".\frontend"

# Install frontend dependencies
Write-Host "Installing frontend dependencies..."
npm install

# Run frontend tests
Write-Host "Running npm test..."
npm test -- --watchAll=false --verbose --runInBand
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend tests failed."
    exit $LASTEXITCODE
}

Write-Host "All tests passed successfully."
exit 0
