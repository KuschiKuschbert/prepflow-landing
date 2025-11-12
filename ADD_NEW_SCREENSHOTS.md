# Adding New Screenshots

## Required Screenshots

Please add these new screenshot files to `public/images/` directory:

### 1. Ingredients Management Screenshot

- **File names:**
  - `ingredients-management-screenshot.png`
  - `ingredients-management-screenshot.webp` (optional, for optimization)
  - `ingredients-management-screenshot.avif` (optional, for optimization)
- **Content:** Ingredients Management table showing ingredients with costs, suppliers, stock levels, and actions
- **Size:** Recommended 1200x800px or similar 3:2 aspect ratio
- **Used in:**
  - Highlights section (Ingredients Management card)
  - Closer Look section (Ingredients & Stock expandable feature)

### 2. COGS Calculator Screenshot

- **File names:**
  - `cogs-calculator-screenshot.png`
  - `cogs-calculator-screenshot.webp` (optional)
  - `cogs-calculator-screenshot.avif` (optional)
- **Content:** COGS Calculator showing "Create Dish" section on left and "Cost Analysis" section on right
- **Size:** Recommended 1200x800px or similar 3:2 aspect ratio
- **Used in:**
  - Highlights section (Recipe Management card)
  - Closer Look section (COGS Calculator expandable feature)

### 3. Cleaning Roster Screenshot

- **File names:**
  - `cleaning-roster-screenshot.png`
  - `cleaning-roster-screenshot.webp` (optional)
  - `cleaning-roster-screenshot.avif` (optional)
- **Content:** Cleaning Roster showing cleaning areas with cards (Bar counter, Bathrooms, Walk-in cooler)
- **Size:** Recommended 1200x800px or similar 3:2 aspect ratio
- **Used in:**
  - Closer Look section (Cleaning & Compliance expandable feature)

## Files Already in Use (Keep These)

- `dashboard-screenshot.png` - Kitchen Management Dashboard (used in Hero and multiple sections)
- `settings-screenshot.png` - Settings page (used in Closer Look section)
- `prepflow-logo.png` - Logo files (keep all variants)

## Old Screenshots (Already Deleted)

✅ **Deleted:**

- `recipe-screenshot.png` (replaced with `cogs-calculator-screenshot.png`)
- `stocklist-screenshot.png` (replaced with `ingredients-management-screenshot.png`)

## Quick Steps

1. **Capture screenshots** of:
   - Ingredients Management page
   - COGS Calculator page
   - Cleaning Roster page

2. **Save files** to `public/images/` with the exact names:
   - `ingredients-management-screenshot.png`
   - `cogs-calculator-screenshot.png`
   - `cleaning-roster-screenshot.png`

3. **Optimize** (optional but recommended):
   - Convert to WebP format for better performance
   - Create AVIF versions for modern browsers
   - Compress PNG files to reduce size

4. **Test** the landing page to ensure all images load correctly

## Component References Updated

All component references have been updated to use the new screenshot names:

- ✅ `app/components/landing/CloserLook.tsx`
- ✅ `app/components/landing/Highlights.tsx`
- ✅ `app/components/landing/ProductFeatures.tsx`
- ✅ `components/variants/HeroImageGallery.tsx`

Once you add the new screenshot files, the landing page will automatically use them!
