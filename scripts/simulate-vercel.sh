#!/bin/bash
export VERCEL=1
export NODE_ENV=production

# Install production dependencies for serverless function
npm install puppeteer-core @sparticuz/chromium

# Build using npm to ensure local binaries are found
npm run build

# Start using npm with auth bypass, redirecting output to log file
AUTH0_BYPASS_DEV=true PERFORMANCE_TEST_TOKEN=perf-test-secret npm start > server.log 2>&1 &
echo $! > server.pid
wait
