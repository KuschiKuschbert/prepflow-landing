# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 2 (Auth0/SSO/image noise excluded)
- Bottlenecks: 26
- Faulty Paths: 1


---

## Errors by Persona

### cafe

- **console.warn** @ http://localhost:3000/webapp/temperature
  [WARN] {
  "level": "warn",
  "message": "⚠️ No logs found for equipment \"Bain Marie Hot\"",
  "timestamp": "2026-02-26T06:06:11.562Z",
  "data": {
    "queriedLocations": [
      "Service Area",
      "Bain Marie Hot"
    ]
  }
}

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
+                             className="relative flex h-7 flex-col items-center justify-center rounded-md text-[10px]..."
-                             className="relative flex h-7 flex-col items-center justify-center rounded-md text-[10px]..."
+                             aria-label="February 26, 2 events"
-                             aria-label="February 26"
                            >
                              <span>
+                             <div className="absolute bottom-0.5 flex gap-px">
                            ...
                        ...
                ...
              ...
        ...
      ...


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

---

## Faulty Paths

- **cafe** / **createParLevel** @ http://localhost:3000/webapp/par-levels
  Error: [createParLevel] locator.click: Timeout 5000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Add Par Level/i }).first()[22m
