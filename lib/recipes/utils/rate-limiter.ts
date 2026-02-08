/**
 * Rate Limiter (Migrated from scripts)
 */

import { scraperLogger } from './logger';

export class RateLimiter {
  private requestTimes: number[] = [];
  private readonly delayMs: number;
  private readonly maxConcurrent: number;

  constructor(delayMs: number = 2000, maxConcurrent: number = 3) {
    this.delayMs = delayMs;
    this.maxConcurrent = maxConcurrent;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(time => now - time < this.delayMs);

    if (this.requestTimes.length < this.maxConcurrent) {
      this.requestTimes.push(now);
      return;
    }

    const oldestRequestTime = Math.min(...this.requestTimes);
    const timeSinceOldest = now - oldestRequestTime;

    if (timeSinceOldest < this.delayMs) {
      const waitTime = this.delayMs - timeSinceOldest;
      scraperLogger.debug(
        `Rate limiting: waiting ${waitTime}ms (${this.requestTimes.length} concurrent requests)`,
      );
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requestTimes.push(Date.now());
    if (this.requestTimes.length > this.maxConcurrent) {
      this.requestTimes = this.requestTimes.slice(-this.maxConcurrent);
    }
  }

  reset(): void {
    this.requestTimes = [];
  }
}
