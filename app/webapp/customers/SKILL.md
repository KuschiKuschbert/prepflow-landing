# CUSTOMERS SKILL

## PURPOSE

Load when working on customer management: customer CRUD, customer profile photos, customer detail views, or linking customers to functions.

## HOW IT WORKS IN THIS CODEBASE

**Data flow:**

1. UI: `app/webapp/customers/page.tsx` + `app/webapp/customers/[id]/`
2. API: `app/api/customers/`
3. DB: `customers` table
4. Photos: `POST /api/customers/upload-photo` → Supabase Storage

**Customer fields:**
`name`, `email`, `phone`, `notes`, `function_id` (optional link to a function), `photo_url`

**Customer schema:**
`app/api/customers/helpers/schemas.ts` — Zod validation for create/update

## STEP-BY-STEP: Add a new customer

1. `POST /api/customers` — required: `name`, optional: `email`, `phone`, `notes`, `function_id`
2. Photo optional: `POST /api/customers/upload-photo` with FormData
3. Customer appears in list at `/webapp/customers`

## GOTCHAS

- **Photo upload** is separate from customer CRUD — handled by its own endpoint
- **Function linking** — `function_id` links a customer to a catering function
- **Layout** — `app/webapp/customers/layout.tsx` has a specific layout structure

## REFERENCE FILES

- `app/api/customers/route.ts` — CRUD
- `app/api/customers/helpers/schemas.ts` — Zod schema
- `app/webapp/customers/layout.tsx` — layout

## RETROFIT LOG

### 2025-02-26 — Batch 4 (people & events)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
