param(
  [switch]$Clean,
  [switch]$Restart
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = 3000
$url = "http://localhost:$port"

function Test-LocalAppHealth {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 3
    if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 500) {
      return $false
    }

    $cssMatch = [regex]::Match($response.Content, 'href="([^"]*layout\.css[^"]*)"')
    if (-not $cssMatch.Success) {
      return $false
    }

    $cssPath = $cssMatch.Groups[1].Value.Replace("&amp;", "&")
    $cssResponse = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$port$cssPath" -TimeoutSec 3
    $contentType = [string]$cssResponse.Headers["Content-Type"]

    return $cssResponse.StatusCode -eq 200 -and $contentType.StartsWith("text/css")
  }
  catch {
    return $false
  }
}

function Stop-LocalPort {
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($processId in $processIds) {
    if ($processId -and $processId -gt 0) {
      Write-Host "Stopping process $processId on port $port"
      Stop-Process -Id $processId -Force -ErrorAction Stop
    }
  }
}

function Clear-NextDevCache {
  $cachePath = Join-Path $root ".next\cache"
  if (-not (Test-Path -LiteralPath $cachePath)) {
    return
  }

  $resolvedRoot = (Resolve-Path -LiteralPath $root).Path
  $resolvedCache = (Resolve-Path -LiteralPath $cachePath).Path

  if (-not $resolvedCache.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove cache outside project root: $resolvedCache"
  }

  Write-Host "Clearing Next development cache"
  Remove-Item -LiteralPath $resolvedCache -Recurse -Force
}

$isHealthy = Test-LocalAppHealth

if ($isHealthy -and -not $Clean -and -not $Restart) {
  Write-Host "Local app is already healthy at $url"
  exit 0
}

if (-not $isHealthy -or $Restart) {
  Stop-LocalPort
}

if ($Clean) {
  Clear-NextDevCache
}

# Node.js installato da poco potrebbe non essere ancora nel PATH di questa finestra.
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  $nodeDir = Join-Path $env:ProgramFiles "nodejs"
  if (Test-Path -LiteralPath (Join-Path $nodeDir "npm.cmd")) {
    $env:Path = "$nodeDir;$env:Path"
  }
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "Node.js non trovato: l'app non puo' partire." -ForegroundColor Red
  Write-Host "Installarlo con:  winget install OpenJS.NodeJS.LTS"
  Write-Host "oppure da https://nodejs.org (versione LTS), poi rilanciare run-local.cmd."
  exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $root "node_modules\next"))) {
  Write-Host "Dipendenze mancanti: installazione in corso (solo la prima volta)"
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Installazione delle dipendenze non riuscita." -ForegroundColor Red
    exit 1
  }
}

Write-Host "Starting local app at $url"
npm run local
