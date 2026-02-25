/**
 * Day profiles define which actions run each day for each persona.
 * Different restaurant types have different daily patterns.
 */
import type { PersonaConfig } from './config';
import type { Action } from './day-profiles-data';
import {
  CAFE_DAY_PROFILE,
  RESTAURANT_DAY_PROFILE,
  FOOD_TRUCK_DAY_PROFILE,
} from './day-profiles-data';

export type { Action } from './day-profiles-data';
export { CAFE_DAY_PROFILE, RESTAURANT_DAY_PROFILE, FOOD_TRUCK_DAY_PROFILE };

/**
 * Returns actions for a given day. When fullScope is true, runs every action
 * (no stochastic filtering) for comprehensive real-world testing.
 */
export function getActionsForDay(
  dayIndex: number,
  persona: PersonaConfig,
  fullScope = false,
): Action[] {
  const profile = persona.dayProfile;
  if (!profile.length) return [];
  const dayActions = profile[dayIndex % profile.length];
  if (fullScope) {
    return dayActions.filter(action => {
      const domain = actionToDomain(action);
      const weight = persona.featureWeights[domain as keyof typeof persona.featureWeights] ?? 0;
      return weight > 0;
    });
  }
  return dayActions.filter(action => {
    const domain = actionToDomain(action);
    const weight = persona.featureWeights[domain as keyof typeof persona.featureWeights] ?? 0;
    return weight > 0 && Math.random() < weight * (persona.intensity ?? 1);
  });
}

export function actionToDomain(action: Action): string {
  const map: Record<Action, string> = {
    createIngredient: 'ingredients',
    createRecipe: 'recipes',
    addIngredientToRecipe: 'cogs',
    assignDishToMenu: 'menu',
    createTemperatureLog: 'temperature',
    createEquipmentMaintenance: 'temperature',
    createMenu: 'menu',
    viewPerformance: 'performance',
    viewParLevels: 'par-levels',
    createOrderList: 'order-lists',
    createPrepList: 'prep-lists',
    viewCompliance: 'compliance',
    viewSuppliers: 'suppliers',
    viewCleaning: 'cleaning',
    viewCOGS: 'cogs',
    viewFunctions: 'functions',
    viewDashboard: 'dashboard',
    createFunction: 'functions',
    createSupplier: 'suppliers',
    createParLevel: 'par-levels',
    createTemperatureEquipment: 'temperature',
    openImportIngredients: 'ingredients',
    createCleaningTask: 'cleaning',
    createComplianceRecord: 'compliance',
    createDish: 'recipes',
    viewAISpecials: 'specials',
    viewRecipeSharing: 'recipes',
    viewRoster: 'roster',
    viewSections: 'sections',
    viewCalendar: 'dashboard',
    viewStaff: 'staff',
    viewCustomers: 'customers',
    markCleaningComplete: 'cleaning',
    shareRecipe: 'recipes',
    printMenu: 'menu',
    viewGuide: 'guide',
    viewSetup: 'setup',
    viewSettings: 'settings',
    viewSettingsBilling: 'settings',
    viewSettingsBackup: 'settings',
    viewSquare: 'square',
    viewTimeAttendance: 'time-attendance',
    viewEquipmentDetail: 'equipment',
    viewFunctionDetail: 'functions',
    createStaffMember: 'staff',
    updateIngredientStock: 'ingredients',
    createDetailedRecipe: 'recipes',
    createDishWithAllergens: 'recipes',
    createDetailedFunction: 'functions',
    testFormValidation: 'dashboard',
    interactCleaningRoster: 'cleaning',
    navigateAllModules: 'dashboard',
    viewIngredientDetail: 'ingredients',
    editIngredient: 'ingredients',
    viewCustomerDetail: 'customers',
    viewPerformanceCharts: 'performance',
    switchTabs: 'dashboard',
    testSearchAndFilters: 'ingredients',
    createCustomer: 'customers',
    createRosterShift: 'roster',
    clockInOut: 'time-attendance',
    bulkOperations: 'ingredients',
    testImportExport: 'dashboard',
    interactSettings: 'settings',
    testSortAndViewToggles: 'ingredients',
    testAIFeatures: 'specials',
    testQRCode: 'equipment',
    testInlineEditing: 'par-levels',
  };
  return map[action] || 'ingredients';
}
