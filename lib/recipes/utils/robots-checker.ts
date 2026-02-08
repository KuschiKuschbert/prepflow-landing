/**
 * Robots.txt Checker (Migrated from scripts)
 */

import axios from 'axios';
import robotsParser from 'robots-parser';
import { scraperLogger } from './logger';

type Robots = any; // Simplify types for robots-parser

const robotsCache = new Map<string, Robots>();

async function getRobotsParser(url: string): Promise<Robots | null> {
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const robotsUrl = `${baseUrl}/robots.txt`;

    if (robotsCache.has(baseUrl)) {
      return robotsCache.get(baseUrl)!;
    }

    const response = await axios.get(robotsUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
      },
      validateStatus: () => true, // Don't throw on 404
    });

    if (response.status !== 200) return null;

    const robots = robotsParser(robotsUrl, response.data);
    robotsCache.set(baseUrl, robots);
    return robots;
  } catch (error) {
    scraperLogger.warn(`Could not fetch robots.txt for ${url}:`, error);
    return null;
  }
}

export async function isUrlAllowed(
  url: string,
  userAgent: string = 'PrepFlow Recipe Scraper',
): Promise<boolean> {
  try {
    const robots = await getRobotsParser(url);
    if (!robots) return true;

    const allowed = robots.isAllowed(url, userAgent);
    if (allowed === false) {
      scraperLogger.warn(`URL disallowed by robots.txt: ${url}`);
    }
    return allowed ?? true;
  } catch (error) {
    scraperLogger.error(`Error checking robots.txt for ${url}:`, error);
    return true;
  }
}

export async function getCrawlDelay(
  url: string,
  userAgent: string = 'PrepFlow Recipe Scraper',
): Promise<number | null> {
  try {
    const robots = await getRobotsParser(url);
    if (!robots) return null;

    const delay = robots.getCrawlDelay(userAgent);
    return delay ? delay * 1000 : null;
  } catch (error) {
    scraperLogger.error(`Error getting crawl delay for ${url}:`, error);
    return null;
  }
}
