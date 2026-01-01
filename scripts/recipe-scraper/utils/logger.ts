/**
 * Scraper Logger
 * Simple logger for recipe scraper operations
 */

import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'recipe-scraper.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function writeLog(level: string, message: string, data?: unknown): void {
  const timestamp = formatTimestamp();
  const logEntry: Record<string, unknown> = {
    timestamp,
    level,
    message,
  };
  if (data) {
    logEntry.data = data;
  }
  const logLine = JSON.stringify(logEntry) + '\n';

  // Write to file
  fs.appendFileSync(LOG_FILE, logLine);

  // Also log to console in development (intentional for CLI tool)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${timestamp}] [${level}] ${message}`, data || '');
  }
}

export const scraperLogger = {
  info: (message: string, data?: unknown) => writeLog('INFO', message, data),
  warn: (message: string, data?: unknown) => writeLog('WARN', message, data),
  error: (message: string, data?: unknown) => writeLog('ERROR', message, data),
  debug: (message: string, data?: unknown) => writeLog('DEBUG', message, data),
};
