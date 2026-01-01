/**
 * Robots.txt Checker
 * Checks robots.txt before scraping
 */

import robotsParser from 'robots-parser';
import axios from 'axios';
import { scraperLogger } from './logger';

type Robots = ReturnType<typeof robotsParser>;

const robotsCache = new Map<string, Robots>();

/**
 * Get robots.txt parser for a domain
 */
async function getRobotsParser(url: string): Promise<Robots | null> {
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const robotsUrl = `${baseUrl}/robots.txt`;

    // Check cache
    if (robotsCache.has(baseUrl)) {
      return robotsCache.get(baseUrl)!;
    }

    // Fetch robots.txt
    const response = await axios.get(robotsUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
      },
    });

    const robots = robotsParser(robotsUrl, response.data);
    robotsCache.set(baseUrl, robots);
    return robots;
  } catch (error) {
    // If robots.txt doesn't exist or can't be fetched, assume allowed
    scraperLogger.warn(`Could not fetch robots.txt for ${url}:`, error);
    return null;
  }
}

/**
 * Check if a URL is allowed by robots.txt
 */
export async function isUrlAllowed(
  url: string,
  userAgent: string = 'PrepFlow Recipe Scraper',
): Promise<boolean> {
  try {
    const robots = await getRobotsParser(url);
    if (!robots) {
      // If no robots.txt, assume allowed
      return true;
    }

    const allowed = robots.isAllowed(url, userAgent);
    if (allowed === false) {
      scraperLogger.warn(`URL disallowed by robots.txt: ${url}`);
    }
    return allowed ?? true; // Default to allowed if undefined
  } catch (error) {
    scraperLogger.error(`Error checking robots.txt for ${url}:`, error);
    // On error, assume allowed (fail open)
    return true;
  }
}

/**
 * Get crawl delay from robots.txt
 */
export async function getCrawlDelay(
  url: string,
  userAgent: string = 'PrepFlow Recipe Scraper',
): Promise<number | null> {
  try {
    const robots = await getRobotsParser(url);
    if (!robots) {
      return null;
    }

    const delay = robots.getCrawlDelay(userAgent);
    return delay ? delay * 1000 : null; // Convert to milliseconds
  } catch (error) {
    scraperLogger.error(`Error getting crawl delay for ${url}:`, error);
    return null;
  }
}
