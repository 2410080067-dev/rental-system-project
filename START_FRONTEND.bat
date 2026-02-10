@echo off
REM Frontend Start Script for React App

echo.
echo =====================================
echo   Starting React Frontend
echo =====================================
echo.

cd /d "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\frontend\rental-frontend"

if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
)

echo [INFO] Starting React development server...
echo [INFO] Frontend will open at: http://localhost:3000
echo.

call npm start

pause
