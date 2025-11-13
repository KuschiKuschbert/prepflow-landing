# How to Capture and Add Your Screenshots

## Quick Guide

Based on your images, you need to capture 3 screenshots from your PrepFlow webapp:

### 1. Ingredients Management Screenshot

**What to capture:**

- Go to `/webapp/ingredients` in your browser
- Take a full-page screenshot showing:
  - Title "Ingredients Management"
  - Action buttons (Add Ingredient, Import CSV, Export CSV)
  - Search bar and filters
  - Ingredients table with data
- Save as: `ingredients-management-screenshot.png`

### 2. COGS Calculator Screenshot

**What to capture:**

- Go to `/webapp/cogs` in your browser
- Take a full-page screenshot showing:
  - "Create Dish" section on the left
  - "Cost Analysis" section on the right
  - Dish name input, recipe selector, portions
  - Add Ingredients section
- Save as: `cogs-calculator-screenshot.png`

### 3. Cleaning Roster Screenshot

**What to capture:**

- Go to `/webapp/cleaning` in your browser
- Take a full-page screenshot showing:
  - Title "Cleaning Roster"
  - Tabs (Cleaning Areas, Cleaning Tasks)
  - "Manage Cleaning Areas" heading
  - Cleaning area cards (Bar counter, Bathrooms, Walk-in cooler)
- Save as: `cleaning-roster-screenshot.png`

## How to Take Screenshots

### On macOS:

1. **Full page screenshot:** Cmd + Shift + 4, then press Spacebar, click the browser window
2. **Or use browser extension:** Use a full-page screenshot extension
3. **Or use developer tools:**
   - Open DevTools (F12)
   - Cmd + Shift + P
   - Type "Capture full size screenshot"
   - Save the screenshot

### Recommended: Browser Extension

Install a full-page screenshot extension like:

- **Full Page Screen Capture** (Chrome/Edge)
- **FireShot** (Chrome/Firefox)
- **Awesome Screenshot** (Chrome/Firefox)

## Where to Save

Save all screenshots to:

```
/Users/danielkuschmierz/prepflow-landing/public/images/
```

With these exact names:

- `ingredients-management-screenshot.png`
- `cogs-calculator-screenshot.png`
- `cleaning-roster-screenshot.png`

## After Adding Screenshots

Once you've added the files, verify they're there:

```bash
ls -lh public/images/*-screenshot.png
```

You should see all 5 files:

- ✅ dashboard-screenshot.png
- ✅ settings-screenshot.png
- ✅ ingredients-management-screenshot.png (new)
- ✅ cogs-calculator-screenshot.png (new)
- ✅ cleaning-roster-screenshot.png (new)

Then restart your server and check the landing page!


