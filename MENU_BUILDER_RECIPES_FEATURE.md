# Menu Builder - Add Recipes Feature

## Overview

The menu builder now supports adding recipes directly to menus, in addition to dishes. This allows chefs to add recipes (like salad cups) that haven't been converted to dishes yet.

## Database Migration Required

**IMPORTANT:** Before using this feature, you must run the database migration:

1. Open your Supabase project dashboard
2. Go to SQL Editor (left sidebar)
3. Click "New query"
4. Copy the SQL from `menu-builder-add-recipes-migration.sql` in the project root
5. Paste and run the SQL in Supabase SQL Editor

The migration will:

- Add `recipe_id` column to `menu_items` table (nullable)
- Make `dish_id` nullable (since recipes don't need it)
- Add constraint to ensure either `dish_id` or `recipe_id` is provided (but not both)
- Add index for `recipe_id` lookups

## What Changed

### Database

- `menu_items` table now supports both `dish_id` and `recipe_id`
- Constraint ensures items are either dishes OR recipes (not both)

### API Endpoints

- `POST /api/menus/[id]/items` now accepts `recipe_id` in addition to `dish_id`
- `GET /api/menus/[id]` now includes recipe data in menu items

### UI Components

- **DishPalette**: Now shows both dishes and recipes with visual distinction
  - Dishes: Cyan icon (Utensils) with price
  - Recipes: Magenta icon (ChefHat) with serving count
- **MenuCategory**: Displays both dishes and recipes in menu categories
- **MenuEditor**: Fetches and displays recipes alongside dishes

### Types

- Added `Recipe` interface to menu builder types
- Updated `MenuItem` to support optional `recipe_id` and `recipes` relation

## Usage

1. **Run the database migration** (see above)
2. Navigate to Menu Builder
3. In the left palette, you'll see:
   - **Dishes** section (cyan icon) - dishes with prices
   - **Recipes** section (magenta icon) - recipes with serving counts
4. Drag either dishes or recipes into menu categories
5. Recipes appear in menus with a magenta chef hat icon

## Visual Indicators

- **Dishes**: Cyan border on hover, Utensils icon, shows price
- **Recipes**: Magenta border on hover, ChefHat icon, shows servings

## Notes

- Recipes don't have prices (they're not dishes yet)
- Recipes can be converted to dishes later if needed
- Both dishes and recipes can be reordered within categories
- Both can be removed from menus using the trash icon

