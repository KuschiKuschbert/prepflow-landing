# Recipe Scraper Verification Report

**Date:** 2025-01-03
**Purpose:** Verify HTML selectors and JSON-LD parsing for all recipe sources

## AllRecipes.com ✅ VERIFIED

**Test URL:** https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/

### Verification Results

✅ **JSON-LD:** Present and working
✅ **Recipe Name:** `h1.article-heading` - **WORKING** (1 element found)
✅ **Ingredients:** `.mm-recipes-structured-ingredients__list-item` - **WORKING** (20 elements found)
✅ **Instructions:** `.mntl-sc-block-group--OL li` - **WORKING** (10 elements found)
✅ **JSON-LD Instructions:** Present (10 steps)

### Selector Priority (Updated)

**Instructions Selectors (Updated Priority):**

1. `.mntl-sc-block-group--OL li` - **VERIFIED WORKING** (moved to #1 priority)
2. `.recipe-instructions li`
3. `.directions--section__step`
4. `[data-testid="recipe-instructions"] li`
5. `.comp.recipe__steps-content ol li`
6. `.recipe-instructions ol li`
7. `.directions ol li`
8. `ol.recipe-instructions li`

**Ingredients Selectors:**

1. `.mm-recipes-structured-ingredients__list-item` - **VERIFIED WORKING** (already #1 priority)
2. `.ingredients-item-name`
3. `.recipe-ingred_txt`
4. `[data-testid="ingredient-item"]`
5. `.mntl-structured-ingredients__list-item`
6. `.comp.ingredients-list li`
7. `.recipe-ingredients li`
8. `ul.ingredients-section li`
9. `.ingredients-section li`

### Notes

- JSON-LD parsing correctly handles `@type` as both string and array (already fixed)
- HTML fallback selectors are working correctly
- Instruction selector priority updated to match current AllRecipes structure

---

## BBC Good Food ⚠️ NEEDS VERIFICATION

**Test URL Attempted:** https://www.bbcgoodfood.com/recipes/classic-spaghetti-carbonara-recipe
**Result:** 404 - Page not found

### Current Selectors (Not Verified)

**Recipe Name:**

- `h1.recipe-header__title`
- `h1`

**Description:**

- `.recipe-header__description`
- `.recipe-description`

**Instructions:**

- `.method__list-item`
- `.recipe-method__list-item`
- `ol.recipe-method__list li`

**Ingredients:**

- `.ingredients-list__item`
- `.recipe-ingredients__list-item`

### Action Required

1. Find a working BBC Good Food recipe URL
2. Verify JSON-LD structure
3. Test all HTML selectors
4. Update selectors if needed

### Suggested Test URLs

Try searching for popular recipes:

- Search: "carbonara" or "chocolate cake" on bbcgoodfood.com
- Use sitemap to find valid recipe URLs

---

## Food Network ⚠️ NEEDS VERIFICATION

**Test URL Attempted:** https://www.foodnetwork.com/recipes/alton-brown/good-eats-rib-eye-recipe-1939524
**Result:** 404 - Page not found

### Current Selectors (Not Verified)

**Recipe Name:**

- `h1.o-AssetTitle__a-Headline`
- `h1`

**Description:**

- `.o-AssetDescription__a-Description`
- `.recipe-description`

**Instructions:**

- `.o-Method__m-Step`
- `.recipe-method-step`

**Ingredients:**

- `.o-Ingredients__a-ListItem`
- `.recipe-ingredients-item`

### Action Required

1. Find a working Food Network recipe URL
2. Verify JSON-LD structure (Food Network may require Puppeteer for JS-heavy pages)
3. Test all HTML selectors
4. Update selectors if needed
5. Verify Puppeteer integration is working correctly

### Suggested Test URLs

Try searching for popular recipes:

- Search: "chocolate chip cookies" or "pasta" on foodnetwork.com
- Use sitemap to find valid recipe URLs

---

## Recipe NLG

**Type:** Dataset (not a website)
**Status:** No verification needed - this is a static dataset

---

## Verification Checklist

- [x] AllRecipes - JSON-LD parsing verified
- [x] AllRecipes - HTML selectors verified
- [x] AllRecipes - Selector priority updated
- [ ] BBC Good Food - Find working recipe URL
- [ ] BBC Good Food - Verify JSON-LD structure
- [ ] BBC Good Food - Verify HTML selectors
- [ ] Food Network - Find working recipe URL
- [ ] Food Network - Verify JSON-LD structure (with Puppeteer)
- [ ] Food Network - Verify HTML selectors

---

## Recommendations

1. **AllRecipes:** ✅ Selectors are working correctly after priority update
2. **BBC Good Food:** Need to find working recipe URLs and verify selectors
3. **Food Network:** Need to find working recipe URLs and verify selectors (may require Puppeteer)
4. **Ongoing:** Periodically re-verify selectors as websites change their HTML structure

---

## How to Verify Selectors

1. Navigate to a recipe page in browser
2. Open DevTools (F12)
3. Check for JSON-LD: `document.querySelectorAll('script[type="application/ld+json"]')`
4. Test each selector: `document.querySelectorAll('.selector-name')`
5. Verify element count and sample content
6. Update scraper code if selectors have changed
