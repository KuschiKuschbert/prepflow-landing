/**
 * Rate Limiter
 * Implements rate limiting for web scraping
 */

import { scraperLogger } from './logger';

export class RateLimiter {
  private lastRequestTime: number = 0;
  private readonly delayMs: number;

  constructor(delayMs: number = 2000) {
    this.delayMs = delayMs;
  }

  /**
   * Wait for the appropriate delay before making a request
   */
  async wait(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.delayMs) {
      const waitTime = this.delayMs - timeSinceLastRequest;
      scraperLogger.debug(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.lastRequestTime = 0;
  }
}
