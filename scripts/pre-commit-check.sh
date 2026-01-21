#!/bin/bash

# Pre-Commit Checks (Fast)
# - Security (Auditor)
# - Health (Sentinel)
# - Architecture (Architect)

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "🦁 The Brain (Pre-Commit Guard)..."

# 0. Merge Conflict Check
echo -n "   - Merge Conflicts... "
if grep -rE "^<<<<<<<|^=======$|^>>>>>>>" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next . > /dev/null; then
    echo -e "${RED}FAIL (Merge Conflicts Detected)${NC}"
    echo "     Please resolve merge conflicts before committing."
    grep -rE "^<<<<<<<|^=======$|^>>>>>>>" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next .
    exit 1
else
    echo -e "${GREEN}Pass${NC}"
fi

# 1. Security Check (Auditor)
echo -n "   - Security (Auditor)... "
if npm run check:security; then
    echo -e "${GREEN}Pass${NC}"
else
    echo -e "${RED}FAIL (Secrets or Assets Detected)${NC}"
    echo "     Run 'npm run check:security' to see details."
    exit 1
fi

# 2. Health Check (Sentinel)
echo -n "   - Health (Sentinel)... "
if npm run check:health; then
    echo -e "${GREEN}Pass${NC}"
else
    echo -e "${RED}FAIL (Code Debt Ceiling Breached)${NC}"
    echo "     Run 'npm run check:health' to see details."
    exit 1
fi


# 3. Architecture Check (Architect)
echo -n "   - Architecture (Architect)... "
if npm run check:architecture; then
    echo -e "${GREEN}Pass${NC}"
else
    echo -e "${RED}FAIL (Architectural Violation)${NC}"
    echo "     Run 'npm run check:architecture' to see details."
    exit 1
fi

# 4. File Size Check (Complexity)
echo -n "   - File Size (Complexity)... "
if npm run lint:filesize; then
    echo -e "${GREEN}Pass${NC}"
else
    echo -e "${RED}FAIL (File Size Limit Exceeded)${NC}"
    echo "     Run 'npm run lint:filesize' to see details."
    exit 1
fi

echo -e "${GREEN}✅ All Guards Passed. Commit Approved.${NC}"
exit 0
