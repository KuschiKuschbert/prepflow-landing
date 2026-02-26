# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 0 (Auth0/SSO/image noise excluded)
- Bottlenecks: 34
- Faulty Paths: 17


---

## Errors by Persona

---

## Bottlenecks

- **restaurant** / **addIngredientToRecipe**: 40343ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **assignDishToMenu**: 23451ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#menu-builder
- **restaurant** / **viewCOGS**: 7166ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **createDetailedRecipe**: 41846ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **testSearchAndFilters**: 108137ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **restaurant** / **testPagination**: 70556ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewPerformance**: 14079ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createMenu**: 8160ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **createIngredient**: 36979ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **createFunction**: 7258ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewRecipeSharing**: 84330ms (threshold 5000ms) @ http://localhost:3000/webapp/recipe-sharing
- **restaurant** / **viewSquare**: 40644ms (threshold 5000ms) @ http://localhost:3000/webapp/square
- **restaurant** / **createDishWithAllergens**: 18543ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **switchTabs**: 277108ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **restaurant** / **createKitchenSection**: 30031ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **restaurant** / **createTemperatureLog**: 8115ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewCompliance**: 34178ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewFunctions**: 17944ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewRoster**: 33727ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **restaurant** / **createDetailedFunction**: 53851ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **createRosterShift**: 18526ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **restaurant** / **testAIFeatures**: 79548ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **assignDishToMenu**: 85824ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#menu-builder
- **restaurant** / **createEquipmentMaintenance**: 37818ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewSuppliers**: 59801ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **createSupplier**: 27351ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **createStaffMember**: 35834ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **createCustomer**: 30008ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **staffOnboarding**: 30045ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **restaurant** / **viewPerformance**: 30182ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createPrepList**: 31407ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **printMenu**: 18247ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **testImportExport**: 706174ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **testDeleteFlow**: 10618ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients

---

## Faulty Paths

- **restaurant** / **viewTimeAttendance** @ http://localhost:3000/webapp/suppliers
  Error: [viewTimeAttendance] page.goto: Timeout 120000ms exceeded.
Call log:
[2m  - navigating to "http://localhost:3000/webapp/time-attendance", waiting until "domcontentloaded"[22m

- **restaurant** / **viewPerformanceCharts** @ http://localhost:3000/webapp/menu-builder
  Error: [viewPerformanceCharts] page.goto: Timeout 120000ms exceeded.
Call log:
[2m  - navigating to "http://localhost:3000/webapp/performance", waiting until "domcontentloaded"[22m

- **restaurant** / **bulkOperations** @ http://localhost:3000/webapp/recipes#dishes
  Error: [bulkOperations] page.goto: Timeout 120000ms exceeded.
Call log:
[2m  - navigating to "http://localhost:3000/webapp/ingredients", waiting until "domcontentloaded"[22m

- **restaurant** / **createRecipe** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [createRecipe] page.goto: Target page, context or browser has been closed
- **restaurant** / **createParLevel** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [createParLevel] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewAISpecials** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewAISpecials] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewIngredientDetail** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewIngredientDetail] page.goto: Target page, context or browser has been closed
- **restaurant** / **testSortAndViewToggles** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [testSortAndViewToggles] page.goto: Target page, context or browser has been closed
- **restaurant** / **testQRCode** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [testQRCode] page.goto: Target page, context or browser has been closed
- **restaurant** / **testInlineEditing** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [testInlineEditing] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewPerformance** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewPerformance] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewCompliance** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewCompliance] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewFunctions** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewFunctions] page.goto: Target page, context or browser has been closed
- **restaurant** / **createTemperatureEquipment** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [createTemperatureEquipment] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewStaff** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewStaff] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewEquipmentDetail** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewEquipmentDetail] page.goto: Target page, context or browser has been closed
- **restaurant** / **viewFunctionDetail** @ http://localhost:3000/webapp/recipes#ingredients
  Error: [viewFunctionDetail] page.goto: Target page, context or browser has been closed