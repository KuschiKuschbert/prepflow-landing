#!/usr/bin/env node

/**
 * Test Tasty Sitemap
 * Quick test to check if Tasty sitemap is accessible and recipe URLs are being discovered
 */

import { SitemapParser } from './utils/sitemap-parser';
import { SOURCES } from './config';
import { scraperLogger } from './utils/logger';

async function testTastySitemap() {
  scraperLogger.info('🧪 Testing Tasty sitemap discovery...\n');

  try {
    const parser = new SitemapParser();

    // Test 1: Check sitemap URL
    const sitemapUrl = parser.getSitemapUrl(SOURCES.TASTY);
    scraperLogger.info(`📋 Sitemap URL: ${sitemapUrl}`);

    if (!sitemapUrl) {
      scraperLogger.error('❌ No sitemap URL configured for Tasty');
      return;
    }

    // Test 2: Parse sitemap
    scraperLogger.info('\n📥 Fetching sitemap...');
    const allUrls = await parser.parseSitemap(sitemapUrl);
    scraperLogger.info(`✅ Found ${allUrls.length} total URLs in sitemap`);

    if (allUrls.length === 0) {
      scraperLogger.warn('⚠️  Sitemap returned 0 URLs - sitemap might be empty or inaccessible');
      return;
    }

    // Test 3: Show first 10 URLs as sample
    scraperLogger.info('\n📝 Sample URLs (first 10):');
    allUrls.slice(0, 10).forEach((url, i) => {
      scraperLogger.info(`   ${i + 1}. ${url}`);
    });

    // Test 4: Filter recipe URLs
    scraperLogger.info('\n🔍 Filtering recipe URLs...');
    const recipeUrls = parser.filterRecipeUrls(allUrls, SOURCES.TASTY);
    scraperLogger.info(`✅ Found ${recipeUrls.length} recipe URLs after filtering`);

    if (recipeUrls.length === 0) {
      scraperLogger.warn('⚠️  No recipe URLs found after filtering');
      scraperLogger.info('\n🔍 Checking URL pattern...');
      scraperLogger.info(`   Pattern: /tasty\\.co\\/recipe\\//i`);
      scraperLogger.info(`   Sample URLs that should match:`);
      allUrls.slice(0, 20).forEach((url, i) => {
        const matches = /tasty\.co\/recipe\//i.test(url);
        scraperLogger.info(`   ${matches ? '✅' : '❌'} ${url}`);
      });
    } else {
      scraperLogger.info('\n📝 Sample recipe URLs (first 10):');
      recipeUrls.slice(0, 10).forEach((url, i) => {
        scraperLogger.info(`   ${i + 1}. ${url}`);
      });
    }

    scraperLogger.info('\n✅ Test complete!');
  } catch (error) {
    scraperLogger.error('❌ Test failed:', error);
    if (error instanceof Error) {
      scraperLogger.error(`   Error message: ${error.message}`);
      scraperLogger.error(`   Stack: ${error.stack}`);
    }
  }
}

testTastySitemap();
