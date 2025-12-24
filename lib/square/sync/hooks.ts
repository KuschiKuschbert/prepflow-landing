/**
 * Square Sync Hooks
 *
 * Utility functions to trigger Square sync operations after PrepFlow entity changes.
 * These hooks are called from API routes after successful create/update operations.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync, API Route Hooks sections) for
 * detailed hook documentation and integration examples.
 */

// Re-export all sync hook functions
export { triggerDishSync } from './hooks/triggerDishSync';
export { triggerEmployeeSync } from './hooks/triggerEmployeeSync';
export { triggerCostSync } from './hooks/triggerCostSync';
export { triggerRecipeSync } from './hooks/triggerRecipeSync';
export { triggerIngredientSync } from './hooks/triggerIngredientSync';
