# Pre-Deployment Check Summary

Generated: 12/4/2025, 9:41:31 PM

## Pre-Deployment Check

Status: unknown

## Dead Code Cleanup

- Unused exports removed: 0
- Files affected: 0

## Voice Consistency Audit

### Summary

- Total violations found: 49
- Auto-fixed: 0
- Manual review needed: 49

### By Severity

- warning: 25
- info: 24

### By Type

- generic-message: 19
- missing-contraction: 18
- technical-jargon: 12

### Files with Violations

- app/api/ai-specials/helpers/handleAISpecialsError.ts
- app/api/menus/[id]/helpers/fetchMenuWithItems.ts
- app/api/menus/[id]/ingredients/helpers/fetchIngredientsWithParLevels.ts
- app/api/recipe-share/helpers/fetchRecipeWithIngredients.ts
- app/api/recipe-share/helpers/handleRecipeShareError.ts
- app/api/setup-cleaning-tasks/helpers/validateCleaningTables.ts
- app/components/landing/Resources.tsx
- app/privacy-policy/page.tsx
- app/terms-of-service/page.tsx
- app/webapp/ingredients/components/BulkAllergenDetection.tsx
- app/webapp/order-lists/page.tsx
- app/webapp/recipes/components/BulkDeleteConfirmationModal.tsx
- app/webapp/recipes/components/DeleteConfirmationModal.tsx
- app/webapp/recipes/components/DishEditDrawer.tsx
- app/webapp/roster/components/RosterBuilder.tsx
- app/webapp/settings/components/AdaptiveNavSettingsPanel.tsx
- app/webapp/settings/components/ImportExportHistoryPanel.tsx
- app/webapp/settings/components/PrivacyControlsPanel.tsx
- app/webapp/settings/components/ProfileInformationPanel.tsx
- app/webapp/settings/components/SecurityPanel.tsx

... and 10 more files

## Manual Review Needed

None

## Next Steps

1. Review voice consistency violations
2. Apply manual fixes for complex voice issues
3. Run `npm run cleanup:fix` to auto-fix simple cases
4. Run `npm run check:voice` to verify fixes
