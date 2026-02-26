/**
 * Day profile action arrays and Action type. Extracted for filesize limit.
 */
export type Action =
  | 'createIngredient'
  | 'createRecipe'
  | 'addIngredientToRecipe'
  | 'assignDishToMenu'
  | 'createTemperatureLog'
  | 'createEquipmentMaintenance'
  | 'createMenu'
  | 'viewPerformance'
  | 'viewParLevels'
  | 'createOrderList'
  | 'createPrepList'
  | 'viewCompliance'
  | 'viewSuppliers'
  | 'viewCleaning'
  | 'viewCOGS'
  | 'viewFunctions'
  | 'viewDashboard'
  | 'createFunction'
  | 'createSupplier'
  | 'createParLevel'
  | 'createTemperatureEquipment'
  | 'openImportIngredients'
  | 'createCleaningTask'
  | 'createComplianceRecord'
  | 'createDish'
  | 'viewAISpecials'
  | 'viewRecipeSharing'
  | 'viewRoster'
  | 'viewSections'
  | 'viewCalendar'
  | 'viewStaff'
  | 'viewCustomers'
  | 'markCleaningComplete'
  | 'shareRecipe'
  | 'printMenu'
  | 'viewGuide'
  | 'viewSetup'
  | 'viewSettings'
  | 'viewSettingsBilling'
  | 'viewSettingsBackup'
  | 'viewSquare'
  | 'viewTimeAttendance'
  | 'viewEquipmentDetail'
  | 'viewFunctionDetail'
  | 'createStaffMember'
  | 'updateIngredientStock'
  | 'createDetailedRecipe'
  | 'createDishWithAllergens'
  | 'createDetailedFunction'
  | 'testFormValidation'
  | 'interactCleaningRoster'
  | 'navigateAllModules'
  | 'viewIngredientDetail'
  | 'editIngredient'
  | 'viewCustomerDetail'
  | 'viewPerformanceCharts'
  | 'switchTabs'
  | 'testSearchAndFilters'
  | 'createCustomer'
  | 'createRosterShift'
  | 'clockInOut'
  | 'bulkOperations'
  | 'testImportExport'
  | 'interactSettings'
  | 'testSortAndViewToggles'
  | 'testAIFeatures'
  | 'testQRCode'
  | 'testInlineEditing'
  | 'staffOnboarding'
  | 'testDeleteFlow'
  | 'testPagination'
  | 'editCustomer'
  | 'createKitchenSection'
  | 'interactSquare';

/** Cafe: morning-heavy, temperature and prep lists */
export const CAFE_DAY_PROFILE: Action[][] = [
  [
    'createTemperatureLog',
    'createPrepList',
    'createIngredient',
    'viewDashboard',
    'viewAISpecials',
    'viewGuide',
    'switchTabs',
  ],
  [
    'createTemperatureLog',
    'viewParLevels',
    'createOrderList',
    'viewCleaning',
    'createCleaningTask',
    'viewSetup',
    'interactCleaningRoster',
    'testSearchAndFilters',
  ],
  [
    'createPrepList',
    'createTemperatureLog',
    'createRecipe',
    'createParLevel',
    'updateIngredientStock',
    'testSortAndViewToggles',
  ],
  [
    'createTemperatureLog',
    'viewCleaning',
    'viewCompliance',
    'viewSuppliers',
    'markCleaningComplete',
    'interactCleaningRoster',
    'bulkOperations',
  ],
  [
    'createPrepList',
    'createTemperatureLog',
    'createOrderList',
    'createTemperatureEquipment',
    'testImportExport',
    'testQRCode',
    'staffOnboarding',
  ],
  [
    'createTemperatureLog',
    'createPrepList',
    'viewPerformance',
    'viewRoster',
    'createStaffMember',
    'clockInOut',
    'testInlineEditing',
  ],
  [
    'viewParLevels',
    'viewSuppliers',
    'viewDashboard',
    'openImportIngredients',
    'viewSections',
    'viewSettings',
    'testFormValidation',
    'interactSettings',
    'createCustomer',
    'editCustomer',
    'createKitchenSection',
  ],
];

/** Restaurant: recipes, menus, COGS, performance */
export const RESTAURANT_DAY_PROFILE: Action[][] = [
  [
    'createRecipe',
    'addIngredientToRecipe',
    'assignDishToMenu',
    'viewCOGS',
    'createDish',
    'createDetailedRecipe',
    'testSearchAndFilters',
    'testPagination',
  ],
  [
    'viewPerformance',
    'createMenu',
    'createIngredient',
    'createFunction',
    'viewRecipeSharing',
    'viewSquare',
    'interactSquare',
    'createDishWithAllergens',
    'switchTabs',
    'createKitchenSection',
  ],
  [
    'createRecipe',
    'createTemperatureLog',
    'viewCompliance',
    'viewFunctions',
    'viewRoster',
    'createDetailedFunction',
    'createRosterShift',
    'testAIFeatures',
  ],
  [
    'assignDishToMenu',
    'createEquipmentMaintenance',
    'viewSuppliers',
    'createSupplier',
    'viewTimeAttendance',
    'createStaffMember',
    'createCustomer',
    'clockInOut',
    'staffOnboarding',
    'editCustomer',
  ],
  [
    'createRecipe',
    'viewPerformance',
    'createPrepList',
    'viewDashboard',
    'printMenu',
    'viewPerformanceCharts',
    'testImportExport',
    'bulkOperations',
    'testDeleteFlow',
  ],
  [
    'createMenu',
    'createRecipe',
    'createTemperatureLog',
    'createParLevel',
    'viewAISpecials',
    'viewIngredientDetail',
    'testSortAndViewToggles',
    'testQRCode',
    'testInlineEditing',
  ],
  [
    'viewPerformance',
    'viewCompliance',
    'viewFunctions',
    'createTemperatureEquipment',
    'viewStaff',
    'viewEquipmentDetail',
    'viewFunctionDetail',
    'navigateAllModules',
    'interactSettings',
  ],
];

/** Food truck: par levels, order lists, quick turnover */
export const FOOD_TRUCK_DAY_PROFILE: Action[][] = [
  [
    'viewParLevels',
    'createOrderList',
    'createPrepList',
    'createParLevel',
    'viewDashboard',
    'switchTabs',
  ],
  [
    'createIngredient',
    'viewSuppliers',
    'createTemperatureLog',
    'createSupplier',
    'viewSections',
    'updateIngredientStock',
    'testSearchAndFilters',
    'createKitchenSection',
  ],
  [
    'createOrderList',
    'createPrepList',
    'viewParLevels',
    'createTemperatureEquipment',
    'viewSettingsBilling',
    'testImportExport',
    'testInlineEditing',
  ],
  [
    'createTemperatureLog',
    'createIngredient',
    'viewCompliance',
    'openImportIngredients',
    'createComplianceRecord',
    'testFormValidation',
    'bulkOperations',
    'testDeleteFlow',
  ],
  [
    'createPrepList',
    'createOrderList',
    'createRecipe',
    'viewPerformance',
    'viewSettingsBackup',
    'testSortAndViewToggles',
    'createCustomer',
    'testPagination',
  ],
  [
    'viewParLevels',
    'createTemperatureLog',
    'viewSuppliers',
    'viewCleaning',
    'markCleaningComplete',
    'interactCleaningRoster',
    'clockInOut',
    'testQRCode',
  ],
  [
    'createOrderList',
    'createPrepList',
    'viewFunctions',
    'viewCustomers',
    'viewCalendar',
    'navigateAllModules',
    'interactSettings',
    'testAIFeatures',
    'staffOnboarding',
    'editCustomer',
  ],
];
