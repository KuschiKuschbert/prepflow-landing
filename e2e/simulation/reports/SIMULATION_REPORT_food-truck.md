# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 2 (Auth0/SSO/image noise excluded)
- Bottlenecks: 2
- Faulty Paths: 32

---

## Errors by Persona

### food-truck

- **network** @ http://localhost:3000/webapp/customers
  HTTP 431 Request Header Fields Too Large

- **network** @ http://localhost:3000/webapp/calendar
  HTTP 431 Request Header Fields Too Large

---

## Bottlenecks

- **cafe** / **createParLevel**: 17600ms (threshold 5000ms) @ https://auth.prepflow.org/u/consent?state=hKFo2SBEcmp6TlcydlNkdWVHRFFKUUZ6UlQ1R1h1anB6bWN1UaFup2NvbnNlbnSjdGlk2SBwWkNDWDJSaFFrdFR2SEI0OUdxM3lnV1kyS3NUX09BSKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
- **food-truck** / **createParLevel**: 16758ms (threshold 5000ms) @ https://auth.prepflow.org/u/consent?state=hKFo2SBIQUtHSzRvRmRZQm1yZ1BKd2xPTkdYVndEWGJOTm1VVaFup2NvbnNlbnSjdGlk2SBpTDBMZWJmc0NHbEg5aFpOSUpjUDdXRVVYNlZpekhvMKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM

---

## Faulty Paths

- **cafe** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SBlVWt4ZEJmT1NZTk14TWJzTFFtVEhXRWx5S21tall6YaFup2NvbnNlbnSjdGlk2SBSc21FM1c4WUpBdXBFR1gxdXZkRlI2RmdVVlVnVW4zb6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **cafe** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBXN0NxZFBmLVNMZml3OHJxQnh4WGk5UmMxbVdpX1NMTaFup2NvbnNlbnSjdGlk2SBORzN3dDFxZGJMLWxvVUY3aTVpOE5vX1hQZVJlcmJ5eKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **cafe** / **createIngredient** @ https://auth.prepflow.org/u/consent?state=hKFo2SA4TDBNdmJVWUhOUGRzYXdndXNoWGcxU2x5M2FUN1B0d6Fup2NvbnNlbnSjdGlk2SBoR1AzaExJRFZGRFM5WGhaR3lYTENFMzFlUk1raW0ybaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM#ingredients
  Error: [createIngredient] page.waitForSelector: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('input[placeholder*="Fresh Tomatoes"]') to be visible[22m

- **cafe** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SBYRlBHUjdGbFhFQ1QwMTJHUVRjVGR0Ymd6TjE0bWZvaqFup2NvbnNlbnSjdGlk2SBDbmtWay1tSURjTTJJRmpXd0l3R1l1Vm1DV1RBckhUb6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **cafe** / **createOrderList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBXaU5UQllCODlYNm4xcHV1dWFzamdjVUVvbUN4c0VSSaFup2NvbnNlbnSjdGlk2SBsS3RRdHhjVFQ0RGVxZld0UjJSc0xYd2pGNGREc1JJdqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createOrderList] locator.waitFor: Timeout 8000ms exceeded.
  Call log:
  [2m - waiting for locator('#menu-select').first() to be visible[22m

- **cafe** / **createCleaningTask** @ https://auth.prepflow.org/u/consent?state=hKFo2SA3dDJJZVZSZm43OWRpU3ZrNXhYNm5mQ1NkMUotMnBaeqFup2NvbnNlbnSjdGlk2SBZMm9uYmh5VUU1RFBja18zWTYweU9GaXdkbGhUdDl5a6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createCleaningTask] locator.waitFor: Timeout 10000ms exceeded.
  Call log:
  [2m - waiting for getByRole('button', { name: /Cleaning Areas/i }).first() to be visible[22m

- **cafe** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SB6QzE2bzNUbk50UDVFT1dzYmRfT3VrbXRvNTBMMUVsb6Fup2NvbnNlbnSjdGlk2SBCb21pY2NBMXdKVlNTMjFkYW9meVVZUkNwSW5keWg3SqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **cafe** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SBjeDFCVjlGaFRPdnU2bTVtMElNYUVCRTh6MXliSlZ1bqFup2NvbnNlbnSjdGlk2SBOWXdqRzViWFExSVBSOEl5dVJNMGw4RHRobVlFZVJfLaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **cafe** / **createRecipe** @ https://auth.prepflow.org/u/consent?state=hKFo2SBWTTZaTHZ5S0JIbnp4Mm0zbDN3aVBrR2RMRGc0U05oYqFup2NvbnNlbnSjdGlk2SBXQ2xtVG5GSU9Vdzk5T20zYjNqTGtDVl92REllRGd6bqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM#dishes
  Error: [createRecipe] locator.waitFor: Timeout 30000ms exceeded.
  Call log:
  [2m - waiting for getByRole('button', { name: 'Recipe', exact: true }).first() to be visible[22m

- **cafe** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SBYa2x5dmpHSzFJNTY5cWR3VzBLTkJsRXFMdVluTldyUqFup2NvbnNlbnSjdGlk2SBsZHB6aDI4N1pLTjhiNnhvQ2hHNVdQOFZoREZoZDlTN6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **cafe** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBWbGdLTDNiM0l2azJ1SThUNlNlcE1kR3RFLV8wa1FidaFup2NvbnNlbnSjdGlk2SBLRWNlSHVaSnJYVl8zLW15OHc2akY3UmZuX1FTcTlyaaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **cafe** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SA1NGhCc0dBMWNoa2NGeXl1OGJnX2FseDQwSV9DTHdmZ6Fup2NvbnNlbnSjdGlk2SBJS0pIT001Y0NIT1Y1S2ZYcFJWUjNuVDJwdEJMTDZBM6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **cafe** / **createOrderList** @ https://auth.prepflow.org/u/consent?state=hKFo2SB3SVR1TC1iamJOWW51T1doMG9pMndfYkc5WDNJdFRpX6Fup2NvbnNlbnSjdGlk2SB1ZGFnNXRFZTlwbVh2dms2eFZ6RWJVT3hjLWlfaUI1c6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createOrderList] locator.waitFor: Timeout 8000ms exceeded.
  Call log:
  [2m - waiting for locator('#menu-select').first() to be visible[22m

- **cafe** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SB5aHEzRVByQXczdHowdjdvQTdMLVU4YzZrRnJkdkx5aqFup2NvbnNlbnSjdGlk2SBXaFdpR2RMbVhadzhaNDhoaFR3QVFFZ3d1d1dqV2U4X6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **cafe** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBnclNCU0xZdy1tOWtWbnVENDI3cGpYSzJHSkFFOEJ1ZqFup2NvbnNlbnSjdGlk2SA4MWtkMWFBckkyOS1HU0U1VU5xaWtyUXMtN3kzSFk5LaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **food-truck** / **createOrderList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBQTHozSWJ2SDV5Yk42ZmI4OWRvRzRZMnUwNnB3X0R4eKFup2NvbnNlbnSjdGlk2SBCQVNjVjFhak42d29keFFoX2lhaEFyc0djSFhORkZoRqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createOrderList] locator.waitFor: Timeout 8000ms exceeded.
  Call log:
  [2m - waiting for locator('#menu-select').first() to be visible[22m

- **food-truck** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SB5RV9MaFloR3pnckd5UzRMTGp3RUpRa1pEa3FkNWxPT6Fup2NvbnNlbnSjdGlk2SA3ZVNfQXdMdk1sYUpuUlRWakFsWjI5X3RhWC0zNkZXYqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **food-truck** / **createIngredient** @ https://auth.prepflow.org/u/consent?state=hKFo2SBmLXVlanZxelhXVzJobjEwUllpMlc4NVQycnlPX2RERaFup2NvbnNlbnSjdGlk2SBlSEFIUW5jVFVWc0k4YkpaZmcyY1kzc0R5TUE0Y3F5SaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM#ingredients
  Error: [createIngredient] page.waitForSelector: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('input[placeholder*="Fresh Tomatoes"]') to be visible[22m

- **food-truck** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SBIbzdxQy1ISlYyUDNIV3lLNV80dDBuSkhEeWU2RzROQ6Fup2NvbnNlbnSjdGlk2SBvVEpaT3V2VGhKMXQ2YU81MjFCWWh1VTlWRFZBcWstNKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **food-truck** / **createOrderList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBKT2I4aTAwZEZ0cmVrRXMwOC1EWUQ1OGFmYVpCNHNTbKFup2NvbnNlbnSjdGlk2SBoOU1fR0hWRHJrTFVzV3FwMXlCTkhwX2ljV3RwdEVLTKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createOrderList] locator.waitFor: Timeout 8000ms exceeded.
  Call log:
  [2m - waiting for locator('#menu-select').first() to be visible[22m

- **food-truck** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBhNHZMRzRIaE5oWlFiUExILVVfbHIxZkN6TTFaNUdoSqFup2NvbnNlbnSjdGlk2SB2VUdUTGlxNGhyRHNLVHlPclVJRjdYSWxBVlY5cDF5baNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **food-truck** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SAzcTBiR2VsTDVDZVlfX2NYd09FNG5HVmxrR0hLbGpibKFup2NvbnNlbnSjdGlk2SBmNEo4TURuZFV6cGFOb1NOZzVkSU5ZNHVkODluZElRX6NjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **food-truck** / **createIngredient** @ https://auth.prepflow.org/u/consent?state=hKFo2SBGckVUbzVoekJUeDFfUmFzU0VBNkEyQ1dGTHpxRlhrZKFup2NvbnNlbnSjdGlk2SBzQ2xoZFpzdXVXSVpqYjlJNjJkQmk1VGswYXpXM3ZJQaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM#ingredients
  Error: [createIngredient] page.waitForSelector: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('input[placeholder*="Fresh Tomatoes"]') to be visible[22m

- **food-truck** / **createComplianceRecord** @ https://auth.prepflow.org/u/consent?state=hKFo2SA4TlJ5cTRqWlI5UVlDZ0lRMmU4NGstZkUwalAwMEt1MKFup2NvbnNlbnSjdGlk2SBodTRqbG5zWjBqajBXSTM3OTlLbHFjWlI2RWlEaXhGQqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createComplianceRecord] locator.waitFor: Timeout 10000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Compliance Record")').first() to be visible[22m

- **food-truck** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SB5U1BPNUh5RFlhQ0drYXpiakxsYW1oQzBKNHBXQ0xHc6Fup2NvbnNlbnSjdGlk2SB6ckgtMDR3d3hqenhFMmxlZTlLN1Fkc0ptQ2VKYmlidaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **food-truck** / **createOrderList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBadVl4dkVuV0xCeFZqWkdzN0FZLUhaLWJ1ejVvYWpKbKFup2NvbnNlbnSjdGlk2SB2NUpkQUJndklzRnRkRmFIeGFBdHdjZnk5cWFNcWdqLaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createOrderList] locator.waitFor: Timeout 8000ms exceeded.
  Call log:
  [2m - waiting for locator('#menu-select').first() to be visible[22m

- **food-truck** / **createRecipe** @ https://auth.prepflow.org/u/consent?state=hKFo2SBwdm1tOF9aNjRQTXNWREg0ejA3WXZBUWVXY2RLWGo0VqFup2NvbnNlbnSjdGlk2SBTZzFXM05uVXluOFFZSm1BMFRyWWZDeURwZG4yZGhKWaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM#dishes
  Error: [createRecipe] locator.waitFor: Timeout 30000ms exceeded.
  Call log:
  [2m - waiting for getByRole('button', { name: 'Recipe', exact: true }).first() to be visible[22m

- **food-truck** / **createTemperatureLog** @ https://auth.prepflow.org/u/consent?state=hKFo2SBFZlhQd2tvTXNGQm1FZUtBUmZXc0hKcGYwRTMtdjJFZ6Fup2NvbnNlbnSjdGlk2SBXc3VOb2JOaV9TcjlrSHVHbUxDZ3h3cG1VQklNZzc5OaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createTemperatureLog] locator.waitFor: Timeout 20000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")').first() to be visible[22m

- **food-truck** / **createOrderList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBPd3o5WWNjZEo1R2lpWkVDSWlUYzIwaFBaOHpVcGhHR6Fup2NvbnNlbnSjdGlk2SBqX2FROVplZURCaXlwd0Vnamwyb2pzai1kZXhhbW1tbaNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createOrderList] locator.waitFor: Timeout 8000ms exceeded.
  Call log:
  [2m - waiting for locator('#menu-select').first() to be visible[22m

- **food-truck** / **createPrepList** @ https://auth.prepflow.org/u/consent?state=hKFo2SBqRU1DMHJPNGdmSHk3ZmZacnJxTTVldjVXUzRpNnpNUaFup2NvbnNlbnSjdGlk2SB1NWJicW5CaF8wS0dzTjhaY21oalI1S0hZT0NmSTYwSKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [createPrepList] locator.waitFor: Timeout 15000ms exceeded.
  Call log:
  [2m - waiting for locator('button:has-text("Generate from Menu"), button:has-text("Generate")').first() to be visible[22m

- **food-truck** / **viewCustomers** @ https://auth.prepflow.org/u/consent?state=hKFo2SBuTTEzajhTQkFyMkk4T2YwNVlodk1MRnhfMXpxZlI4V6Fup2NvbnNlbnSjdGlk2SB3UTBCdHlEbXdhUlpmMkRJYXVWUU5RNUFqYnhmSFpXbqNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM
  Error: [viewCustomers] page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at http://localhost:3000/webapp/customers
  Call log:
  [2m - navigating to "http://localhost:3000/webapp/customers", waiting until "load"[22m

- **food-truck** / **viewCalendar** @ chrome-error://chromewebdata/
  Error: [viewCalendar] page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at http://localhost:3000/webapp/calendar
  Call log:
  [2m - navigating to "http://localhost:3000/webapp/calendar", waiting until "load"[22m
