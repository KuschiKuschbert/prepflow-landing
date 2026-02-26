# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 0 (Auth0/SSO/image noise excluded)
- Bottlenecks: 42
- Faulty Paths: 1

---

## Errors by Persona

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
