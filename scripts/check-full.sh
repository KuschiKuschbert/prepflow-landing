#!/bin/bash

# Full Check Script - Periodic health check for checks not run on every PR
# Combines cleanup, design audits, test coverage, and dependency audits
# Usage: bash scripts/check-full.sh
# Or: npm run check:full
#
# Options:
#   --verbose, -v     Show full output from each check (for debugging)
#   --log             Create logs/check-full-TIMESTAMP.log
#
# Env: CHECK_FULL_VERBOSE=1  Same as --verbose
#      CHECK_FULL_LOG=1     Same as --log
#
# To capture output to a file: npm run check:full 2>&1 | tee logs/check-full.log
#
# Run periodically (e.g. before release, quarterly) to catch issues
# that CI and pre-deploy do not cover.
# Runs all checks (does not exit on first failure) and reports at end.

# Parse args
VERBOSE=${CHECK_FULL_VERBOSE:-0}
AUTO_LOG=${CHECK_FULL_LOG:-0}
for arg in "$@"; do
  case "$arg" in
    --verbose|-v) VERBOSE=1 ;;
    --log) AUTO_LOG=1 ;;
  esac
done

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FAILED=0
ADVISORY_FAILED=0

# Auto-log: redirect stdout/stderr to tee
if [ "$AUTO_LOG" = "1" ]; then
  mkdir -p logs
  LOGFILE="logs/check-full-$(date +%Y%m%d-%H%M%S).log"
  exec > >(tee "$LOGFILE") 2>&1
  echo "Logging to $LOGFILE"
  echo ""
fi

run_check() {
  local name=$1
  local command=$2
  local advisory=${3:-false}

  echo -e "${BLUE}▶ ${name}...${NC}"
  if [ "$VERBOSE" = "1" ]; then
    if eval "$command"; then
      echo -e "${GREEN}✅ ${name} passed${NC}"
      return 0
    else
      if [ "$advisory" = "true" ]; then
        echo -e "${YELLOW}⚠️  ${name} found issues (advisory)${NC}"
        ADVISORY_FAILED=1
      else
        echo -e "${RED}❌ ${name} failed${NC}"
        FAILED=1
      fi
      return 1
    fi
  fi
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ${name} passed${NC}"
    return 0
  else
    if [ "$advisory" = "true" ]; then
      echo -e "${YELLOW}⚠️  ${name} found issues (advisory)${NC}"
      echo -e "${YELLOW}   Run manually: ${command}${NC}"
      ADVISORY_FAILED=1
    else
      echo -e "${RED}❌ ${name} failed${NC}"
      echo -e "${YELLOW}   Run manually: ${command}${NC}"
      FAILED=1
    fi
    return 1
  fi
}

echo ""
echo -e "${BLUE}🔍 Full Check (periodic health)${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# --- Phase 1: Cleanup (blocking) ---
echo -e "${BLUE}📋 Phase 1: Cleanup Standards${NC}"
run_check "Cleanup check" "npm run cleanup:check"
echo ""

# --- Phase 2: Design & Consistency Audits (advisory) ---
echo -e "${BLUE}🎨 Phase 2: Design & Consistency${NC}"
run_check "Breakpoint detection" "npm run detect-breakpoints" "true"
run_check "Voice consistency" "npm run check:voice" "true"
run_check "Visual hierarchy" "npm run audit:hierarchy" "true"
run_check "Icon audit" "npm run audit:icons" "true"
echo ""

# --- Phase 3: Test Coverage (blocking) ---
echo -e "${BLUE}🧪 Phase 3: Tests${NC}"
run_check "Unit test coverage" "npm run test:coverage"
echo ""

# --- Phase 4: Dependency Audits (advisory) ---
echo -e "${BLUE}📦 Phase 4: Dependencies${NC}"
run_check "Dependency audit" "npm run audit:deps" "true"
echo ""

# --- Phase 5: E2E Crawl (advisory, requires server) ---
echo -e "${BLUE}🕷️  Phase 5: E2E Crawl (optional)${NC}"
echo -e "${BLUE}▶ Crawl console/network errors...${NC}"
if [ "$VERBOSE" = "1" ]; then
  if npm run test:crawl; then
    echo -e "${GREEN}✅ Crawl check passed${NC}"
  else
    echo -e "${YELLOW}⚠️  Crawl check skipped or failed (advisory)${NC}"
    ADVISORY_FAILED=1
  fi
else
  if npm run test:crawl > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Crawl check passed${NC}"
  else
    echo -e "${YELLOW}⚠️  Crawl check skipped or failed (advisory)${NC}"
    echo -e "${YELLOW}   Requires dev server. Run: AUTH0_BYPASS_DEV=true npm run test:crawl${NC}"
    ADVISORY_FAILED=1
  fi
fi
echo ""

# --- Summary ---
echo -e "${BLUE}================================${NC}"
if [ $FAILED -eq 0 ]; then
  if [ $ADVISORY_FAILED -eq 1 ]; then
    echo -e "${GREEN}✅ All blocking checks passed.${NC}"
    echo -e "${YELLOW}   Some advisory checks reported issues. Review above.${NC}"
  else
    echo -e "${GREEN}✅ All checks passed!${NC}"
  fi
  echo ""
  exit 0
else
  echo -e "${RED}❌ Some blocking checks failed. Fix issues before proceeding.${NC}"
  echo ""
  echo -e "${YELLOW}💡 Quick fix commands:${NC}"
  echo -e "   npm run cleanup:fix        # Auto-fix cleanup issues"
  echo -e "   npm run cleanup:check      # See cleanup details"
  echo -e "   npm run test:coverage      # See coverage report"
  echo ""
  exit 1
fi
