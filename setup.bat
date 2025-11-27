@echo off
title PowerNetPro - One Command Setup

echo ================================================
echo    PowerNetPro - One Command Setup ^& Run
echo ================================================
echo.

:: Check for Node.js
echo [1/5] Checking requirements...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo [OK] Node.js %NODE_VERSION% found
echo [OK] npm %NPM_VERSION% found
echo.

:: Install dependencies
echo [2/5] Installing dependencies...
echo This may take a few minutes...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully
echo.

:: Build the project
echo [3/5] Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Project built successfully
echo.

:: Start the development server
echo [4/5] Starting development server...
echo.
echo ================================================
echo    PowerNetPro is now running!
echo ================================================
echo.
echo Consumer Application:
echo    Local:   http://localhost:5173
echo.
echo Admin Panel:
echo    Local:   http://localhost:5173/admin
echo    Login:   http://localhost:5173/admin/login
echo.
echo Admin Accounts:
echo    Email: asonal379@gmail.com
echo    Email: omkarkolhe912@gmail.com
echo    Note: Admin accounts must be created in Firebase Console
echo.
echo Firebase Setup Required:
echo    1. Go to Firebase Console: https://console.firebase.google.com
echo    2. Navigate to Authentication ^> Users
echo    3. Add the admin emails above with passwords
echo    4. Open: http://localhost:5173/admin/login to grant admin privileges
echo.
echo ================================================
echo Press Ctrl+C to stop the server
echo ================================================
echo.

:: Start the dev server
call npm run dev
