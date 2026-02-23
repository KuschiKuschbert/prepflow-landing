#!/bin/bash

# Pre-Commit Checks (Fast Only - target <10 seconds)
# Heavy checks (Security, Health, Architecture, ADR) run in CI.
# See: .github/workflows/ci-cd.yml

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "🦁 Pre-Commit Guard (fast checks)..."

# 0. Merge Conflict Check
echo -n "   - Merge Conflicts... "
if git grep --cached -E "^<<<<<<<|^=======$|^>>>>>>>" > /dev/null 2>&1; then
    echo -e "${RED}FAIL (Merge Conflicts Detected)${NC}"
    echo "     Please resolve merge conflicts in staged files before committing."
    git grep --cached -E "^<<<<<<<|^=======$|^>>>>>>>"
    exit 1
else
    echo -e "${GREEN}Pass${NC}"
fi

# 1. Curbos Protection (block commits that modify app/curbos/)
if [ -z "$ALLOW_CURBOS_MODIFY" ]; then
    echo -n "   - Curbos Protection... "
    if git diff --cached --name-only | grep -q '^app/curbos/'; then
        echo -e "${RED}FAIL (Curbos Area Modified)${NC}"
        echo "     app/curbos/ is protected. Use ALLOW_CURBOS_MODIFY=1 for emergency bypass."
        git diff --cached --name-only | grep '^app/curbos/'
        exit 1
    else
        echo -e "${GREEN}Pass${NC}"
    fi
fi

# 2. File Size Check (Complexity)
echo -n "   - File Size... "
if npm run lint:filesize; then
    echo -e "${GREEN}Pass${NC}"
else
    echo -e "${RED}FAIL (File Size Limit Exceeded)${NC}"
    echo "     Run 'npm run lint:filesize' to see details."
    exit 1
fi

echo -e "${GREEN}✅ Pre-commit passed. (Heavy checks run in CI.)${NC}"
exit 0
