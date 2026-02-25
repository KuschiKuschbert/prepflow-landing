# Persona Simulation Report

## Summary

- Personas: 1
- Total Errors: 32 (Auth0/SSO/image noise excluded)
- Bottlenecks: 0
- Faulty Paths: 1

---

## Errors by Persona

### restaurant

- **network** @ http://localhost:3000/api/user/subscription
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/features/kitchen-staff
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/features/roster
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/features/square_pos_integration
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/detect-country
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/functions?limit=4
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/menu-summary
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/performance-summary?lockedMenuOnly=true
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/performance-summary?lockedMenuOnly=true
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/stats
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/performance-summary?lockedMenuOnly=true
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/functions?limit=4
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/menu-summary
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dashboard/performance-summary?lockedMenuOnly=true
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/user/subscription
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/features/kitchen-staff
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/features/roster
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/features/square_pos_integration
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/dishes?pageSize=1000
  HTTP 429 Too Many Requests

- **network** @ http://localhost:3000/api/recipes?pageSize=1000
  HTTP 429 Too Many Requests

- **console.error** @ http://localhost:3000/webapp/recipes#dishes
  [ERROR] {
  "level": "error",
  "message": "[useIsAdmin] Rate limited (429)",
  "timestamp": "2026-02-24T14:26:37.871Z"
  }

- **console.error** @ http://localhost:3000/webapp/recipes#dishes
  [ERROR] {
  "level": "error",
  "message": "[useEntitlements] Error fetching entitlements:",
  "timestamp": "2026-02-24T14:26:37.889Z",
  "data": {
  "error": "Failed to fetch subscription",
  "stack": "Error: Failed to fetch subscription\n at fetchEntitlementsHelper (http://localhost:3000/_next/static/chunks/%5Broot-of-the-server%5D\_\_3b8389d7._.js:7929:33)\n at async useEntitlements.useQuery (http://localhost:3000/_next/static/chunks/%5Broot-of-the-server%5D\_\_3b8389d7._.js:7985:17)",
  "context": {
  "endpoint": "/api/user/subscription",
  "operation": "fetchEntitlements"
  }
  }
  }

- **console.error** @ http://localhost:3000/webapp/recipes#dishes
  [ERROR] {
  "level": "error",
  "message": "[useFeatureFlag] Rate limited (429) for key: kitchen-staff",
  "timestamp": "2026-02-24T14:26:37.890Z"
  }

- **console.error** @ http://localhost:3000/webapp/recipes#dishes
  [ERROR] {
  "level": "error",
  "message": "[useFeatureFlag] Rate limited (429) for key: roster",
  "timestamp": "2026-02-24T14:26:37.890Z"
  }

- **console.error** @ http://localhost:3000/webapp/recipes#dishes
  [ERROR] {
  "level": "error",
  "message": "[useFeatureFlag] Rate limited (429) for key: square_pos_integration",
  "timestamp": "2026-02-24T14:26:37.909Z"
  }

- **network** @ http://localhost:3000/api/setup-menu-builder
  HTTP 429 Too Many Requests

---

## Bottlenecks

---

## Faulty Paths

- **restaurant** / **createRecipe** @ http://localhost:3000/webapp/recipes#menu-builder
  Error: [createRecipe] locator.waitFor: Timeout 45000ms exceeded.
  Call log:
  [2m - waiting for getByRole('button', { name: 'Recipe', exact: true }).first() to be visible[22m
