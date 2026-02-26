# ROSTER & TIME ATTENDANCE SKILL

## PURPOSE

Load when working on staff roster, shift management, roster templates, clock-in/out, or time and attendance features.

## HOW IT WORKS IN THIS CODEBASE

**Two related but separate features:**

1. **Roster** — planned shifts for future dates
2. **Time & Attendance** — actual clock-in/clock-out records

**Roster data flow:**

1. UI: `app/webapp/roster/page.tsx`
2. API: `app/api/roster/shifts/` + `app/api/roster/templates/`
3. DB: `roster_shifts` + `roster_templates` + `roster_template_shifts`

**Templates:**

- Templates define recurring shift patterns (weekly schedule)
- `POST /api/roster/templates/[id]/apply` — applies template to a date range
- Template shifts: `GET/POST /api/roster/templates/[id]/template-shifts`

**Shift lifecycle:**

1. Create shift: `POST /api/roster/shifts` (employee_id, date, start_time, end_time, role)
2. Modify: `PUT /api/roster/shifts/[id]`
3. Delete: `DELETE /api/roster/shifts/[id]`

**Time & Attendance:**

- Separate page at `/webapp/time-attendance`
- Clock in/out records in `clock_events` table
- Records actual vs. planned hours

## STEP-BY-STEP: Create a recurring weekly roster

1. Create template: `POST /api/roster/templates` (name, description)
2. Add shifts to template: `POST /api/roster/templates/[id]/template-shifts`
3. Apply to date range: `POST /api/roster/templates/[id]/apply` (start_date, end_date)
4. Individual shifts created in `roster_shifts` table

## GOTCHAS

- **Shifts reference employees** — `employee_id` must exist in `employees` table
- **Time & Attendance is separate** from roster — actual hours vs. planned hours
- **Template shifts don't auto-repeat** — you must apply the template for each period

## REFERENCE FILES

- `app/api/roster/shifts/route.ts` — shift CRUD
- `app/api/roster/templates/[id]/template-shifts/route.ts` — template shifts
- `app/webapp/roster/page.tsx` — roster UI
- `app/api/roster/shifts/[id]/route.ts` — single shift CRUD

## RETROFIT LOG

## LAST UPDATED

2025-02-26
