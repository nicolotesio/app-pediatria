$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = 3000
$url = "http://localhost:$port"

$isRunning = $false

try {
  $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2
  $isRunning = $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
}
catch {
  $isRunning = $false
}

if ($isRunning) {
  Write-Host "Local app is already running at $url"
  exit 0
}

Write-Host "Starting local app at $url"
npm run local
