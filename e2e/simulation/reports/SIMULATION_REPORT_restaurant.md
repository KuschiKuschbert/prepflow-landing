# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 5 (Auth0/SSO/image noise excluded)
- Bottlenecks: 83
- Faulty Paths: 2

---

## Errors by Persona

### restaurant

- **uncaught** @ http://localhost:3000/webapp/functions
  Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/webapp/fu..." tree={[...]} params={{}} cacheNode={{rsc:<Fragment>, ...}} ...>
<SegmentViewNode type="page" pagePath="webapp/fun...">
<SegmentTrieNode>
<ClientPageRoot Component={function FunctionsPage} serverProvidedParams={{...}}>
<FunctionsPage params={Promise} searchParams={Promise}>
<ConfirmDialogComponent>
<div className="desktop:p-...">
<div className="desktop:bl...">
<div className="sticky ove..." style={{top:"calc(...", ...}}>
<MiniCalendarPanel events={[...]} selectedDate={null} onDateSelect={function bound dispatchSetState} ...>
<div className="overflow-h...">
<div>
<div className="px-2 pb-2">
<div>
<div className="grid grid-...">
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button
onClick={function onClick}

-                             className="relative flex h-7 flex-col items-center justify-center rounded-md text-[10px]..."

*                             className="relative flex h-7 flex-col items-center justify-center rounded-md text-[10px]..."

-                             aria-label="February 26, 2 events"

*                             aria-label="February 26"
                            >
                              <span>

-                             <div className="absolute bottom-0.5 flex gap-px">
                            ...
                        ...
                ...
              ...
        ...
      ...

* **uncaught** @ http://localhost:3000/webapp/functions
  Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/webapp/fu..." tree={[...]} params={{}} cacheNode={{rsc:<Fragment>, ...}} ...>
<SegmentViewNode type="page" pagePath="webapp/fun...">
<SegmentTrieNode>
<ClientPageRoot Component={function FunctionsPage} serverProvidedParams={{...}}>
<FunctionsPage params={Promise} searchParams={Promise}>
<ConfirmDialogComponent>
<div className="desktop:p-...">
<div className="desktop:bl...">
<div className="sticky ove..." style={{top:"calc(...", ...}}>
<MiniCalendarPanel events={[...]} selectedDate={null} onDateSelect={function bound dispatchSetState} ...>
<div className="overflow-h...">
<div>
<div className="px-2 pb-2">
<div>
<div className="grid grid-...">
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button>
<button
onClick={function onClick}

-                             className="relative flex h-7 flex-col items-center justify-center rounded-md text-[10px]..."

*                             className="relative flex h-7 flex-col items-center justify-center rounded-md text-[10px]..."

-                             aria-label="February 26, 2 events"

*                             aria-label="February 26"
                            >
                              <span>

-                             <div className="absolute bottom-0.5 flex gap-px">
                            ...
                        ...
                ...
              ...
        ...
      ...

* **console.warn** @ http://localhost:3000/webapp/recipes
  Image with src "/images/prepflow-logo.png" has "fill" and parent element with invalid "position". Provided "static" should be one of absolute,fixed,relative.

* **network** @ https://dulkrqgjfohsuxhsmofo.supabase.co/rest/v1/temperature_equipment?columns=%22name%22%2C%22equipmentType%22%2C%22location%22%2C%22minTemp%22%2C%22maxTemp%22&select=*
  HTTP 400

* **console.warn** @ http://localhost:3000/webapp/temperature
  [WARN] {
  "level": "warn",
  "message": "⚠️ No logs found for equipment \"Bain Marie Hot\"",
  "timestamp": "2026-02-26T06:52:11.469Z",
  "data": {
  "queriedLocations": [
  "Service Area",
  "Bain Marie Hot"
  ]
  }
  }

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
- **restaurant** / **createRecipe**: 9816ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **addIngredientToRecipe**: 10280ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **testSearchAndFilters**: 23504ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#ingredients
- **restaurant** / **testPagination**: 59003ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewPerformance**: 10171ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **createIngredient**: 33207ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes
- **restaurant** / **viewRecipeSharing**: 6737ms (threshold 5000ms) @ http://localhost:3000/webapp/recipe-sharing
- **restaurant** / **viewSquare**: 7212ms (threshold 5000ms) @ http://localhost:3000/webapp/square
- **restaurant** / **interactSquare**: 7046ms (threshold 5000ms) @ http://localhost:3000/webapp/square#webhooks
- **restaurant** / **switchTabs**: 73470ms (threshold 5000ms) @ http://localhost:3000/webapp/settings#profile
- **restaurant** / **createKitchenSection**: 12985ms (threshold 5000ms) @ http://localhost:3000/webapp/sections
- **restaurant** / **createRecipe**: 9012ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **viewFunctions**: 6972ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **viewRoster**: 8037ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **restaurant** / **createRosterShift**: 8586ms (threshold 5000ms) @ http://localhost:3000/webapp/roster
- **restaurant** / **testAIFeatures**: 22687ms (threshold 5000ms) @ http://localhost:3000/webapp/prep-lists
- **restaurant** / **assignDishToMenu**: 10958ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#menu-builder
- **restaurant** / **createEquipmentMaintenance**: 8860ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **viewSuppliers**: 5566ms (threshold 5000ms) @ http://localhost:3000/webapp/suppliers
- **restaurant** / **viewTimeAttendance**: 12023ms (threshold 5000ms) @ http://localhost:3000/webapp/time-attendance
- **restaurant** / **createStaffMember**: 5873ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **createCustomer**: 20116ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **restaurant** / **clockInOut**: 45040ms (threshold 5000ms) @ http://localhost:3000/webapp/customers
- **restaurant** / **viewPerformance**: 28922ms (threshold 5000ms) @ http://localhost:3000/webapp/performance
- **restaurant** / **viewDashboard**: 13624ms (threshold 5000ms) @ http://localhost:3000/webapp
- **restaurant** / **printMenu**: 10662ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **testImportExport**: 207294ms (threshold 5000ms) @ http://localhost:3000/webapp/recipes#dishes
- **restaurant** / **testDeleteFlow**: 5762ms (threshold 5000ms) @ http://localhost:3000/webapp/compliance
- **restaurant** / **createMenu**: 24988ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **createTemperatureLog**: 31328ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewAISpecials**: 18519ms (threshold 5000ms) @ http://localhost:3000/webapp/specials
- **restaurant** / **testSortAndViewToggles**: 14587ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **testInlineEditing**: 15235ms (threshold 5000ms) @ http://localhost:3000/webapp/menu-builder
- **restaurant** / **viewFunctions**: 10400ms (threshold 5000ms) @ http://localhost:3000/webapp/functions
- **restaurant** / **createTemperatureEquipment**: 12732ms (threshold 5000ms) @ http://localhost:3000/webapp/temperature
- **restaurant** / **viewStaff**: 6642ms (threshold 5000ms) @ http://localhost:3000/webapp/staff
- **restaurant** / **navigateAllModules**: 226728ms (threshold 5000ms) @ http://localhost:3000/webapp/recipe-sharing
- **restaurant** / **interactSettings**: 54252ms (threshold 5000ms) @ http://localhost:3000/webapp/settings/billing

---

## Faulty Paths

- **cafe** / **createParLevel** @ http://localhost:3000/webapp/par-levels
  Error: [createParLevel] locator.click: Timeout 5000ms exceeded.
  Call log:
  [2m - waiting for getByRole('button', { name: /Add Par Level/i }).first()[22m

- **restaurant** / **createParLevel** @ http://localhost:3000/webapp/par-levels
  Error: [createParLevel] locator.click: Timeout 5000ms exceeded.
  Call log:
  [2m - waiting for getByRole('button', { name: /Add Par Level/i }).first()[22m
