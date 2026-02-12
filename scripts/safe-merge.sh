#!/bin/bash
set -e

# Bypass in CI environment (e.g. GitHub Actions)
if [ "$CI" = "true" ]; then
  exit 0
fi

# Setup colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛡️  Starting Safe Merge Protocol...${NC}"

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" == "main" ]; then
    echo -e "${RED}❌ Error: You are on the 'main' branch.${NC}"
    echo "Please switch to your feature branch before running this script."
    exit 1
fi

# Handle flags
FAST_MODE=false
SKIP_LINT=false
for arg in "$@"; do
    if [ "$arg" == "--fast" ]; then
        FAST_MODE=true
    fi
    if [ "$arg" == "--skip-lint" ]; then
        SKIP_LINT=true
    fi
done

echo -e "${YELLOW}📍 Merging branch: $CURRENT_BRANCH${NC}"
if [ "$FAST_MODE" == "true" ]; then
    echo -e "${YELLOW}⚡ FAST MODE enabled. Skipping full build.${NC}"
fi
if [ "$SKIP_LINT" == "true" ]; then
    echo -e "${YELLOW}⚠️  SKIP_LINT enabled. Skipping lint verification.${NC}"
fi

# 1. Verification Phase
echo -e "\n${YELLOW}🔍 Phase 1: Verification${NC}"

echo -n "Running Lint... "
if [ "$SKIP_LINT" == "true" ]; then
    echo -e "${YELLOW}Skipped (--skip-lint)${NC}"
else
    if npm run lint; then
        echo -e "${GREEN}Passed${NC}"
    else
        echo -e "${RED}Failed${NC}"
        exit 1
    fi
fi

echo -n "Running Tests... "
# Only run if 'test' script exists and isn't just "echo"
if grep -q "\"test\": \"jest\"" package.json; then
   if npm run test; then
       echo -e "${GREEN}Passed${NC}"
   else
       echo -e "${RED}Failed${NC}"
       exit 1
   fi
else
    echo -e "${YELLOW}Skipped (No strict test command found)${NC}"
fi

echo -n "Running Architecture Check... "
if npm run check:architecture; then
    echo -e "${GREEN}Passed${NC}"
else
    echo -e "${RED}Failed (Architectural Violation)${NC}"
    exit 1
fi

echo -n "Running Sentinel Health Check... "
if npm run check:health; then
    echo -e "${GREEN}Passed${NC}"
else
    echo -e "${RED}Failed (Health Violation)${NC}"
    exit 1
fi

echo -n "Running The Auditor (Security)... "
if npm run check:security; then
    echo -e "${GREEN}Passed${NC}"
else
    echo -e "${RED}Failed (Security/Performance Violation)${NC}"
    exit 1
fi

echo -n "Running Build... "
if [ "$FAST_MODE" == "true" ]; then
    echo -e "${YELLOW}Skipped (--fast)${NC}"
else
    if npm run build; then
        echo -e "${GREEN}Passed${NC}"
    else
        echo -e "${RED}Failed${NC}"
        exit 1
    fi
fi

# 2. Merge Phase
echo -e "\n${YELLOW}🔀 Phase 2: Merge${NC}"
git checkout main
git pull origin main
git merge "$CURRENT_BRANCH"

# 3. Cleanup Phase
echo -e "\n${YELLOW}🧹 Phase 3: Cleanup${NC}"
read -p "Delete branch $CURRENT_BRANCH? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git branch -d "$CURRENT_BRANCH"
    echo -e "${GREEN}Branch deleted.${NC}"
fi

echo -e "\n${GREEN}✅ Safe Merge Complete!${NC}"
