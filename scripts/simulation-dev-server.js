#!/usr/bin/env node

/**
 * Simulation dev server with auto-restart on crash.
 * Runs `next dev --webpack` in a loop so long simulations survive Turbopack panics.
 * Used by playwright.simulation.config.ts webServer.
 */
const { spawn } = require('child_process');
const path = require('path');

const CWD = path.join(__dirname, '..');
const RESTART_DELAY_MS = 3000;

function startServer() {
  const child = spawn('npx', ['next', 'dev', '--webpack'], {
    cwd: CWD,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: process.env.PORT || '3000',
    },
  });

  child.on('exit', (code, signal) => {
    console.warn(
      `[simulation-dev-server] Next.js exited (code=${code}, signal=${signal}). Restarting in ${RESTART_DELAY_MS}ms...`,
    );
    setTimeout(startServer, RESTART_DELAY_MS);
  });
}

startServer();
