# Capture Screenshots Now - Quick Guide

## Your Webapp is Running!

Your server is running at: **http://localhost:3000**

## Steps to Capture Screenshots

### 1. Ingredients Management Screenshot

1. Open: http://localhost:3000/webapp/ingredients (while logged in)
2. Take a full-page screenshot
3. Save as: `ingredients-management-screenshot.png`
4. Save to: `public/images/` folder in your project

### 2. COGS Calculator Screenshot

1. Open: http://localhost:3000/webapp/cogs (while logged in)
2. Take a full-page screenshot
3. Save as: `cogs-calculator-screenshot.png`
4. Save to: `public/images/` folder in your project

### 3. Cleaning Roster Screenshot

1. Open: http://localhost:3000/webapp/cleaning (while logged in)
2. Take a full-page screenshot
3. Save as: `cleaning-roster-screenshot.png`
4. Save to: `public/images/` folder in your project

## How to Take Full-Page Screenshots

### On macOS (Recommended):

1. Open the page in Chrome/Safari
2. Press **Cmd + Option + I** to open DevTools
3. Press **Cmd + Shift + P** to open command palette
4. Type: **"Capture full size screenshot"**
5. Screenshot will download automatically
6. Rename and move to `public/images/` folder

### Or Use Browser Extension:

- Install "Full Page Screen Capture" extension
- Click extension icon
- Screenshot downloads automatically
- Rename and move to `public/images/` folder

## Quick Copy Command

Once you have the files, you can copy them like this:

```bash
# If files are in Downloads
cp ~/Downloads/ingredients-management-screenshot.png public/images/
cp ~/Downloads/cogs-calculator-screenshot.png public/images/
cp ~/Downloads/cleaning-roster-screenshot.png public/images/
```

## After Adding Files

Run this to verify:

```bash
ls -lh public/images/*-screenshot.png
```

You should see all 5 files:

- dashboard-screenshot.png ✅
- settings-screenshot.png ✅
- ingredients-management-screenshot.png (new)
- cogs-calculator-screenshot.png (new)
- cleaning-roster-screenshot.png (new)

Then restart your server and check the landing page!


