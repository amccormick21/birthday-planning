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
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo.
pause
