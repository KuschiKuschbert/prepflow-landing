/**
 * Action handlers - executes simulation actions. Used by action-registry.
 */
import type { Page } from '@playwright/test';
import type { Action } from './day-profiles';
import { createIngredientFlow } from '../../workflows/helpers/createIngredientFlow';
import { createRecipeFlow } from '../../workflows/helpers/createRecipeFlow';
import { addIngredientToRecipeFlow } from '../../workflows/helpers/addIngredientToRecipeFlow';
import { assignDishToMenuFlow } from '../../workflows/helpers/assignDishToMenuFlow';
import { createTemperatureLogFlow } from '../../workflows/helpers/createTemperatureLogFlow';
import { createEquipmentMaintenanceFlow } from '../../workflows/helpers/createEquipmentMaintenanceFlow';
import { chefWorkflowCreateMenu } from '../../system-audit/workflows/createMenu';
import { createFunctionFlow } from '../../workflows/helpers/createFunctionFlow';
import { createSupplierFlow } from '../../workflows/helpers/createSupplierFlow';
import { createParLevelFlow } from '../../workflows/helpers/createParLevelFlow';
import { createTemperatureEquipmentFlow } from '../../workflows/helpers/createTemperatureEquipmentFlow';
import { createPrepListFlow } from '../../workflows/helpers/createPrepListFlow';
import { createOrderListFlow } from '../../workflows/helpers/createOrderListFlow';
import { createCleaningTaskFlow } from '../../workflows/helpers/createCleaningTaskFlow';
import { createComplianceRecordFlow } from '../../workflows/helpers/createComplianceRecordFlow';
import { createDishFlow } from '../../workflows/helpers/createDishFlow';
import { createStaffMemberFlow } from '../../workflows/helpers/createStaffMemberFlow';
import { updateIngredientStockFlow } from '../../workflows/helpers/updateIngredientStockFlow';
import { createDetailedRecipeFlow } from '../../workflows/helpers/createDetailedRecipeFlow';
import { createDishWithAllergensFlow } from '../../workflows/helpers/createDishWithAllergensFlow';
import { createDetailedFunctionFlow } from '../../workflows/helpers/createDetailedFunctionFlow';
import { testFormValidationFlow } from '../../workflows/helpers/testFormValidationFlow';
import { interactCleaningRosterFlow } from '../../workflows/helpers/interactCleaningRosterFlow';
import { navigateAllModulesFlow } from '../../workflows/helpers/navigateAllModulesFlow';
import { switchTabsFlow } from '../../workflows/helpers/switchTabsFlow';
import { testSearchAndFiltersFlow } from '../../workflows/helpers/testSearchAndFiltersFlow';
import { createCustomerFlow } from '../../workflows/helpers/createCustomerFlow';
import { createRosterShiftFlow } from '../../workflows/helpers/createRosterShiftFlow';
import { clockInOutFlow } from '../../workflows/helpers/clockInOutFlow';
import { bulkOperationsFlow } from '../../workflows/helpers/bulkOperationsFlow';
import { testImportExportFlow } from '../../workflows/helpers/testImportExportFlow';
import { interactSettingsFlow } from '../../workflows/helpers/interactSettingsFlow';
import { testSortAndViewTogglesFlow } from '../../workflows/helpers/testSortAndViewTogglesFlow';
import { testAIFeaturesFlow } from '../../workflows/helpers/testAIFeaturesFlow';
import { testQRCodeFlow } from '../../workflows/helpers/testQRCodeFlow';
import { testInlineEditingFlow } from '../../workflows/helpers/testInlineEditingFlow';
import { staffOnboardingFlow } from '../../workflows/helpers/staffOnboardingFlow';
import { testDeleteFlow } from '../../workflows/helpers/testDeleteFlow';
import { testPaginationFlow } from '../../workflows/helpers/testPaginationFlow';
import { editCustomerFlow } from '../../workflows/helpers/editCustomerFlow';
import { createKitchenSectionFlow } from '../../workflows/helpers/createKitchenSectionFlow';
import { interactSquareFlow } from '../../workflows/helpers/interactSquareFlow';
import { viewPage, viewPageSimple } from './action-registry-helpers';
import { logger } from '@/lib/logger';
import type { RunActionContext } from './action-registry-types';
import {
  handleEditIngredient,
  handleMarkCleaningComplete,
  handlePrintMenu,
  handleShareRecipe,
  handleViewCustomerDetail,
  handleViewEquipmentDetail,
  handleViewFunctionDetail,
  handleViewIngredientDetail,
  handleViewPerformanceCharts,
} from './action-handlers/detailHandlers';

export async function executeActionHandler(
  page: Page,
  action: Action,
  prefix: string,
  context: RunActionContext | undefined,
  recipeName: string,
  steps: string[],
): Promise<void> {
  switch (action) {
    case 'createIngredient':
      await createIngredientFlow(page, `${prefix}_Flour`, steps);
      break;
    case 'createRecipe':
      await createRecipeFlow(page, recipeName, steps);
      break;
    case 'addIngredientToRecipe': {
      const rName = context?.recipeNames?.[0] ?? `${prefix}Recipe_0`;
      const iName = context?.ingredientNames?.[0] ?? `${prefix}_Flour`;
      await addIngredientToRecipeFlow(page, rName, iName, steps);
      break;
    }
    case 'assignDishToMenu':
      await assignDishToMenuFlow(page, steps);
      break;
    case 'createTemperatureLog':
      await createTemperatureLogFlow(page, steps);
      break;
    case 'createEquipmentMaintenance':
      await createEquipmentMaintenanceFlow(page, steps);
      break;
    case 'createMenu':
      await chefWorkflowCreateMenu(page, prefix, new Set());
      break;
    case 'viewPerformance':
      await viewPage(page, '/webapp/performance', {
        export: true,
        import: true,
        importLabel: 'Import Sales Data',
      });
      break;
    case 'viewParLevels': {
      try {
        await viewPage(page, '/webapp/par-levels', { print: true, export: true });
      } catch (err) {
        logger.dev('[viewParLevels] Skipped (non-admin or page error):', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }
    case 'createOrderList':
      await createOrderListFlow(page, steps);
      break;
    case 'createPrepList':
      await createPrepListFlow(page, steps);
      break;
    case 'createCleaningTask':
      await createCleaningTaskFlow(page, steps);
      break;
    case 'createComplianceRecord':
      await createComplianceRecordFlow(page, steps);
      break;
    case 'createDish':
      await createDishFlow(page, steps);
      break;
    case 'viewCompliance':
      await viewPage(page, '/webapp/compliance', { print: true, export: true });
      break;
    case 'viewSuppliers':
      await viewPage(page, '/webapp/suppliers', { import: true });
      break;
    case 'viewCleaning':
      await viewPage(page, '/webapp/cleaning', { print: true, export: true });
      break;
    case 'viewCOGS':
      await viewPageSimple(page, '/webapp/cogs');
      break;
    case 'viewFunctions':
      await viewPageSimple(page, '/webapp/functions');
      break;
    case 'viewDashboard':
      await viewPageSimple(page, '/webapp');
      break;
    case 'createFunction':
      await createFunctionFlow(page, prefix, steps);
      break;
    case 'createSupplier':
      await createSupplierFlow(page, prefix, steps);
      break;
    case 'createParLevel':
      await createParLevelFlow(page, prefix, steps);
      break;
    case 'createTemperatureEquipment':
      await createTemperatureEquipmentFlow(page, prefix, steps);
      break;
    case 'openImportIngredients':
      await viewPage(page, '/webapp/ingredients', { import: true });
      break;
    case 'viewAISpecials':
      await viewPageSimple(page, '/webapp/specials');
      break;
    case 'viewRecipeSharing':
      await viewPageSimple(page, '/webapp/recipe-sharing');
      break;
    case 'viewRoster':
      await viewPageSimple(page, '/webapp/roster');
      break;
    case 'viewSections':
      await viewPageSimple(page, '/webapp/sections');
      break;
    case 'viewCalendar':
      await viewPageSimple(page, '/webapp/calendar');
      break;
    case 'viewStaff':
      await viewPageSimple(page, '/webapp/staff');
      break;
    case 'viewCustomers':
      await viewPageSimple(page, '/webapp/customers');
      break;
    case 'markCleaningComplete':
      await handleMarkCleaningComplete(page);
      break;
    case 'shareRecipe':
      await handleShareRecipe(page);
      break;
    case 'printMenu':
      await handlePrintMenu(page);
      break;
    case 'viewGuide':
      await viewPageSimple(page, '/webapp/guide');
      break;
    case 'viewSetup':
      await viewPageSimple(page, '/webapp/setup');
      break;
    case 'viewSettings':
      await viewPageSimple(page, '/webapp/settings');
      break;
    case 'viewSettingsBilling':
      await viewPageSimple(page, '/webapp/settings/billing');
      break;
    case 'viewSettingsBackup':
      await viewPageSimple(page, '/webapp/settings/backup');
      break;
    case 'viewSquare':
      await viewPageSimple(page, '/webapp/square');
      break;
    case 'viewTimeAttendance':
      await viewPageSimple(page, '/webapp/time-attendance');
      break;
    case 'viewEquipmentDetail':
      await handleViewEquipmentDetail(page);
      break;
    case 'viewFunctionDetail':
      await handleViewFunctionDetail(page);
      break;
    case 'createStaffMember':
      await createStaffMemberFlow(page, prefix, steps);
      break;
    case 'updateIngredientStock':
      await updateIngredientStockFlow(page, steps);
      break;
    case 'createDetailedRecipe':
      await createDetailedRecipeFlow(page, prefix, steps);
      break;
    case 'createDishWithAllergens':
      await createDishWithAllergensFlow(page, prefix, steps);
      break;
    case 'createDetailedFunction':
      await createDetailedFunctionFlow(page, prefix, steps);
      break;
    case 'testFormValidation':
      await testFormValidationFlow(page, steps);
      break;
    case 'interactCleaningRoster':
      await interactCleaningRosterFlow(page, steps);
      break;
    case 'navigateAllModules':
      await navigateAllModulesFlow(page, steps);
      break;
    case 'viewIngredientDetail':
      await handleViewIngredientDetail(page);
      break;
    case 'editIngredient':
      await handleEditIngredient(page);
      break;
    case 'viewCustomerDetail':
      await handleViewCustomerDetail(page);
      break;
    case 'viewPerformanceCharts':
      await handleViewPerformanceCharts(page);
      break;
    case 'switchTabs':
      await switchTabsFlow(page, steps);
      break;
    case 'testSearchAndFilters':
      await testSearchAndFiltersFlow(page, steps);
      break;
    case 'createCustomer':
      await createCustomerFlow(page, prefix, steps);
      break;
    case 'createRosterShift':
      await createRosterShiftFlow(page, steps);
      break;
    case 'clockInOut':
      await clockInOutFlow(page, steps);
      break;
    case 'bulkOperations':
      await bulkOperationsFlow(page, steps);
      break;
    case 'testImportExport':
      await testImportExportFlow(page, steps);
      break;
    case 'interactSettings':
      await interactSettingsFlow(page, steps);
      break;
    case 'testSortAndViewToggles':
      await testSortAndViewTogglesFlow(page, steps);
      break;
    case 'testAIFeatures':
      await testAIFeaturesFlow(page, steps);
      break;
    case 'testQRCode':
      await testQRCodeFlow(page, steps);
      break;
    case 'testInlineEditing':
      await testInlineEditingFlow(page, steps);
      break;
    case 'staffOnboarding':
      await staffOnboardingFlow(page, steps);
      break;
    case 'testDeleteFlow':
      await testDeleteFlow(page, steps);
      break;
    case 'testPagination':
      await testPaginationFlow(page, steps);
      break;
    case 'editCustomer':
      await editCustomerFlow(page, steps);
      break;
    case 'createKitchenSection':
      await createKitchenSectionFlow(page, steps);
      break;
    case 'interactSquare':
      await interactSquareFlow(page, steps);
      break;
    default: {
      const _exhaustive: never = action;
      throw new Error(`Unknown action: ${_exhaustive}`);
    }
  }
}
