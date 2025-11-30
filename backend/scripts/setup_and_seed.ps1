<#
  setup_and_seed.ps1

  Purpose: Helper script for Windows developer machines to make it easy to
  ensure a local MongoDB is running and then run the Node seeder to populate
  the `tsum-shop` database with the frontend mock products and sample users.

  Usage (from backend folder):
    powershell -ExecutionPolicy Bypass -File .\scripts\setup_and_seed.ps1

  The script tries the following, in order:
  1. If a MongoDB Windows service named 'MongoDB' exists, start it (if needed).
  2. If a `mongod` executable is available on PATH, start it pointing at C:\data\db.
  3. If neither is available, prints instructions to install MongoDB and exits.

  After MongoDB is reachable on localhost:27017 the script runs the Node seeder
  `node scripts/seedFromFrontend.js` and then runs a simple check script.
#>

param()

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Success($msg) { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-ErrorMsg($msg) { Write-Host "[ERR]  $msg" -ForegroundColor Red }

Write-Info "Starting MongoDB setup + seed helper"

# 1) Try MongoDB service
$svc = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($svc) {
  Write-Info "MongoDB service found: $($svc.Name) (Status: $($svc.Status))"
  if ($svc.Status -ne 'Running') {
    try {
      Start-Service -Name MongoDB -ErrorAction Stop
      Write-Success "MongoDB service started"
    } catch {
      Write-Warn "Could not start MongoDB service: $($_.Exception.Message)"
    }
  } else {
    Write-Info "MongoDB service already running"
  }
} else {
  Write-Info "No MongoDB Windows service found"
}

# 2) If service isn't running, try to find mongod on PATH and start it
$portOpen = Test-NetConnection -ComputerName 'localhost' -Port 27017 -InformationLevel Quiet
if (-not $portOpen) {
  $mongodCmd = Get-Command mongod -ErrorAction SilentlyContinue
  if ($mongodCmd) {
    Write-Info "Found 'mongod' executable at $($mongodCmd.Path)"

    # Ensure default db path exists
    $dbPath = 'C:\data\db'
    if (-not (Test-Path $dbPath)) {
      Write-Info "Creating data directory at $dbPath"
      New-Item -ItemType Directory -Path $dbPath -Force | Out-Null
    }

    Write-Info "Starting mongod (this will run in background)."
    # Start mongod if not already running
    try {
      # Use separate argument elements to avoid complex quoting
      Start-Process -FilePath $mongodCmd.Path -ArgumentList "--dbpath", $dbPath -WindowStyle Hidden -PassThru | Out-Null
      Start-Sleep -Seconds 1
    } catch {
      Write-Warn "Failed to start mongod: $($_.Exception.Message)"
    }

    # Wait up to 20 seconds for port
    $wait = 0
    while ($wait -lt 20) {
      if (Test-NetConnection -ComputerName 'localhost' -Port 27017 -InformationLevel Quiet) { break }
      Start-Sleep -Seconds 1; $wait++
    }

    $portOpen = Test-NetConnection -ComputerName 'localhost' -Port 27017 -InformationLevel Quiet
    if ($portOpen) { Write-Success "mongod is listening on localhost:27017" }
    else { Write-Warn "mongod did not start or listen on port 27017 within timeout" }
  } else {
    Write-Warn "No 'mongod' executable found on PATH"
  }
} else {
  Write-Info "MongoDB already listening on localhost:27017"
}

if (-not (Test-NetConnection -ComputerName 'localhost' -Port 27017 -InformationLevel Quiet)) {
  Write-ErrorMsg "MongoDB is not reachable on localhost:27017."
  Write-Host "Follow these options to install MongoDB:" -ForegroundColor White
  Write-Host "  - Install MongoDB Community Server: https://www.mongodb.com/try/download/community" -ForegroundColor White
  Write-Host "  - Or install via Chocolatey (if you have it): choco install mongodb" -ForegroundColor White
  Write-Host "  - After installing, re-run this script." -ForegroundColor White
  exit 1
}

# 3) Run the Node seeder (seedFromFrontend.js) and then checkProducts.js
Write-Info "Running Node seeder: scripts/seedFromFrontend.js"
& node scripts/seedFromFrontend.js
if ($LASTEXITCODE -ne 0) {
  Write-ErrorMsg "Seeder script exited with code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Info "Running verification script: scripts/checkProducts.js"
& node scripts/checkProducts.js
if ($LASTEXITCODE -ne 0) {
  Write-ErrorMsg "Check script exited with code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Success "Database setup and seeding completed successfully"
exit 0
