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
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To build for production, run:"
echo "  npm run build"
echo ""
