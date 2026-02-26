#!/usr/bin/env node

/**
 * Simulation dev server with auto-restart on crash.
 * Runs `next dev --webpack` in a loop so long simulations survive Turbopack panics.
 * Used by playwright.simulation.config.ts webServer.
 * Filters noisy Next.js dev-mode warnings to keep terminal output manageable.
 */
const { spawn } = require('child_process');
const path = require('path');

const CWD = path.join(__dirname, '..');
const RESTART_DELAY_MS = 3000;

// Patterns to suppress from Next.js dev server output (noisy but harmless in dev mode)
const SUPPRESS_PATTERNS = [
  /registerClientReference.*is not exported/,
  /jsxDEV.*is not exported/,
  /Fragment.*is not exported/,
  /Attempted import error:/,
  /Import trace for requested module:/,
];

function shouldSuppress(line) {
  return SUPPRESS_PATTERNS.some(pattern => pattern.test(line));
}

function filterStream(stream, prefix) {
  let buffer = '';
  stream.on('data', chunk => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line in buffer
    for (const line of lines) {
      if (!shouldSuppress(line)) {
        process.stdout.write(prefix + line + '\n');
      }
    }
  });
  stream.on('end', () => {
    if (buffer && !shouldSuppress(buffer)) {
      process.stdout.write(prefix + buffer + '\n');
    }
  });
}

function startServer() {
  const child = spawn('npx', ['next', 'dev', '--webpack'], {
    cwd: CWD,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PORT: process.env.PORT || '3000',
    },
  });

  filterStream(child.stdout, '');
  filterStream(child.stderr, '');

  child.on('exit', (code, signal) => {
    console.warn(
      `[simulation-dev-server] Next.js exited (code=${code}, signal=${signal}). Restarting in ${RESTART_DELAY_MS}ms...`,
    );
    setTimeout(startServer, RESTART_DELAY_MS);
  });
}

startServer();
