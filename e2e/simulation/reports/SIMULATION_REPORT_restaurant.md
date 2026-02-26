# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 0 (Auth0/SSO/image noise excluded)
- Bottlenecks: 91
- Faulty Paths: 0

---

## Errors by Persona

---

## Bottlenecks

- **cafe** / **viewDashboard**: 10581ms (threshold 5000ms) @ http://localhost:3000/webapp
- **cafe** / **viewGuide**: 10367ms (threshold 5000ms) @ http://localhost:3000/webapp/guide
- **cafe** / **switchTabs**: 69440ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **cafe** / **createTemperatureLog**: 19726ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewParLevels**: 7904ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **cafe** / **createOrderList**: 5918ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **cafe** / **viewCleaning**: 8323ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **cafe** / **viewSetup**: 25591ms (threshold 5000ms) @ http://localhost:3000/webapp/setup
- **cafe** / **testSearchAndFilters**: 70069ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **cafe** / **createPrepList**: 9215ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **createRecipe**: 8718ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **cafe** / **createParLevel**: 42163ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **cafe** / **updateIngredientStock**: 10054ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **cafe** / **testSortAndViewToggles**: 47869ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createTemperatureLog**: 17834ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewCleaning**: 9331ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **cafe** / **viewCompliance**: 9062ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **cafe** / **bulkOperations**: 34698ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **cafe** / **createTemperatureLog**: 17883ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createOrderList**: 9942ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **cafe** / **createTemperatureEquipment**: 9512ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **testImportExport**: 173793ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **cafe** / **staffOnboarding**: 19581ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **cafe** / **createTemperatureLog**: 22454ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createPrepList**: 15929ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **viewPerformance**: 5918ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **cafe** / **viewRoster**: 10188ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **cafe** / **clockInOut**: 8376ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **cafe** / **testInlineEditing**: 9818ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **cafe** / **viewDashboard**: 32577ms (threshold 5000ms) @ http://localhost:3000/webapp
- **cafe** / **viewSections**: 14399ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **cafe** / **viewSettings**: 12953ms (threshold 5000ms) @ http://localhost:3000/webapp/settings
- **cafe** / **testFormValidation**: 46208ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **interactSettings**: 41116ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **cafe** / **createCustomer**: 10643ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **food-truck** / **viewParLevels**: 7080ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **viewDashboard**: 12385ms (threshold 5000ms) @ http://localhost:3000/webapp
- **food-truck** / **switchTabs**: 75192ms (threshold 5000ms) @ http://localhost:3000/webapp/settings
- **food-truck** / **createIngredient**: 46438ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **food-truck** / **createSupplier**: 8579ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **food-truck** / **viewSections**: 25158ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **food-truck** / **testSearchAndFilters**: 177829ms (threshold 5000ms) @ http://localhost:3000/webapp
- **food-truck** / **createOrderList**: 45273ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **food-truck** / **createPrepList**: 45013ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **food-truck** / **viewParLevels**: 43806ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **createTemperatureEquipment**: 45015ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **viewSettingsBilling**: 33135ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **food-truck** / **testImportExport**: 321068ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **food-truck** / **testInlineEditing**: 47922ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **createTemperatureLog**: 30021ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **food-truck** / **createIngredient**: 13606ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **createRecipe**: 8619ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **addIngredientToRecipe**: 9046ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **testSearchAndFilters**: 20955ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **restaurant** / **testPagination**: 23450ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewPerformance**: 42266ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createIngredient**: 35323ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **viewRecipeSharing**: 7440ms (threshold 5000ms) @ http://localhost:3000/webapp/recipe-sharing
- **restaurant** / **viewSquare**: 5050ms (threshold 5000ms) @ http://localhost:3000/webapp/square
- **restaurant** / **switchTabs**: 53025ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **restaurant** / **createKitchenSection**: 12437ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **restaurant** / **createRecipe**: 6550ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **createTemperatureLog**: 17738ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewFunctions**: 8553ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewRoster**: 8128ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **restaurant** / **testAIFeatures**: 40245ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **assignDishToMenu**: 13572ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#menu-builder
- **restaurant** / **createEquipmentMaintenance**: 25047ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewSuppliers**: 27478ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **createSupplier**: 5178ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **viewTimeAttendance**: 9727ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **restaurant** / **createStaffMember**: 9998ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **createCustomer**: 20215ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **restaurant** / **staffOnboarding**: 8007ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **createRecipe**: 6372ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **viewPerformance**: 44047ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createPrepList**: 12716ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **viewDashboard**: 53396ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **printMenu**: 6773ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **testImportExport**: 245701ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **bulkOperations**: 7747ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **testDeleteFlow**: 10865ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **createMenu**: 11632ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#menu-builder
- **restaurant** / **createTemperatureLog**: 36365ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewAISpecials**: 16102ms (threshold 5000ms) @ http://localhost:3000/webapp/specials
- **restaurant** / **testSortAndViewToggles**: 5929ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **testInlineEditing**: 12598ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **viewCompliance**: 13261ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewFunctions**: 14548ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewStaff**: 9213ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **navigateAllModules**: 115072ms (threshold 5000ms) @ chrome-error://chromewebdata/

---

## Faulty Paths
