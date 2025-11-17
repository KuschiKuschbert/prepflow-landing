#!/bin/bash

# Vercel Deployment Setup Verification Script
# This script helps verify that Vercel deployment is properly configured

set -e

echo "🔍 Verifying Vercel Deployment Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git repository detected${NC}"

# Check if GitHub Actions workflow exists
if [ ! -f .github/workflows/ci-cd.yml ]; then
    echo -e "${RED}❌ GitHub Actions workflow not found${NC}"
    echo "   Expected: .github/workflows/ci-cd.yml"
    exit 1
fi

echo -e "${GREEN}✅ GitHub Actions workflow found${NC}"

# Check if workflow contains Vercel deployment step
if ! grep -q "Deploy to Vercel" .github/workflows/ci-cd.yml; then
    echo -e "${YELLOW}⚠️  Vercel deployment step not found in workflow${NC}"
else
    echo -e "${GREEN}✅ Vercel deployment step found in workflow${NC}"
fi

# Check if vercel.json exists (optional)
if [ -f vercel.json ]; then
    echo -e "${GREEN}✅ vercel.json found${NC}"
else
    echo -e "${YELLOW}ℹ️  vercel.json not found (optional, using defaults)${NC}"
fi

# Check package.json for build script
if [ -f package.json ]; then
    if grep -q '"build"' package.json; then
        echo -e "${GREEN}✅ Build script found in package.json${NC}"
    else
        echo -e "${RED}❌ Build script not found in package.json${NC}"
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

# Check Node version requirement
if grep -q '"node"' package.json; then
    NODE_VERSION=$(grep -A 1 '"engines"' package.json | grep '"node"' | sed 's/.*"node": *"\([^"]*\)".*/\1/')
    echo -e "${GREEN}✅ Node version requirement: ${NODE_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  No Node version requirement in package.json${NC}"
fi

# Check .nvmrc
if [ -f .nvmrc ]; then
    NVM_VERSION=$(cat .nvmrc)
    echo -e "${GREEN}✅ .nvmrc found: Node ${NVM_VERSION}${NC}"
else
    echo -e "${YELLOW}ℹ️  .nvmrc not found (optional)${NC}"
fi

echo ""
echo "📋 Manual Verification Checklist:"
echo ""
echo "GitHub Repository:"
echo "  [ ] Go to: https://github.com/KuschiKuschbert/prepflow-landing/settings/secrets/actions"
echo "  [ ] Verify VERCEL_TOKEN secret exists"
echo "  [ ] Verify VERCEL_ORG_ID secret exists"
echo "  [ ] Verify VERCEL_PROJECT_ID secret exists"
echo ""
echo "Vercel Dashboard:"
echo "  [ ] Go to: https://vercel.com/dashboard"
echo "  [ ] Select project: prepflow-landing"
echo "  [ ] Go to: Settings → Git"
echo "  [ ] Verify repository is connected: KuschiKuschbert/prepflow-landing"
echo "  [ ] Verify 'Auto-deploy' is enabled"
echo "  [ ] Verify production branch is set to 'main'"
echo ""
echo "GitHub Actions:"
echo "  [ ] Go to: https://github.com/KuschiKuschbert/prepflow-landing/actions"
echo "  [ ] Check if workflows run on push to main branch"
echo "  [ ] Review workflow logs for any errors"
echo ""
echo "📚 For detailed troubleshooting, see: docs/VERCEL_DEPLOYMENT_DIAGNOSTICS.md"
echo ""






