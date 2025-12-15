# Add New PrepFlow Logo

## Quick Instructions

1. **Save your new logo file** as `prepflow-logo.png`
2. **Replace the existing file** at: `public/images/prepflow-logo.png`
3. **Verify the file** is in the correct location

## File Requirements

- **Filename:** `prepflow-logo.png`
- **Location:** `public/images/prepflow-logo.png`
- **Format:** PNG (recommended for transparency support)
- **Recommended size:** At least 512x512px for high-quality display

## After Adding the File

Once you've replaced the file, the new logo will automatically appear in:

- ✅ Landing page header
- ✅ Webapp navigation header
- ✅ All page headers (Recipes, Setup, etc.)
- ✅ Background watermarks
- ✅ PDF exports
- ✅ Menu print templates
- ✅ Structured data (SEO)

## Optional: Generate Optimized Variants

After adding the PNG, you can generate WebP and AVIF variants for better performance:

```bash
node scripts/optimize-images.js
```

This will create:

- `prepflow-logo.webp` (smaller file size)
- `prepflow-logo.avif` (best compression)

## Verification

To verify the logo is working:

1. Start the dev server: `npm run dev`
2. Check the landing page: `http://localhost:3000`
3. Check the webapp: `http://localhost:3000/webapp`
4. Verify logo appears in all locations listed above

## Current Logo References (All Verified ✅)

All components already reference `/images/prepflow-logo.png`:

- `components/BrandMark.tsx`
- `components/ui/LogoWatermark.tsx`
- `components/ui/BackgroundLogo.tsx`
- `app/components/landing/LandingHeader.tsx`
- `app/webapp/components/navigation/NavigationHeader.tsx`
- `app/webapp/components/static/PageHeader.tsx`
- `app/webapp/recipes/components/RecipesHeader.tsx`
- `app/webapp/setup/page.tsx`
- `lib/exports/pdf-template.ts`
- `app/webapp/menu-builder/utils/menuPrintTemplate.ts`

No code changes needed - just replace the image file!

