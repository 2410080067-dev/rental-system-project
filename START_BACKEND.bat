@echo off
REM Maven Setup Script for Windows
REM This script installs Maven if not already present

echo.
echo =====================================
echo   Maven Installation for Spring Boot
echo =====================================
echo.

REM Check if maven is already installed
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Maven is already installed
    mvn -version
    goto :start_backend
)

echo [INFO] Maven not found. Setting up...
echo.

REM Set Maven version and paths
set MAVEN_VERSION=3.8.8
set MAVEN_BASE=C:\Maven
set MAVEN_HOME=%MAVEN_BASE%\apache-maven-%MAVEN_VERSION%
set MAVEN_ZIP=%TEMP%\maven.zip
set MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

REM Create Maven directory
if not exist "%MAVEN_BASE%" (
    echo [INFO] Creating Maven directory...
    mkdir "%MAVEN_BASE%"
)

REM Download Maven
echo [INFO] Downloading Maven %MAVEN_VERSION%...
echo [INFO] URL: %MAVEN_URL%
powershell -Command "try { Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%' -UseBasicParsing } catch { exit 1 }"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Download failed. Please install Maven manually:
    echo   1. Download from: https://maven.apache.org/download.cgi
    echo   2. Extract to: %MAVEN_HOME%
    echo   3. Run this script again
    pause
    exit /b 1
)

REM Extract Maven
echo [INFO] Extracting Maven...
powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_BASE%' -Force"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Extraction failed
    pause
    exit /b 1
)

REM Add Maven to PATH
echo [INFO] Adding Maven to PATH...
set PATH=%MAVEN_HOME%\bin;%PATH%

REM Set MAVEN_HOME
set MAVEN_HOME=%MAVEN_HOME%

REM Verify installation
echo.
echo [INFO] Verifying Maven installation...
call "%MAVEN_HOME%\bin\mvn.cmd" -version

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Maven installed successfully!
    echo.
    goto :start_backend
) else (
    echo [ERROR] Maven installation verification failed
    pause
    exit /b 1
)

:start_backend
echo.
echo =====================================
echo   Starting Spring Boot Backend
echo =====================================
echo.

cd /d "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\backend"

echo [INFO] Building and running Spring Boot application...
echo [INFO] Backend will start on: http://localhost:8081/api
echo [INFO] This may take a few minutes on first run...
echo.

call "%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run

pause
