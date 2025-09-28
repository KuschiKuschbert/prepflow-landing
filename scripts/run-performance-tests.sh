#!/bin/bash

# PrepFlow Performance Testing Script
# Runs comprehensive performance tests locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PrepFlow Performance Testing Suite${NC}"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Checking dependencies...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Please create it with your environment variables.${NC}"
    echo "Copy env.example to .env.local and fill in your values:"
    echo "cp env.example .env.local"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Start the application in background
echo -e "${BLUE}🚀 Starting application...${NC}"
npm start &
APP_PID=$!

# Wait for application to start
echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
timeout 30s bash -c 'until curl -f http://localhost:3000 > /dev/null 2>&1; do sleep 1; done'

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application is running${NC}"
else
    echo -e "${RED}❌ Application failed to start${NC}"
    kill $APP_PID 2>/dev/null
    exit 1
fi

# Function to cleanup
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    kill $APP_PID 2>/dev/null
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Run Lighthouse CI tests
echo -e "${BLUE}🔍 Running Lighthouse CI tests...${NC}"
npm run lighthouse

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Lighthouse CI tests passed${NC}"
else
    echo -e "${RED}❌ Lighthouse CI tests failed${NC}"
    exit 1
fi

# Run bundle analysis
echo -e "${BLUE}📦 Running bundle analysis...${NC}"
npm run analyze

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Bundle analysis complete${NC}"
else
    echo -e "${RED}❌ Bundle analysis failed${NC}"
    exit 1
fi

# Run performance budget check
echo -e "${BLUE}📊 Running performance budget check...${NC}"
npm run perf:analyze

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Performance budget check passed${NC}"
else
    echo -e "${RED}❌ Performance budget check failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All performance tests completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Results Summary:${NC}"
echo "- Lighthouse CI results: .lighthouseci/"
echo "- Bundle analysis: bundle-analysis-report.json"
echo "- Performance budget: performance-budget-report.json"
echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo "- Review the generated reports"
echo "- Address any performance violations"
echo "- Commit changes to trigger GitHub Actions"
echo ""
echo -e "${GREEN}🚀 Performance testing complete!${NC}"