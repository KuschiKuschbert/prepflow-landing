# Menu Item Pricing Cache System

## Overview

The menu item pricing cache system automatically calculates, stores, and refreshes recommended selling prices for menu items. This eliminates redundant calculations and ensures consistent pricing across the application.

## How It Works

### 1. **Automatic Caching**

When a menu item's statistics are calculated (via `/api/menus/[id]/items/[itemId]/statistics`), the recommended price is automatically cached in `menu_items.recommended_selling_price` for future use.

### 2. **Cache Invalidation**

The cache is automatically invalidated (set to NULL) when underlying data changes:

- **Ingredient Cost Changes**: When `cost_per_unit`, `cost_per_unit_as_purchased`, `cost_per_unit_incl_trim`, `trim_peel_waste_percentage`, or `yield_percentage` changes
- **Recipe Ingredient Changes**: When ingredients are added/removed/updated in a recipe
- **Recipe Yield Changes**: When recipe `yield` changes (affects per-serving price)
- **Dish Ingredient Changes**: When ingredients are added/removed/updated in a dish
- **Dish Recipe Changes**: When recipes are added/removed/updated in a dish

### 3. **Price Calculation Priority**

When fetching menu item statistics, prices are determined in this order:

1. **Actual Price** (`menu_items.actual_selling_price`) - User-set override
2. **Cached Recommended** (`menu_items.recommended_selling_price`) - Previously calculated
3. **Dish Price** (`dishes.selling_price`) - If menu item uses a dish
4. **Calculated Recommended** - Dynamically calculated from COGS + target margin

### 4. **Manual Refresh**

You can manually refresh all recommended prices for a menu:

```bash
POST /api/menus/[menuId]/refresh-prices
```

This recalculates and caches recommended prices for all items in the menu.

## Files & Components

### Cache Utilities

- **`lib/menu-pricing/cache-invalidation.ts`**: Functions to invalidate cached prices
  - `invalidateMenuItemsWithRecipe(recipeId)` - Invalidates prices for menu items using a recipe
  - `invalidateMenuItemsWithDish(dishId)` - Invalidates prices for menu items using a dish
  - `invalidateMenuItemsWithIngredient(ingredientId)` - Invalidates prices for menu items using recipes/dishes with an ingredient
  - `invalidateMenuRecommendedPrices(menuId)` - Invalidates all prices for a menu

### Caching Functions

- **`app/api/menus/[id]/items/[itemId]/helpers/cacheRecommendedPrice.ts`**: Functions to cache calculated prices
  - `cacheRecommendedPrice(menuId, menuItemId, menuItem)` - Calculates and caches recommended price for a single item
  - `refreshMenuRecommendedPrices(menuId)` - Refreshes all recommended prices for a menu

### API Endpoints

- **`GET /api/menus/[id]/items/[itemId]/statistics`**: Calculates and caches recommended prices automatically
- **`POST /api/menus/[id]/refresh-prices`**: Manually refresh all recommended prices for a menu

## Integration Points

Cache invalidation is automatically triggered in:

1. **Ingredient Updates** (`app/api/ingredients/helpers/updateIngredient.ts`)
   - Invalidates when cost-related fields change

2. **Recipe Ingredient Updates** (`app/api/recipes/[id]/ingredients/helpers/saveRecipeIngredients.ts`)
   - Invalidates when recipe ingredients change

3. **Recipe Updates** (`app/api/recipes/[id]/route.ts`)
   - Invalidates when recipe yield or ingredients change

4. **Dish Updates** (`app/api/dishes/[id]/route.ts`)
   - Invalidates when dish ingredients or recipes change

## Benefits

- **Performance**: Avoids redundant calculations on every request
- **Consistency**: Same recommended price across all views
- **Automatic Updates**: Cache refreshes automatically when data changes
- **Cross-Reference**: Prices are stored in database, accessible from anywhere

## Usage Example

```typescript
// Statistics endpoint automatically caches calculated prices
const response = await fetch(`/api/menus/${menuId}/items/${itemId}/statistics`);
const { statistics } = await response.json();
// statistics.recommended_selling_price is now cached in database

// Manually refresh all prices for a menu
await fetch(`/api/menus/${menuId}/refresh-prices`, { method: 'POST' });
```

## Database Schema

The `menu_items` table includes:

- `actual_selling_price` (DECIMAL) - User-set price override (nullable)
- `recommended_selling_price` (DECIMAL) - Cached calculated price (nullable)

When `recommended_selling_price` is NULL, it will be calculated dynamically on next access and cached.



