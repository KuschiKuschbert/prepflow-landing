# CLEANING MANAGEMENT SKILL

## PURPOSE

Load when working on cleaning management: cleaning areas, cleaning tasks, task scheduling, task completion, HACCP cleaning records, QR codes for areas, or standard cleaning templates.

## HOW IT WORKS IN THIS CODEBASE

**Data flow:**

1. UI: `app/webapp/cleaning/page.tsx`
2. Areas API: `app/api/cleaning-areas/`
3. Tasks API: `app/api/cleaning-tasks/`
4. DB: `cleaning_areas` + `cleaning_tasks` + `cleaning_task_completions`
5. QR code: `GET /api/cleaning-areas/[id]/qr-code`

**Task lifecycle:**

1. Areas defined (kitchen, prep area, storage, etc.)
2. Tasks assigned to areas with schedule (daily/weekly/monthly)
3. Staff completes task → `POST /api/cleaning-tasks/[id]/complete`
4. Completion recorded with timestamp + staff member
5. Uncomplete if needed → `POST /api/cleaning-tasks/[id]/uncomplete`

**Standard templates:**
`POST /api/cleaning-tasks/populate-standard` creates standard HACCP cleaning templates for common areas. Templates fetched at `GET /api/cleaning-tasks/standard-templates`.

**Paginated tasks:**
`app/api/cleaning-tasks/helpers/fetchPaginatedTasks.ts` — large cleaning task lists are paginated server-side.

## STEP-BY-STEP: Add a new cleaning area

1. `POST /api/cleaning-areas` — name, description, location
2. QR code auto-generated at `GET /api/cleaning-areas/[id]/qr-code`
3. Assign tasks to the area: `POST /api/cleaning-tasks` with `area_id`

## STEP-BY-STEP: Add standard cleaning templates

1. `POST /api/cleaning-tasks/populate-standard` — creates default templates
2. Templates defined in `lib/populate-helpers/cleaning-data.ts`
3. Customize after population if needed

## GOTCHAS

- **Cleaning tasks are time-sensitive** — overdue tasks need visual indicators in UI
- **Completions are audit trail** — never delete completion records
- **QR code scans** — scanning generates a completion record with scan timestamp
- **Pagination** — cleaning task lists paginated; don't load all at once

## REFERENCE FILES

- `app/api/cleaning-areas/route.ts` — areas CRUD
- `app/api/cleaning-tasks/route.ts` — tasks CRUD
- `app/api/cleaning-tasks/helpers/fetchPaginatedTasks.ts` — pagination
- `lib/populate-helpers/cleaning-data.ts` — standard template data
- `app/webapp/cleaning/page.tsx` — cleaning dashboard

## RETROFIT LOG

## LAST UPDATED

2025-02-26
