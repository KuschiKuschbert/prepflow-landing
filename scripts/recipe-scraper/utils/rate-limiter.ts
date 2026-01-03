/**
 * Rate Limiter
 * Implements rate limiting for web scraping with support for concurrent requests
 * Uses a semaphore pattern to allow N concurrent requests before enforcing delays
 */

import { scraperLogger } from './logger';

export class RateLimiter {
  private requestTimes: number[] = []; // Track last N request times
  private readonly delayMs: number;
  private readonly maxConcurrent: number; // Maximum concurrent requests allowed

  constructor(delayMs: number = 2000, maxConcurrent: number = 3) {
    this.delayMs = delayMs;
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Wait for the appropriate delay before making a request
   * Supports concurrent requests: allows up to maxConcurrent requests without delay,
   * then enforces delay based on the oldest request in the current batch
   */
  async wait(): Promise<void> {
    const now = Date.now();

    // Remove request times older than delayMs (they're no longer relevant)
    this.requestTimes = this.requestTimes.filter(
      time => now - time < this.delayMs,
    );

    // If we have fewer than maxConcurrent recent requests, allow immediately
    if (this.requestTimes.length < this.maxConcurrent) {
      this.requestTimes.push(now);
      return;
    }

    // We have maxConcurrent or more recent requests
    // Wait until the oldest request is delayMs old
    const oldestRequestTime = Math.min(...this.requestTimes);
    const timeSinceOldest = now - oldestRequestTime;

    if (timeSinceOldest < this.delayMs) {
      const waitTime = this.delayMs - timeSinceOldest;
      scraperLogger.debug(`Rate limiting: waiting ${waitTime}ms (${this.requestTimes.length} concurrent requests)`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Add this request time (after waiting)
    this.requestTimes.push(Date.now());

    // Clean up old entries (keep only the last maxConcurrent)
    if (this.requestTimes.length > this.maxConcurrent) {
      this.requestTimes = this.requestTimes.slice(-this.maxConcurrent);
    }
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.requestTimes = [];
  }
}
