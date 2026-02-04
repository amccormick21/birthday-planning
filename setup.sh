#!/bin/bash

# Development setup script for Unix/Linux/Mac

echo "========================================"
echo "Birthday Planning App - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js is installed"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    exit 1
fi

echo "[OK] npm is installed"
npm --version
echo ""

# Install dependencies
echo "Installing dependencies..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "Firebase Configuration"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "[INFO] Creating .env.local from template..."
    cp .env.example .env.local
    echo "[OK] .env.local created"
    echo ""
    echo "[ACTION REQUIRED] You need to configure Firebase:"
    echo ""
    echo "1. Get your Firebase configuration from:"
    echo "   https://console.firebase.google.com/"
    echo ""
    echo "2. Edit .env.local and replace placeholder values with your Firebase config"
    echo ""
    echo "3. Follow the complete setup guide in FIREBASE_SETUP.md"
    echo ""
    read -p "Press Enter to open .env.local in your default editor..."
    
    # Try to open in common editors
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    else
        echo "[INFO] Please manually edit .env.local with your Firebase configuration"
    fi
else
    echo "[OK] .env.local already exists"
    echo ""
    echo "If you need to update Firebase configuration, edit .env.local"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To build for production, run:"
echo "  npm run build"
echo ""
echo "For Firebase setup help, see FIREBASE_SETUP.md"
echo ""
