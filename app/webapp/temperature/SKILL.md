# TEMPERATURE MONITORING SKILL

## PURPOSE

Load when working on temperature monitoring: equipment management, temperature logs, HACCP compliance, Queensland food safety standards, QR codes for equipment, or temperature analytics.

## HOW IT WORKS IN THIS CODEBASE

**Data flow:**

1. UI: `app/webapp/temperature/page.tsx`
2. Equipment API: `app/api/temperature-equipment/`
3. Logs API: `app/api/temperature-logs/`
4. DB: `temperature_equipment` + `temperature_logs` tables
5. QR codes: `GET /api/temperature-equipment/[id]/qr-code`
6. Analytics chart: `RechartsTemperatureChart` component

**Queensland Food Safety Standards (auto-applied):**
All new equipment has thresholds automatically set based on name:

- Freezer/frozen → min: -24°C, max: -18°C
- Hot/warming/steam → min: 60°C (no upper limit)
- Everything else → min: 0°C, max: 5°C (cold storage)

This logic lives in `app/api/temperature-equipment/helpers/applyQueenslandStandards.ts`.

**Temperature log flow:**

1. User scans equipment QR code (or navigates to equipment)
2. Records temperature reading: `POST /api/temperature-logs`
3. System checks against `temperature_equipment.min_temp_celsius` and `max_temp_celsius`
4. If out of range: compliance record auto-created + notification
5. Analytics chart shows log history for the equipment

## STEP-BY-STEP: Add a new temperature equipment

1. `POST /api/temperature-equipment` — name determines category
2. Queensland thresholds auto-applied by `applyQueenslandStandards.ts`
3. QR code generated at `GET /api/temperature-equipment/[id]/qr-code`
4. Equipment appears in the monitoring dashboard

## STEP-BY-STEP: Modify temperature thresholds

1. `PUT /api/temperature-equipment/[id]` — update `min_temp_celsius`, `max_temp_celsius`
2. Thresholds take effect immediately for new log entries
3. Historical logs are not retroactively recalculated

## GOTCHAS

- **Queensland standards are auto-applied** — modifying equipment name may change thresholds
- **Temperature logs are immutable** — never update or delete (HACCP audit trail)
- **QR code URLs** include an authentication token — regenerating the QR code generates a new URL
- **Test data:** `POST /api/generate-test-temperature-logs` creates random logs for development only
- **Chart library:** Recharts (not Chart.js) — `RechartsTemperatureChart.tsx`

## REFERENCE FILES

- `app/api/temperature-equipment/helpers/applyQueenslandStandards.ts` — standard thresholds
- `app/api/temperature-equipment/route.ts` — equipment CRUD
- `app/api/temperature-logs/route.ts` — log CRUD
- `app/webapp/temperature/page.tsx` — monitoring dashboard
- `components/charts/RechartsTemperatureChart.tsx` — analytics chart

## RETROFIT LOG

## LAST UPDATED

2025-02-26
