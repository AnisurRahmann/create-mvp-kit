#!/bin/bash
set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║       create-mvp-kit installer        ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed.${NC}"
    echo ""
    echo "Install Node.js from: https://nodejs.org"
    echo "Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ is required. You have $(node -v)${NC}"
    echo ""
    echo "Please upgrade Node.js: https://nodejs.org"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is required but not installed.${NC}"
    exit 1
fi

echo "📦 Installing create-mvp-kit..."
echo ""

# Install globally
npm install -g @shakil_nee/create-mvp-kit

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "Usage:"
echo "  create-mvp-kit my-app           # Full setup with deployment"
echo "  create-mvp-kit my-app --skip-deploy  # Code only, no deployment"
echo ""
echo "Get started:"
echo "  create-mvp-kit my-awesome-app"
echo ""