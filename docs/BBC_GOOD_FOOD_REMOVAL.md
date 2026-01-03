# BBC Good Food Scraper Removal

**Date:** 2026-01-03
**Reason:** Terms of Service violation
**Status:** ✅ Removed from production scraper

## Summary

BBC Good Food scraper has been **disabled and removed** from the production recipe scraper due to their Terms of Service explicitly prohibiting:
1. **Commercial use** of their content
2. **Copying/storing** their content in any medium

## Legal Analysis

**See:** `docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md` for complete legal analysis

**Key Findings:**
- ✅ **robots.txt:** Recipe pages are NOT disallowed (technically allowed)
- ⚠️ **Terms of Service:** Explicitly prohibit commercial use and copying/storing content
- **Recommendation:** Removed from production to avoid legal risk

## Changes Made

### 1. Configuration (`scripts/recipe-scraper/config.ts`)
- ✅ Kept `BBC_GOOD_FOOD` in `SOURCES` enum (for type safety)
- ✅ Removed from `RATING_CONFIG.SOURCE_CONFIG`
- ✅ Added comment: `// DISABLED - Terms of Service violation`

### 2. Comprehensive Scraper (`scripts/recipe-scraper/jobs/comprehensive-scraper.ts`)
- ✅ Removed from default sources list in `start()` method
- ✅ Removed from default sources list in `resume()` method
- ✅ Removed from `getStatus()` sources list
- ✅ `getScraper()` now throws error if BBC Good Food is requested
- ✅ Commented out import (kept for reference)

### 3. CLI Scraper (`scripts/recipe-scraper/index.ts`)
- ✅ `getScraper()` now throws error if BBC Good Food is requested
- ✅ Commented out import (kept for reference)

### 4. API Helpers (`app/api/recipe-scraper/scrape/helpers.ts`)
- ✅ `createScraper()` now throws error if BBC Good Food is requested
- ✅ Removed from type union
- ✅ Commented out import (kept for reference)

### 5. Sitemap Parser (`scripts/recipe-scraper/utils/sitemap-parser.ts`)
- ✅ Removed from URL patterns
- ✅ Removed from sitemap URLs
- ✅ Added special handling for disabled source

### 6. UI Components
- ✅ Removed from `RegularScraperSection` dropdown
- ✅ Removed from `RecipeScraper` source state type
- ✅ Updated `ComprehensiveScraperSection` description (removed BBC Good Food mention)

### 7. Scraper Implementation
- ✅ Scraper file (`scripts/recipe-scraper/scrapers/bbc-good-food-scraper.ts`) **kept** for reference
- ✅ All references to it throw errors or are commented out

## Current Active Sources

The scraper now supports **5 sources** (down from 6):

1. ✅ **AllRecipes** (`allrecipes`)
2. ✅ **Food Network** (`food-network`)
3. ✅ **Epicurious** (`epicurious`)
4. ✅ **Bon Appétit** (`bon-appetit`)
5. ✅ **Tasty** (`tasty`)

## Error Handling

If someone attempts to use BBC Good Food scraper:

```typescript
// Throws error:
throw new Error(
  'BBC Good Food scraper is disabled due to Terms of Service violation. See docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md'
);
```

## Testing

✅ **TypeScript:** All type checks pass
✅ **Linting:** No lint errors
⏳ **Runtime:** Needs testing with remaining 5 sources

## Re-enabling (If Permission Obtained)

If written permission is obtained from Immediate Media Company:

1. Uncomment imports in all files
2. Add back to default sources lists
3. Remove error throws from `getScraper()` methods
4. Add back to UI dropdowns
5. Update documentation

**See:** `docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md` for contact information and permission request template.
