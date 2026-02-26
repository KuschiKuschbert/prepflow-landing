# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 0 (Auth0/SSO/image noise excluded)
- Bottlenecks: 45
- Faulty Paths: 1


---

## Errors by Persona

---

## Bottlenecks

- **cafe** / **createPrepList**: 6441ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **cafe** / **createIngredient**: 12152ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **cafe** / **viewDashboard**: 19316ms (threshold 5000ms) @ http://localhost:3000/webapp
- **cafe** / **viewGuide**: 20425ms (threshold 5000ms) @ http://localhost:3000/webapp/guide
- **cafe** / **switchTabs**: 53098ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **cafe** / **createTemperatureLog**: 21974ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewSetup**: 10385ms (threshold 5000ms) @ http://localhost:3000/webapp/setup
- **cafe** / **testSearchAndFilters**: 39603ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **cafe** / **createTemperatureLog**: 8203ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **testSortAndViewToggles**: 11155ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **createTemperatureLog**: 17752ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **bulkOperations**: 5790ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **cafe** / **createOrderList**: 11046ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **cafe** / **testImportExport**: 41014ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **cafe** / **testQRCode**: 8027ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **staffOnboarding**: 5802ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **cafe** / **createTemperatureLog**: 36426ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **viewRoster**: 6640ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **cafe** / **createStaffMember**: 5081ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **cafe** / **clockInOut**: 6939ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **cafe** / **testInlineEditing**: 15638ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **cafe** / **viewDashboard**: 5617ms (threshold 5000ms) @ http://localhost:3000/webapp
- **cafe** / **viewSections**: 18928ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **cafe** / **testFormValidation**: 30683ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **cafe** / **interactSettings**: 22571ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **cafe** / **createCustomer**: 30010ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **food-truck** / **viewParLevels**: 17856ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **createOrderList**: 18352ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **food-truck** / **viewDashboard**: 11948ms (threshold 5000ms) @ http://localhost:3000/webapp
- **food-truck** / **switchTabs**: 193756ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#security
- **food-truck** / **createIngredient**: 40796ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **food-truck** / **createTemperatureLog**: 30009ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **food-truck** / **createSupplier**: 6569ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **food-truck** / **viewSections**: 23681ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **food-truck** / **testSearchAndFilters**: 153393ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **food-truck** / **createKitchenSection**: 19933ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **food-truck** / **createOrderList**: 25303ms (threshold 5000ms) @ http://localhost:3000/webapp/order-lists
- **food-truck** / **createPrepList**: 20307ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **food-truck** / **viewParLevels**: 8895ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **createTemperatureEquipment**: 45006ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **viewSettingsBilling**: 25979ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing
- **food-truck** / **testImportExport**: 316824ms (threshold 5000ms) @ http://localhost:3000/webapp/cleaning
- **food-truck** / **testInlineEditing**: 48179ms (threshold 5000ms) @ http://localhost:3000/webapp/par-levels
- **food-truck** / **createTemperatureLog**: 30023ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **food-truck** / **viewCompliance**: 45006ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes

---

## Faulty Paths

- **cafe** / **createParLevel** @ http://localhost:3000/webapp/par-levels
  Error: [createParLevel] locator.click: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Add Par Level/i }).first()[22m
