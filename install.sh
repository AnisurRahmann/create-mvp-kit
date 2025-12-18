#!/bin/bash
set -e

echo "🚀 Installing create-mvp-kit..."

# Check node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Install from https://nodejs.org"
    exit 1
fi

# Check npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required. Install Node.js from https://nodejs.org"
    exit 1
fi

# Install from npm
npm install -g create-mvp-kit

echo ""
echo "✅ Installed successfully!"
echo ""
echo "Usage:"
echo "  create-mvp-kit my-app"
echo ""