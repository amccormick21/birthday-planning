@echo off
REM Development setup script for Windows

echo ========================================
echo Birthday Planning App - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Firebase Configuration
echo ========================================
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo [INFO] Creating .env.local from template...
    copy .env.example .env.local >nul
    echo [OK] .env.local created
    echo.
    echo [ACTION REQUIRED] You need to configure Firebase:
    echo.
    echo 1. Get your Firebase configuration from:
    echo    https://console.firebase.google.com/
    echo.
    echo 2. Edit .env.local and replace placeholder values
    echo.
    echo 3. Follow the complete setup guide in FIREBASE_SETUP.md
    echo.
    echo Opening .env.local in your default editor...
    echo.
    
    REM Try to open in VS Code or default editor
    where code >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start code .env.local
    ) else (
        start notepad .env.local
    )
) else (
    echo [OK] .env.local already exists
    echo.
    echo If you need to update Firebase configuration, edit .env.local
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo.
echo For Firebase setup help, see FIREBASE_SETUP.md
echo.
pause
