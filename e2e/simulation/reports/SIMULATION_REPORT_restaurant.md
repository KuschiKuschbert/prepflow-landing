# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 1 (Auth0/SSO/image noise excluded)
- Bottlenecks: 68
- Faulty Paths: 0

---

## Errors by Persona

### restaurant

- **network** @ http://localhost:3000/api/features/square_pos_integration
  HTTP 500 Internal Server Error

---

## Bottlenecks

- **cafe** / **viewAISpecials**: 6829ms (threshold 5000ms) @ http://localhost:3000/webapp/specials
- **cafe** / **viewGuide**: 13001ms (threshold 5000ms) @ http://localhost:3000/webapp/guide
- **cafe** / **switchTabs**: 76510ms (threshold 5000ms) @ http://localhost:3000/webapp/settings
- **cafe** / **viewParLevels**: 11010ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **cafe** / **viewCleaning**: 8009ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **cafe** / **viewSetup**: 45015ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **cafe** / **interactCleaningRoster**: 6215ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **cafe** / **testSearchAndFilters**: 58988ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **cafe** / **createPrepList**: 32858ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **createRecipe**: 14569ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **cafe** / **createParLevel**: 17923ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **cafe** / **testSortAndViewToggles**: 50838ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createTemperatureLog**: 17844ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewCompliance**: 13525ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **cafe** / **bulkOperations**: 19086ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **cafe** / **createPrepList**: 26097ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **createTemperatureLog**: 23135ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createOrderList**: 7561ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **cafe** / **testImportExport**: 118850ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **cafe** / **testQRCode**: 11460ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **staffOnboarding**: 22870ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **cafe** / **createTemperatureLog**: 6201ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createPrepList**: 39673ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **viewPerformance**: 7177ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **cafe** / **viewRoster**: 37848ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **cafe** / **clockInOut**: 9465ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **cafe** / **testInlineEditing**: 27037ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **cafe** / **viewDashboard**: 21130ms (threshold 5000ms) @ http://localhost:3000/webapp
- **cafe** / **viewSections**: 13368ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **cafe** / **viewSettings**: 17631ms (threshold 5000ms) @ http://localhost:3000/webapp/settings
- **cafe** / **testFormValidation**: 35579ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **interactSettings**: 66124ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **cafe** / **createCustomer**: 5765ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **cafe** / **createKitchenSection**: 10841ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **food-truck** / **createOrderList**: 11002ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **food-truck** / **createPrepList**: 14916ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **food-truck** / **viewDashboard**: 156051ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **switchTabs**: 117847ms (threshold 5000ms) @ chrome-error://chromewebdata/
- **restaurant** / **createRecipe**: 7431ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **addIngredientToRecipe**: 14279ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **assignDishToMenu**: 9994ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **testSearchAndFilters**: 34695ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **restaurant** / **testPagination**: 14265ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **createIngredient**: 34268ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **createDishWithAllergens**: 6600ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **switchTabs**: 47692ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#profile
- **restaurant** / **createKitchenSection**: 8328ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **restaurant** / **createRecipe**: 7384ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **createTemperatureLog**: 17744ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **testAIFeatures**: 17779ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **assignDishToMenu**: 9590ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **createEquipmentMaintenance**: 9116ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewSuppliers**: 7970ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **viewTimeAttendance**: 12381ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **restaurant** / **createStaffMember**: 6510ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **createCustomer**: 9529ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **restaurant** / **viewPerformance**: 10257ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createPrepList**: 5717ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **viewDashboard**: 9282ms (threshold 5000ms) @ http://localhost:3000/webapp
- **restaurant** / **printMenu**: 6899ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **testImportExport**: 58108ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **createMenu**: 13028ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#menu-builder
- **restaurant** / **createParLevel**: 6770ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **restaurant** / **testSortAndViewToggles**: 5224ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewFunctions**: 5888ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewStaff**: 8292ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **navigateAllModules**: 173763ms (threshold 5000ms) @ http://localhost:3000/webapp/square#overview
- **restaurant** / **interactSettings**: 154149ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/backup

---

## Faulty Paths
