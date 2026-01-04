# Scraper Rating Filter Optimization Plan

## Current Problem

**Current Flow:**

1. Discover all recipe URLs from listing pages (no rating check)
2. Scrape full recipe page (downloads entire HTML, parses all data)
3. Extract rating from full recipe page
4. **THEN** check if rating meets threshold
5. If rating too low → discard all the work we just did

**Inefficiency:**

- We're downloading and parsing full recipe pages for recipes we'll discard
- Wastes bandwidth, time, and rate limit quota
- For AllRecipes with 48,605 discovered recipes, if only 10% meet the 97.5% threshold, we're wasting 90% of our scraping effort

## Proposed Solution

**Optimized Flow:**

1. Discover recipe URLs from listing pages
2. **Extract rating from listing page** (most sites show ratings on cards)
3. **Filter URLs before adding to discovery list** (only keep recipes that meet threshold)
4. Only scrape full recipe pages for recipes that passed the filter
5. Final rating check on full page (safety net, in case listing page rating differs)

## Implementation Plan

### Phase 1: Enhance URL Discovery to Extract Ratings

**Modify `getAllRecipeUrls()` methods to return `{url: string, rating?: number}[]` instead of `string[]`**

**Files to modify:**

- `scripts/recipe-scraper/scrapers/allrecipes-scraper.ts`
- `scripts/recipe-scraper/scrapers/tasty-scraper.ts`
- `scripts/recipe-scraper/scrapers/epicurious-scraper.ts`
- `scripts/recipe-scraper/scrapers/food-network-scraper.ts`
- `scripts/recipe-scraper/scrapers/bon-appetit-scraper.ts`

**Example for AllRecipes:**

```typescript
// Current: Only extracts URLs
const recipeLinks = $('a[href*="/recipe/"]').map((_, el) => {
  const href = $(el).attr('href');
  // ... normalize URL
  return url;
});

// Enhanced: Extract URL + rating from listing card
const recipeLinks = $('a[href*="/recipe/"]').map((_, el) => {
  const href = $(el).attr('href');
  const $card = $(el).closest('.card, .recipe-card, [class*="card"]');

  // Extract rating from listing card
  // AllRecipes shows: <span class="rating">4.8</span> or data-rating="4.8"
  const ratingText = $card.find('.rating, [data-rating], .star-rating').first().text().trim();
  const rating = parseFloat(ratingText) || undefined;

  return {
    url: normalizedUrl,
    rating: rating, // Rating from listing page
  };
});
```

### Phase 2: Filter URLs During Discovery

**Modify `processSource()` to filter URLs before adding to progress tracker:**

```typescript
// In comprehensive-scraper.ts processSource()
const discoveredUrlsWithRatings = await scraper.getAllRecipeUrlsWithRatings();

// Filter URLs based on listing page ratings
const filteredUrls = discoveredUrlsWithRatings
  .filter(item => {
    // If no rating on listing page, include it (will check on full page)
    if (!item.rating) {
      return true; // Include unrated (will check on full page scrape)
    }

    // Normalize rating and check threshold
    const normalizedRating = normalizeRatingToStars(item.rating);
    if (!normalizedRating) return true; // Include if can't parse

    const sourceConfig = RATING_CONFIG.SOURCE_CONFIG[source];
    return normalizedRating >= sourceConfig.minRating;
  })
  .map(item => item.url); // Extract just URLs after filtering

// Initialize progress with filtered URLs only
progress = this.progressTracker.initializeProgress(source, filteredUrls);
```

### Phase 3: Update Type Definitions

**Create new interface:**

```typescript
// In parsers/types.ts or config.ts
export interface RecipeUrlWithRating {
  url: string;
  rating?: number; // Rating from listing page (may be undefined)
}
```

**Update BaseScraper:**

```typescript
// Add new method signature
abstract getAllRecipeUrlsWithRatings(): Promise<RecipeUrlWithRating[]>;

// Keep old method for backward compatibility (delegate to new method)
async getAllRecipeUrls(): Promise<string[]> {
  const urlsWithRatings = await this.getAllRecipeUrlsWithRatings();
  return urlsWithRatings.map(item => item.url);
}
```

### Phase 4: Handle Edge Cases

**What if listing page doesn't show ratings?**

- Include the URL anyway (will check on full page scrape)
- Some sites (like Bon Appétit) don't show ratings on listings

**What if listing page rating differs from full page?**

- Keep final rating check on full page as safety net
- Full page rating is authoritative

**What if listing page rating is in different format?**

- Use same normalization logic as `rating-filter.ts`
- Handle both star (0-5) and percentage (0-100) formats

## Expected Performance Improvement

**Current:**

- AllRecipes: 48,605 URLs discovered → scrape all 48,605 → filter → ~4,860 saved (10% pass)
- **Wasted:** ~43,745 full page scrapes

**Optimized:**

- AllRecipes: 48,605 URLs discovered → filter on listing page → ~4,860 URLs to scrape → ~4,860 saved
- **Saved:** ~43,745 full page scrapes (90% reduction in scraping work)

**Time Savings:**

- If each full page scrape takes ~2 seconds
- Current: 48,605 × 2s = ~27 hours
- Optimized: 4,860 × 2s = ~2.7 hours
- **Savings: ~24 hours (89% faster)**

## Implementation Priority

1. ✅ **High Priority:** AllRecipes (largest source, 48k recipes)
2. ✅ **High Priority:** Tasty (8k recipes, shows ratings on listings)
3. ✅ **Medium Priority:** Epicurious (17k recipes)
4. ✅ **Medium Priority:** Food Network (255 recipes, small but easy win)
5. ⚠️ **Low Priority:** Bon Appétit (doesn't show ratings on listings, skip optimization)

## Testing

1. Test that filtered URLs still scrape correctly
2. Verify listing page ratings match full page ratings (spot check)
3. Ensure unrated recipes on listings are still included
4. Test that progress tracking works with filtered URLs

## Backward Compatibility

- Keep `getAllRecipeUrls()` method for backward compatibility
- New method `getAllRecipeUrlsWithRatings()` returns enhanced data
- Old code continues to work, new code gets optimization
