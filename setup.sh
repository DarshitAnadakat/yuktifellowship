#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   PowerNetPro - One Command Setup & Run${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
echo -e "${YELLOW}[1/5] Checking requirements...${NC}"
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"
echo -e "${GREEN}✓ npm $(npm --version) found${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}[2/5] Installing dependencies...${NC}"
echo -e "${BLUE}This may take a few minutes...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
echo ""

# Build the project
echo -e "${YELLOW}[3/5] Building the project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Project built successfully${NC}"
echo ""

# Start the development server
echo -e "${YELLOW}[4/5] Starting development server...${NC}"
echo ""

# Get available port (default 5173)
PORT=5173

echo -e "${GREEN}✓ Starting server...${NC}"
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}   🚀 PowerNetPro is now running!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${GREEN}📱 Consumer Application:${NC}"
echo -e "   ${BLUE}Local:${NC}   http://localhost:${PORT}"
echo -e "   ${BLUE}Network:${NC} http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):${PORT}"
echo ""
echo -e "${GREEN}🔐 Admin Panel:${NC}"
echo -e "   ${BLUE}Local:${NC}   http://localhost:${PORT}/admin"
echo -e "   ${BLUE}Login:${NC}   http://localhost:${PORT}/admin/login"
echo ""
echo -e "${YELLOW}📋 Admin Accounts:${NC}"
echo -e "   ${BLUE}Email:${NC} asonal379@gmail.com"
echo -e "   ${BLUE}Email:${NC} omkarkolhe912@gmail.com"
echo -e "   ${BLUE}Note:${NC} Admin accounts must be created in Firebase Console"
echo ""
echo -e "${YELLOW}🔥 Firebase Setup Required:${NC}"
echo -e "   1. Go to Firebase Console: https://console.firebase.google.com"
echo -e "   2. Navigate to Authentication > Users"
echo -e "   3. Add the admin emails above with passwords"
echo -e "   4. Open: http://localhost:${PORT}/admin/login to grant admin privileges"
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Start the dev server
npm run dev
