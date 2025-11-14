# Screenshot Setup - What You Need to Do

## Current Status

✅ **Code Updated** - All components now reference new screenshot names
✅ **Old Screenshots Deleted** - Removed `recipe-screenshot.png` and `stocklist-screenshot.png`
❌ **New Screenshots Missing** - Need to add 3 new screenshot files

## What We Need

Based on your image descriptions, we need these 3 files in `public/images/`:

1. **ingredients-management-screenshot.png**
   - Shows: Ingredients Management table with ingredients, costs, suppliers, stock

2. **cogs-calculator-screenshot.png**
   - Shows: COGS Calculator with "Create Dish" (left) and "Cost Analysis" (right)

3. **cleaning-roster-screenshot.png**
   - Shows: Cleaning Roster with cleaning areas cards

## How to Add Them

### Step 1: Capture Screenshots

From your logged-in webapp session, take screenshots of:

- `/webapp/ingredients` page
- `/webapp/cogs` page
- `/webapp/cleaning` page

### Step 2: Save Files

Save them to `public/images/` with these exact names:

- `ingredients-management-screenshot.png`
- `cogs-calculator-screenshot.png`
- `cleaning-roster-screenshot.png`

### Step 3: Verify

Run this command to check:

```bash
ls -lh public/images/*-screenshot.png
```

You should see 5 files total (including the existing dashboard and settings screenshots).

## Once Files Are Added

The landing page will automatically use the new screenshots - no code changes needed!

**Do you have the screenshot files ready to add, or do you need help capturing them?**



