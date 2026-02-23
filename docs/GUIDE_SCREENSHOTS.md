# Guide Screenshots Checklist

Checklist of screenshots required for the PrepFlow Guides page (`/webapp/guide`). Used by `scripts/capture-guide-screenshots.js` and for manual capture when specific views are needed.

## Prerequisites

1. **Dev server**: Must be running (`npm run dev`)
2. **Auth**: First run use `--headed` to log in; session persisted in `.screenshot-session/` for subsequent runs
3. **Populated data** (optional but recommended): `POST /api/populate-clean-test-data` with `X-Admin-Key: $SEED_ADMIN_KEY` so pages show content instead of empty states

## Quick Capture

Run the automated script:

```bash
npm run capture:guide-screenshots -- --headed   # First run: log in
npm run capture:guide-screenshots              # Subsequent runs
npm run capture:guide-screenshots -- --interactive  # Pause before each multi-view capture
```

Capture uses DOM-driven clip on the `main` content area (no full-page); output is already content-focused.

## Multi-View Capture (Modals, Sub-Elements, Tabs)

For guide steps that show modals, sub-menus, or specific tabs, the script runs **CAPTURE_STEPS** after the basic route captures. Each step:

1. Navigates to the route
2. Runs **actions** (click recipe, switch tab, add to dish, etc.)
3. Captures the **clipTarget** element instead of `main`

**Element types**: modals (`[role="dialog"]`), sub-elements (`[data-guide-capture="..."]`), tabs.

**Use `--interactive`** when automation is flaky: the script pauses before each multi-view capture. Open the correct modal/tab manually, then press Enter in the terminal.

**Stable selectors**: Components use `data-guide-capture` and `data-guide-tab` attributes for reliable targeting:

- `UnifiedRecipeModal`: `data-guide-capture="recipe-modal"`
- Tab buttons: `data-guide-tab="preview"`, `data-guide-tab="ingredients"`, `data-guide-tab="cogs"`
- `CostAnalysisSection`: `data-guide-capture="cost-analysis"`
- `DishIngredientTable`: `data-guide-capture="dish-ingredient-table"`
- `PricingTool`: `data-guide-capture="pricing-tool"`

## Current State: Text Guides

Guides currently use **text format** (word descriptions). Screenshot capture, crop scripts, and `ScreenshotGuide` component remain available for when screenshot guides are reintroduced.

---

## Cropping Guide Screenshots (Margin-Based) — For Later Use

The crop script trims header and footer chrome using fixed pixel margins. **Annotation-driven cropping is disabled** because it invalidates annotation coordinates (annotations use % of image; after aggressive crop the same % points to wrong content).

```bash
npm run crop:guide-screenshots
```

**How it works:**

- Margin-based cropping: `marginTop`, `marginBottom`, `marginLeft`, `marginRight` in `scripts/guide-crop-config.js`.
- Default: 48px from bottom. Per-image overrides for specific screens.
- Processes `public/images/guides/*.png` and parent images (`temperature-monitoring-screenshot.png`, `cleaning-roster-screenshot.png`, `functions-events-screenshot.png`).

Idempotent — safe to re-run.

## Route-to-File Mapping

| Route                               | Filename                                   | Status                     |
| ----------------------------------- | ------------------------------------------ | -------------------------- |
| `/webapp`                           | `guides/dashboard-overview.png`            | Exists                     |
| `/webapp/ingredients`               | `guides/ingredients-page.png`              | Exists                     |
| `/webapp/cogs`                      | `guides/cogs-calculator.png`               | Exists                     |
| `/webapp/cogs` (breakdown tab)      | `guides/cogs-breakdown.png`                | Exists                     |
| `/webapp/cogs` (pricing view)       | `guides/pricing-tool.png`                  | Exists                     |
| `/webapp/recipes`                   | `guides/recipe-builder.png`                | Exists                     |
| `/webapp/recipes` (form view)       | `guides/recipe-form.png`                   | Exists                     |
| `/webapp/recipes` (add ingredients) | `guides/add-ingredients.png`               | Exists                     |
| `/webapp/recipes` (cost view)       | `guides/recipe-cost.png`                   | Exists                     |
| `/webapp/performance`               | `guides/performance-analysis.png`          | Exists                     |
| `/webapp/temperature`               | `guides/temperature-equipment.png`         | Captured by script         |
| `/webapp/temperature` (logs tab)    | `guides/temperature-logs.png`              | Optional (reuse equipment) |
| `/webapp/compliance`                | `guides/compliance-records.png`            | Captured by script         |
| `/webapp/suppliers`                 | `guides/suppliers.png`                     | Captured by script         |
| `/webapp/menu-builder`              | `guides/menu-builder.png`                  | Captured by script         |
| `/webapp/prep-lists`                | `guides/prep-lists.png`                    | Captured by script         |
| `/webapp/order-lists`               | `guides/order-lists.png`                   | Captured by script         |
| `/webapp/par-levels`                | `guides/par-levels.png`                    | Captured by script         |
| `/webapp/dish-builder`              | `guides/dish-builder.png`                  | Exists                     |
| `/webapp/sections`                  | `guides/dish-sections.png`                 | In capture script          |
| `/webapp/specials`                  | `guides/specials.png`                      | In capture script          |
| `/webapp/recipe-sharing`            | `guides/recipe-sharing.png`                | In capture script          |
| `/webapp/setup`                     | `guides/setup.png`                         | In capture script          |
| `/webapp/settings`                  | `guides/settings.png`                      | In capture script          |
| `/webapp/cleaning`                  | `cleaning-roster-screenshot.png` (parent)  | Captured by script         |
| `/webapp/functions`                 | `functions-events-screenshot.png` (parent) | Captured by script         |
| `/webapp/customers`                 | `guides/customers.png`                     | Captured by script         |

## Guides Using Parent Images

These guides use screenshots from `public/images/` (not `guides/`). The capture script writes to these paths:

- **Temperature Monitoring**: `/images/temperature-monitoring-screenshot.png`
- **Cleaning Roster**: `/images/cleaning-roster-screenshot.png`
- **Functions & Events**: `/images/functions-events-screenshot.png`

## Manual Capture Notes

For guides that need multiple views of the same page:

1. **COGS (understand-cogs)**:
   - `cogs-breakdown.png`: COGS tab or breakdown view
   - `pricing-tool.png`: Pricing/selling price view

2. **Recipes (create-recipe)**:
   - `recipe-form.png`: Recipe edit form (name, description, instructions)
   - `add-ingredients.png`: Add ingredients modal or section
   - `recipe-cost.png`: Cost calculation view

3. **Temperature**:
   - `temperature-equipment.png`: Equipment list
   - `temperature-logs.png`: Logs tab (optional; can reuse equipment screenshot)

Navigate to the specific view, then capture manually or extend the script with additional routes/subpaths.

## CAPTURE_STEPS (Multi-View)

| Filename            | Route                  | Actions                             | clipTarget                            |
| ------------------- | ---------------------- | ----------------------------------- | ------------------------------------- |
| recipe-form.png     | /webapp/recipes#dishes | Click first recipe row              | recipe-modal (dialog)                 |
| add-ingredients.png | /webapp/recipes#dishes | Click recipe, click Ingredients tab | recipe-modal                          |
| recipe-cost.png     | /webapp/recipes#dishes | Click recipe, click COGS tab        | recipe-modal                          |
| cogs-breakdown.png  | /webapp/dish-builder   | Tap recipe, confirm quantity, wait  | cost-analysis / dish-ingredient-table |
| pricing-tool.png    | /webapp/dish-builder   | Tap recipe, confirm, wait           | pricing-tool / cost-analysis          |

**Dish-builder note**: Cost analysis and pricing tool only appear after adding at least one recipe/ingredient to the dish. Populate test data first.

## Troubleshooting

- **Not authenticated**: Run with `--headed` to open a browser and log in. Session is persisted for subsequent headless runs.
- **Connection refused / ECONNREFUSED**: Dev server must be running (`npm run dev`) on the default port.
- **Empty or placeholder pages**: Run `POST /api/populate-clean-test-data` with `X-Admin-Key` header to populate test data before capturing.
- **Performance page timeout**: The performance route uses 60s timeout and `domcontentloaded` (not `networkidle0`) to avoid waiting for heavy charts. If it still times out, try capturing with populated data or increase the timeout in the script.
