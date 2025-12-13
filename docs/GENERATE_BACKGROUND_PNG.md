# Generate Background PNG

This guide explains how to recreate the dynamic PrepFlow landing page background and save it as a static PNG image.

## Quick Start

### Option 1: Automated Script (Recommended)

Run the Node.js script that uses Playwright:

```bash
npm run generate:background
```

This will:

1. Generate an HTML version of the background
2. Use Playwright to render it
3. Save as `public/images/background.png` (1920x1080px)

**Requirements:**

- Playwright must be installed: `npx playwright install chromium`
- Or Puppeteer: `npm install puppeteer --save-dev`

### Option 2: Browser-Based Method

1. **Start your dev server:**

   ```bash
   npm run dev
   ```

2. **Open the generator page:**

   ```
   http://localhost:3000/scripts/generate-background-browser.html
   ```

3. **Click "Download Background PNG"** button

4. **Save the file** to `public/images/background.png`

## What Gets Generated

The script recreates all background effects:

- ✅ **Base gradient** - Dark gradient from top to bottom
- ✅ **Spotlight effect** - Radial gradient at center (fixed position)
- ✅ **Logo watermarks** - 3 subtle logo instances (very low opacity)
- ✅ **Tron-like grid** - Cyan and blue grid lines with fade mask
- ✅ **Corner glows** - Cyan glow (top-left) and magenta glow (top-right)
- ✅ **Fine noise texture** - Subtle SVG noise overlay

## Output

- **File:** `public/images/background.png`
- **Size:** 1920x1080px (Full HD)
- **Format:** PNG with transparency support

## Using the Generated Background

Once generated, you can use it as a static background:

### Option 1: Replace Dynamic Background

Update `app/components/landing/LandingBackground.tsx`:

```tsx
<div
  className="fixed inset-0 -z-20"
  style={{
    backgroundImage: 'url(/images/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
/>
```

### Option 2: Use in CSS

```css
.landing-background {
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: center;
}
```

## Troubleshooting

### Playwright Not Found

```bash
npx playwright install chromium
```

### Puppeteer Not Found

```bash
npm install puppeteer --save-dev
```

### Logo Not Showing

The script uses SVG placeholders for logos since they're very subtle (0.02 opacity). If you want actual logos:

1. Ensure `/images/prepflow-logo.png` exists
2. Update the script to use the actual logo path
3. Or manually add logos in image editing software after generation

### Different Size

To generate a different size, edit `scripts/generate-background-png.js`:

```javascript
// Change viewport size
await page.setViewportSize({
  width: 3840, // 4K width
  height: 2160, // 4K height
});
```

## Background Theme Values

The script uses values from `lib/theme.ts`:

- Grid size: 48px
- Grid cyan opacity: 0.08
- Grid blue opacity: 0.06
- Corner cyan opacity: 0.18
- Corner magenta opacity: 0.16

To adjust these, edit `lib/theme.ts` and regenerate the PNG.
