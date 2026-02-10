# Maven Installation Script for Windows PowerShell
# This script downloads and installs Maven 3.8.8

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Maven Installation Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Maven already exists
$MavenPath = "C:\Maven\apache-maven-3.8.8"
$MavenBin = "$MavenPath\bin\mvn.cmd"

if (Test-Path $MavenBin) {
    Write-Host "✓ Maven is already installed at: $MavenPath" -ForegroundColor Green
    & $MavenBin -version
    Exit 0
}

# Step 2: Create Maven directory
Write-Host "Creating Maven directory..." -ForegroundColor Yellow
$MavenParent = "C:\Maven"
if (-not (Test-Path $MavenParent)) {
    New-Item -ItemType Directory -Path $MavenParent -Force | Out-Null
    Write-Host "✓ Created: $MavenParent" -ForegroundColor Green
}

# Step 3: Download Maven
Write-Host ""
Write-Host "Downloading Maven 3.8.8..." -ForegroundColor Yellow
$ZipUrl = "https://archive.apache.org/dist/maven/maven-3/3.8.8/apache-maven-3.8.8-bin.zip"
$ZipFile = "$env:TEMP\maven-3.8.8-bin.zip"

try {
    Write-Host "URL: $ZipUrl" -ForegroundColor Gray
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipFile -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Download complete" -ForegroundColor Green
} catch {
    Write-Host "✗ Download failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "MANUAL INSTALLATION:" -ForegroundColor Yellow
    Write-Host "1. Download Maven from: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "2. Extract to: C:\Maven\apache-maven-3.8.8" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Exit 1
}

# Step 4: Extract Maven
Write-Host ""
Write-Host "Extracting Maven..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $ZipFile -DestinationPath $MavenParent -Force -ErrorAction Stop
    Write-Host "✓ Extraction complete" -ForegroundColor Green
} catch {
    Write-Host "✗ Extraction failed: $_" -ForegroundColor Red
    Exit 1
}

# Step 5: Add to PATH
Write-Host ""
Write-Host "Setting up PATH..." -ForegroundColor Yellow
$MavenBinPath = "$MavenPath\bin"

# For current session
$env:Path += ";$MavenBinPath"
Write-Host "✓ Updated PATH for current session" -ForegroundColor Green

# For permanent PATH (requires admin)
try {
    $CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($CurrentPath -notlike "*$MavenBinPath*") {
        [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$MavenBinPath", "User")
        Write-Host "✓ Updated PATH permanently" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Could not update permanent PATH (may need admin)" -ForegroundColor Yellow
}

# Step 6: Verify installation
Write-Host ""
Write-Host "Verifying Maven installation..." -ForegroundColor Yellow
$MavenCmd = "$MavenPath\bin\mvn.cmd"

if (Test-Path $MavenCmd) {
    Write-Host "✓ Maven installed successfully!" -ForegroundColor Green
    Write-Host ""
    & $MavenCmd -version
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "  Installation Complete!" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Close this PowerShell window" -ForegroundColor White
    Write-Host "2. Open a NEW PowerShell window (to refresh PATH)" -ForegroundColor White
    Write-Host "3. Run: cd 'C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\backend'" -ForegroundColor White
    Write-Host "4. Run: mvn spring-boot:run" -ForegroundColor White
} else {
    Write-Host "✗ Maven installation failed" -ForegroundColor Red
    Exit 1
}

# Cleanup
Remove-Item $ZipFile -Force -ErrorAction SilentlyContinue
