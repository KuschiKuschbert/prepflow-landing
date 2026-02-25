# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 0 (Auth0/SSO/image noise excluded)
- Bottlenecks: 1
- Faulty Paths: 15

---

## Errors by Persona

---

## Bottlenecks

- **cafe** / **createParLevel**: 17600ms (threshold 5000ms) @ https://auth.prepflow.org/u/consent?state=hKFo2SBEcmp6TlcydlNkdWVHRFFKUUZ6UlQ1R1h1anB6bWN1UaFup2NvbnNlbnSjdGlk2SBwWkNDWDJSaFFrdFR2SEI0OUdxM3lnV1kyS3NUX09BSKNjaWTZIENPM1ZsMzdTdVo0ZTl3a2UxUGl0Z1d2QVV5TVIySGZM

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
