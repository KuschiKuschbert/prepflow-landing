#!/bin/bash
# Wrapper for the existing Sentinel health check
# Usage: ./check_health.sh

echo "🛡️  Invoking The Sentinel..."
npm run check:health
