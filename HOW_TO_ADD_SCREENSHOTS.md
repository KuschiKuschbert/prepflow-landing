# How to Add Your New Screenshots

## Current Status

✅ **Component references updated** - All components now reference the new screenshot names
✅ **Old screenshots deleted** - `recipe-screenshot.png` and `stocklist-screenshot.png` removed
⚠️ **New screenshots needed** - Need to add the actual image files

## Required Screenshots

Based on your images, we need these 3 files in `public/images/`:

### 1. Ingredients Management Screenshot

- **File name:** `ingredients-management-screenshot.png`
- **What it shows:** Ingredients Management table with ingredients, costs, suppliers, stock levels, and actions (Add Ingredient, Import CSV, Export CSV buttons)
- **Location to save:** `public/images/ingredients-management-screenshot.png`

### 2. COGS Calculator Screenshot

- **File name:** `cogs-calculator-screenshot.png`
- **What it shows:** COGS Calculator with "Create Dish" section (left) and "Cost Analysis" section (right)
- **Location to save:** `public/images/cogs-calculator-screenshot.png`

### 3. Cleaning Roster Screenshot

- **File name:** `cleaning-roster-screenshot.png`
- **What it shows:** Cleaning Roster with cleaning areas cards (Bar counter, Bathrooms, Walk-in cooler)
- **Location to save:** `public/images/cleaning-roster-screenshot.png`

## How to Add the Screenshots

### Option 1: Using File Explorer/Finder

1. Open the `public/images/` folder in your file explorer
2. Copy your screenshot files into this folder
3. Rename them to match the exact file names above:
   - `ingredients-management-screenshot.png`
   - `cogs-calculator-screenshot.png`
   - `cleaning-roster-screenshot.png`

### Option 2: Using Terminal

If you have the screenshots saved elsewhere on your computer:

```bash
# Copy screenshots to the project (replace SOURCE_PATH with your file location)
cp SOURCE_PATH/ingredients-management-screenshot.png public/images/
cp SOURCE_PATH/cogs-calculator-screenshot.png public/images/
cp SOURCE_PATH/cleaning-roster-screenshot.png public/images/
```

### Option 3: Drag and Drop in VS Code/Cursor

1. Open the `public/images/` folder in your editor
2. Drag your screenshot files into the folder
3. Rename them to match the required names

## Image Requirements

- **Format:** PNG (or JPG as fallback)
- **Size:** Recommended 1200x800px or similar 3:2 aspect ratio for feature screenshots
- **Hero screenshot:** 1920x1080px or similar 16:9 aspect ratio
- **File size:** Try to keep under 2MB per image
- **Optimization:** You can optimize later with WebP/AVIF formats

## Verification

After adding the files, verify they exist:

```bash
ls -lh public/images/*-screenshot.png
```

You should see:

- `dashboard-screenshot.png` (already exists)
- `settings-screenshot.png` (already exists)
- `ingredients-management-screenshot.png` (new)
- `cogs-calculator-screenshot.png` (new)
- `cleaning-roster-screenshot.png` (new)

## Testing

Once files are added, the landing page will automatically use them. Test by:

1. Restarting the dev server: `npm run dev`
2. Visiting `http://localhost:3000`
3. Checking that images load correctly in:
   - Hero section (dashboard)
   - Highlights section (ingredients, COGS)
   - Closer Look expandable sections (all features)

## Need Help?

If you need to:

- Capture new screenshots from your webapp
- Optimize existing screenshots
- Convert formats
- Resize images

Let me know and I can help with the specific steps!



