Param(
  [string]$Phase1Dir = "../Export Phase 1 Pictures",
  [string]$Phase2Dir = "../Export Phase 2 Pictures",
  [string]$OutDir = "../public"
)

function Ensure-Dir($p) { if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null } }

if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
  Write-Error "ImageMagick 'magick' command not found. Install from https://imagemagick.org first."; exit 1
}

$phase1Out = Join-Path $OutDir 'phase1'
$phase2Out = Join-Path $OutDir 'phase2'
Ensure-Dir $phase1Out
Ensure-Dir $phase2Out

Write-Host "Converting Phase 1 images..."
Get-ChildItem $Phase1Dir -Filter *.tif | ForEach-Object {
  $base = [IO.Path]::GetFileNameWithoutExtension($_.Name) -replace '[^A-Za-z0-9_.-]','-'
  $webp = Join-Path $phase1Out ($base + '.webp')
  $jpg  = Join-Path $phase1Out ($base + '.jpg')
  if (-not (Test-Path $webp)) { magick $_.FullName -auto-orient -strip -quality 82 -resize 1600x1600> $webp }
  if (-not (Test-Path $jpg))  { magick $_.FullName -auto-orient -strip -quality 88 -resize 1600x1600> $jpg }
}

Write-Host "Converting Phase 2 images..."
Get-ChildItem $Phase2Dir -Filter *.tif | ForEach-Object {
  $base = [IO.Path]::GetFileNameWithoutExtension($_.Name) -replace '[^A-Za-z0-9_.-]','-'
  $webp = Join-Path $phase2Out ($base + '.webp')
  $jpg  = Join-Path $phase2Out ($base + '.jpg')
  if (-not (Test-Path $webp)) { magick $_.FullName -auto-orient -strip -quality 82 -resize 1600x1600> $webp }
  if (-not (Test-Path $jpg))  { magick $_.FullName -auto-orient -strip -quality 88 -resize 1600x1600> $jpg }
}

Write-Host "Done. Update your product image paths to /phase1/<name>.webp or /phase2/<name>.webp" -ForegroundColor Green