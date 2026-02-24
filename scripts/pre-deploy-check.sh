#!/bin/bash

# Pre-Deployment Check Script
# Runs all checks that Vercel/CI would run before deployment
# Usage: bash scripts/pre-deploy-check.sh
#
# This script verifies that your code will deploy successfully on Vercel
# by running the same checks that Vercel and CI run during deployment.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track if any checks fail
FAILED=0

echo ""
echo -e "${BLUE}🚀 Pre-Deployment Check${NC}"
echo -e "${BLUE}========================${NC}"
echo ""

# Function to run a check
run_check() {
    local name=$1
    local command=$2

    echo -e "${BLUE}▶ ${name}...${NC}"
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${name} passed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${name} failed${NC}"
        echo -e "${YELLOW}   Run manually: ${command}${NC}"
        FAILED=1
        return 1
    fi
}

# Function to run a check with output
run_check_verbose() {
    local name=$1
    local command=$2

    echo -e "${BLUE}▶ ${name}...${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✅ ${name} passed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${name} failed${NC}"
        FAILED=1
        return 1
    fi
}

# 1. Check Node version
echo -e "${BLUE}📦 Checking Node version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="22.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    echo -e "${GREEN}✅ Node version ${NODE_VERSION} meets requirement (>= ${REQUIRED_VERSION})${NC}"
else
    echo -e "${RED}❌ Node version ${NODE_VERSION} does not meet requirement (>= ${REQUIRED_VERSION})${NC}"
    FAILED=1
fi
echo ""

# 2. Install dependencies (clean install like CI)
echo -e "${BLUE}📦 Installing dependencies (npm ci)...${NC}"
if npm ci > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    echo -e "${YELLOW}   Run manually: npm ci${NC}"
    FAILED=1
fi
echo ""

# 3. Security audit (critical only - dev deps have high vulns requiring breaking changes)
echo -e "${BLUE}🔒 Security audit (npm audit)...${NC}"
AUDIT_OUTPUT=$(npm audit --audit-level=critical 2>&1)
AUDIT_EXIT_CODE=$?
if [ $AUDIT_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Security audit passed (no critical vulnerabilities)${NC}"
else
    echo -e "${RED}❌ Security audit failed (critical vulnerabilities found)${NC}"
    echo -e "${YELLOW}   Review vulnerabilities: npm audit${NC}"
    echo -e "${YELLOW}   Fix automatically: npm audit fix${NC}"
    echo -e "${YELLOW}   Fix with breaking changes: npm audit fix --force${NC}"
    FAILED=1
fi
echo ""

# 4. Lint check
run_check "Lint check" "npx eslint ."
echo ""

# 5. Type check
run_check "Type check" "npm run type-check"
echo ""

# 6. Format check
run_check "Format check" "npm run format:check"
echo ""

# 7. Script audit (hygiene)
run_check "Script audit" "npm run audit:scripts"
echo ""

# 8. Test (blocking - CI-equivalent)
run_check "Test" "npm run test"
echo ""

# 9. File size check (blocking)
run_check "File size check" "npm run lint:filesize"
echo ""

# 10. Cleanup check (blocking on critical violations only)
# Advisory mode: api-patterns, database-patterns, error-handling don't block deploy
echo -e "${BLUE}▶ Cleanup check...${NC}"
set +e
CLEANUP_PRE_DEPLOY_ADVISORY=1 npm run cleanup:check
CLEANUP_EXIT=$?
set -e
if [ $CLEANUP_EXIT -eq 1 ]; then
    echo -e "${RED}❌ Cleanup check failed (critical violations)${NC}"
    echo -e "${YELLOW}   Run: npm run cleanup:check${NC}"
    FAILED=1
elif [ $CLEANUP_EXIT -eq 2 ]; then
    echo -e "${YELLOW}⚠️  Cleanup found warnings (non-blocking)${NC}"
else
    echo -e "${GREEN}✅ Cleanup check passed${NC}"
fi
echo ""

# 11. Build check (most important - this is what Vercel runs)
echo -e "${BLUE}▶ Build check (this is what Vercel runs)...${NC}"
if npm run build >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Build check passed${NC}"

    # 12. Bundle budget check (Phase 5: The Auditor)
    echo -e "${BLUE}▶ Bundle budget check...${NC}"
    if npm run check:bundle; then
        echo -e "${GREEN}✅ Bundle budget passed${NC}"
    else
        echo -e "${RED}❌ Bundle budget exceeded${NC}"
        FAILED=1
    fi
else
    echo -e "${RED}❌ Build check failed${NC}"
    echo -e "${YELLOW}   Run manually: npm run build${NC}"
    echo -e "${YELLOW}   This will likely fail on Vercel too!${NC}"
    FAILED=1
fi
echo ""

# Summary
echo -e "${BLUE}========================${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Safe to deploy.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Fix issues before deploying.${NC}"
    echo ""
    echo -e "${YELLOW}💡 Quick fix commands:${NC}"
    echo -e "   npm audit              # Review vulnerabilities"
    echo -e "   npm audit fix          # Fix vulnerabilities automatically"
    echo -e "   npm run test          # Fix test failures"
    echo -e "   npm run lint          # Fix linting issues"
    echo -e "   npm run type-check    # Fix TypeScript errors"
    echo -e "   npm run format        # Fix formatting issues"
    echo -e "   npm run lint:filesize # See file size violations"
    echo -e "   npm run cleanup:check # See cleanup violations"
    echo -e "   npm run build         # See build errors"
    echo ""
    exit 1
fi
