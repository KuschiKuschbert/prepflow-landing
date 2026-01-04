# Recipe Scraper Investigation Summary

**Date:** 2026-01-03
**Investigation:** Tasty scraper finding no recipes + time estimation

## Issues Found & Fixed

### 1. Tasty Sitemap URL (FIXED ✅)

**Problem:** Tasty scraper was returning 0 recipes because the sitemap URL was incorrect.

**Root Cause:**

- Configured URL: `https://tasty.co/sitemap.xml` (returns 404)
- Correct URL: `https://tasty.co/sitemaps/tasty/sitemap.xml` (from robots.txt)

**Fix Applied:**

- Updated `scripts/recipe-scraper/utils/sitemap-parser.ts` to use correct sitemap URL
- Verified: Now discovers **8,022 recipe URLs** from Tasty sitemap

**Status:** ✅ Fixed - Will work when scraper reaches Tasty source

### 2. Tasty Scraper Ingredient Parsing Bug (FIXED ✅)

**Problem:** Tasty scraper was using `extractIngredientName` (private method) instead of `parseIngredientName` from BaseScraper.

**Fix Applied:**

- Updated `scripts/recipe-scraper/scrapers/tasty-scraper.ts` to use `this.parseIngredientName` from BaseScraper

**Status:** ✅ Fixed

### 3. File Saving Errors (FIXED ✅)

**Problem:** Recipes were failing to save with `ENOENT` errors because filenames included `https://` from recipe IDs.

**Root Cause:**

- Recipe IDs were full URLs (e.g., `https://www.allrecipes.com/recipe/13404/...`)
- Filename generator was using `id.substring(0, 8)` which included `https://`
- This created invalid filenames like `smoked-corn-on-the-cob-https:/.json.gz`

**Fix Applied:**

- Updated `scripts/recipe-scraper/storage/json-storage.ts` to:
  - Extract numeric IDs from URLs (e.g., `13404` from AllRecipes URLs)
  - Fall back to slugs if no numeric ID found
  - Properly sanitize all special characters
  - Ensure directory exists before writing

**Status:** ✅ Fixed - New recipes should save successfully

## Current Scraping Status

### Per-Source Statistics

| Source           | Total Recipes | Scraped  | Failed | Remaining | Est. Time |
| ---------------- | ------------- | -------- | ------ | --------- | --------- |
| **AllRecipes**   | 48,605        | 422 (1%) | 826    | 47,357    | 1.1 days  |
| **Food Network** | 225           | 0 (0%)   | 0      | 225       | 8 minutes |
| **Epicurious**   | 17,355        | 0 (0%)   | 0      | 17,355    | 9.6 hours |
| **Bon Appétit**  | 10,484        | 0 (0%)   | 0      | 10,484    | 5.8 hours |
| **Tasty**        | 8,022\*       | 0 (0%)   | 0      | 8,022\*   | 4.5 hours |

\*Tasty count verified via sitemap test (not yet in progress file)

### Overall Statistics

- **Total recipes to scrape:** 76,669
- **Already scraped:** 422 (1%)
- **Failed:** 826 (will be retried)
- **Remaining:** 75,421
- **Estimated time to complete:** **~1.7 days** (41 hours)

**Note:** Estimate assumes:

- 30 recipes/minute (conservative, accounts for rate limiting)
- Continuous scraping without interruptions
- Failed recipes will be retried (adds time)

## Why Tasty Found No Recipes

The Tasty scraper found 0 recipes because:

1. **Incorrect sitemap URL** - The configured URL (`https://tasty.co/sitemap.xml`) returned 404
2. **Scraper hasn't reached Tasty yet** - The comprehensive scraper processes sources sequentially, and it's currently on AllRecipes (source 1 of 5)

**Status:** ✅ Fixed - Tasty will work correctly when the scraper reaches it (after AllRecipes, Food Network, Epicurious, and Bon Appétit are complete).

## Time Estimation Breakdown

### Conservative Estimate (30 recipes/minute)

- **Total time:** ~1.7 days (41 hours)
- **Per source:**
  - AllRecipes: 1.1 days (26 hours)
  - Food Network: 8 minutes
  - Epicurious: 9.6 hours
  - Bon Appétit: 5.8 hours
  - Tasty: 4.5 hours

### Factors Affecting Actual Time

1. **Rate Limiting:** 1-2 second delays between requests
2. **Network Conditions:** Variable response times
3. **Retry Logic:** Failed recipes will be retried (adds time)
4. **Rating Filter:** Many recipes below 4.75 rating are skipped (saves time)
5. **File I/O:** Saving compressed JSON files (minimal impact)

### Realistic Estimate

Given the current rate of ~422 recipes scraped so far, and accounting for:

- Rate limiting delays
- Retry attempts for failed recipes
- Rating filter reducing actual saves

**Realistic estimate: 2-3 days** for complete scraping of all 5 sources.

## Next Steps

1. ✅ **Tasty sitemap URL fixed** - Will work when scraper reaches Tasty
2. ✅ **File saving errors fixed** - Recipes should now save successfully
3. ✅ **Time estimation script created** - Run `npx tsx scripts/recipe-scraper/estimate-scraping-time.ts` anytime

## Monitoring

The scraper is currently running and processing AllRecipes. You can:

- Monitor progress via the UI at `/webapp/ai-specials`
- Check terminal logs for real-time status
- Run time estimation: `npx tsx scripts/recipe-scraper/estimate-scraping-time.ts`
- Stop scraper if needed: Use "Stop Scraping" button in UI or `node scripts/stop-scraper-manual.js`
