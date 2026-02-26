# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 1 (Auth0/SSO/image noise excluded)
- Bottlenecks: 83
- Faulty Paths: 2

---

## Errors by Persona

### restaurant

- **console.error** @ http://localhost:3000/webapp/compliance
  %o

%s {} The above error occurred in the <ComplianceRecordCard> component. It was handled by the <ErrorBoundaryHandler> error boundary.

---

## Bottlenecks

- **cafe** / **createIngredient**: 7304ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes?action=new#ingredients
- **cafe** / **viewDashboard**: 5702ms (threshold 5000ms) @ http://localhost:3000/webapp
- **cafe** / **viewGuide**: 14911ms (threshold 5000ms) @ http://localhost:3000/webapp/guide
- **cafe** / **switchTabs**: 113310ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **cafe** / **createTemperatureLog**: 5228ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewParLevels**: 9472ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **cafe** / **viewSetup**: 11462ms (threshold 5000ms) @ http://localhost:3000/webapp/setup
- **cafe** / **testSearchAndFilters**: 36248ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **cafe** / **createPrepList**: 5396ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **testSortAndViewToggles**: 26003ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createTemperatureLog**: 17726ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewCompliance**: 7216ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **cafe** / **bulkOperations**: 5416ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **cafe** / **createTemperatureLog**: 19542ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **testImportExport**: 30917ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **cafe** / **staffOnboarding**: 6864ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **cafe** / **createTemperatureLog**: 10908ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **clockInOut**: 6978ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **cafe** / **testInlineEditing**: 15398ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **cafe** / **viewSections**: 10548ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **cafe** / **testFormValidation**: 18580ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **interactSettings**: 59691ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **food-truck** / **viewParLevels**: 7511ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **createOrderList**: 6273ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **food-truck** / **createPrepList**: 12137ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **food-truck** / **createParLevel**: 5923ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **viewDashboard**: 69082ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **switchTabs**: 249869ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **food-truck** / **createIngredient**: 39860ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **food-truck** / **createTemperatureLog**: 5508ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **food-truck** / **createSupplier**: 15345ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **food-truck** / **viewSections**: 45007ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **food-truck** / **testSearchAndFilters**: 106617ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **food-truck** / **createKitchenSection**: 30010ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **food-truck** / **createOrderList**: 26788ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **food-truck** / **createPrepList**: 40971ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **food-truck** / **viewParLevels**: 44791ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **viewSettingsBilling**: 45039ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **food-truck** / **testImportExport**: 200593ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **food-truck** / **testInlineEditing**: 80276ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **food-truck** / **createTemperatureLog**: 30015ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **food-truck** / **viewCompliance**: 45009ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **createRecipe**: 6879ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **addIngredientToRecipe**: 9158ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **assignDishToMenu**: 5187ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **testSearchAndFilters**: 19016ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **restaurant** / **testPagination**: 21986ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewPerformance**: 7239ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createIngredient**: 33432ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **viewRecipeSharing**: 6969ms (threshold 5000ms) @ http://localhost:3000/webapp/recipe-sharing
- **restaurant** / **viewSquare**: 7209ms (threshold 5000ms) @ http://localhost:3000/webapp/square
- **restaurant** / **switchTabs**: 86936ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **restaurant** / **createKitchenSection**: 11989ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **restaurant** / **createRecipe**: 6517ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **createTemperatureLog**: 14879ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewCompliance**: 5488ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewFunctions**: 8760ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewRoster**: 18767ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **restaurant** / **testAIFeatures**: 47779ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **viewSuppliers**: 15487ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **viewTimeAttendance**: 23537ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **restaurant** / **createStaffMember**: 14812ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **createCustomer**: 24030ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **restaurant** / **staffOnboarding**: 8893ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **viewPerformance**: 24150ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createPrepList**: 18507ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **viewDashboard**: 33923ms (threshold 5000ms) @ http://localhost:3000/webapp
- **restaurant** / **testImportExport**: 141147ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **testDeleteFlow**: 31492ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **createMenu**: 30025ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **createTemperatureLog**: 30005ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **createParLevel**: 10221ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **restaurant** / **viewAISpecials**: 6847ms (threshold 5000ms) @ http://localhost:3000/webapp/specials
- **restaurant** / **viewIngredientDetail**: 33557ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **restaurant** / **testSortAndViewToggles**: 19613ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **testQRCode**: 23744ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **testInlineEditing**: 23676ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **viewCompliance**: 45004ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **viewFunctions**: 39637ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewStaff**: 24232ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **viewEquipmentDetail**: 7512ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **navigateAllModules**: 381195ms (threshold 5000ms) @ http://localhost:3000/webapp/specials
- **restaurant** / **interactSettings**: 67910ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/backup

---

## Faulty Paths

- **food-truck** / **createTemperatureEquipment** @ http://localhost:3000/webapp/temperature
  Error: [createTemperatureEquipment] locator.click: Timeout 30000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Equipment"), a:has-text("Equipment")').first()[22m
  [2m - locator resolved to <button aria-pressed="false" aria-label="View temperature equipment" class="group tablet:px-6 relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition-all duration-300 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]">…</button>[22m
  [2m - attempting click action[22m
  [2m - waiting for element to be visible, enabled and stable[22m
  [2m - element is not stable[22m
  [2m - retrying click action[22m
  [2m - waiting for element to be visible, enabled and stable[22m
  [2m - element was detached from the DOM, retrying[22m

- **restaurant** / **createTemperatureEquipment** @ http://localhost:3000/webapp/temperature
  Error: [createTemperatureEquipment] locator.click: Timeout 30000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Equipment"), a:has-text("Equipment")').first()[22m
  [2m - locator resolved to <button aria-pressed="false" aria-label="View temperature equipment" class="group tablet:px-6 relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition-all duration-300 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]">…</button>[22m
  [2m - attempting click action[22m
  [2m - waiting for element to be visible, enabled and stable[22m
  [2m - element was detached from the DOM, retrying[22m
