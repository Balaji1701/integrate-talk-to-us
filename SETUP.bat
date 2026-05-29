@echo off
REM Quick setup guide for NeemLogic Contact Form

echo.
echo =========================================
echo NeemLogic Contact Form - Quick Setup
echo =========================================
echo.

echo Step 1: Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

echo.
echo Step 2: Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
) else (
    echo [OK] Dependencies installed
)

echo.
echo Step 3: Checking PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] PostgreSQL doesn't appear to be in PATH
    echo Please make sure PostgreSQL is installed and running
    echo You may need to add PostgreSQL bin directory to your PATH
) else (
    echo [OK] PostgreSQL is installed
)

echo.
echo =========================================
echo Setup Instructions:
echo =========================================
echo.
echo 1. Make sure PostgreSQL is running:
echo    - Open Services.msc and start PostgreSQL service, OR
echo    - Run PostgreSQL from system tray
echo.
echo 2. Update .env file with your PostgreSQL password:
echo    - Edit .env and change DB_PASSWORD to your postgres password
echo.
echo 3. Initialize the database:
echo    node init-db.js
echo.
echo 4. Start the server:
echo    npm start
echo.
echo 5. Open browser to:
echo    http://localhost:3000
echo.
echo =========================================
echo.
pause
