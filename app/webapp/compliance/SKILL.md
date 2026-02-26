# COMPLIANCE RECORDS SKILL

## PURPOSE

Load when working on compliance records: food safety compliance, allergen compliance, health inspector reports, compliance types, QR codes, or the compliance export.

## HOW IT WORKS IN THIS CODEBASE

**Compliance covers:**

- Food safety incidents and corrections
- Temperature danger zone violations (auto-created from temp monitoring)
- Allergen management (linked to dishes/recipes)
- Manual compliance records (e.g., health inspector visits)

**Data flow:**

1. UI: `app/webapp/compliance/page.tsx`
2. Records API: `app/api/compliance-records/`
3. Types API: `app/api/compliance-types/`
4. Allergen API: `app/api/compliance/allergens/`
5. QR code: `GET /api/compliance-records/[id]/qr-code`
6. Report: `GET /api/compliance/health-inspector-report`

**Allergen compliance export:**
`GET /api/compliance/allergens/export` generates a full allergen matrix for all menus — useful for health inspector reports.

**Validate operation:**
`POST /api/compliance/validate` checks for outstanding compliance issues.

## STEP-BY-STEP: Add a new compliance type

1. Add to `compliance_types` table via migration or admin UI
2. Compliance types are fetched at `GET /api/compliance-types`
3. New records can now use the new type

## GOTCHAS

- **Compliance records are immutable** — like temperature logs, never delete (audit trail)
- **Auto-creation:** temperature out-of-range events auto-create compliance records
- **QR codes** on compliance records allow quick mobile scanning for ongoing issues
- **Allergen export** is for the current locked menu state — unlock changes won't be in the export

## REFERENCE FILES

- `app/api/compliance-records/route.ts` — CRUD
- `app/api/compliance/allergens/export/route.ts` — allergen matrix export
- `app/api/compliance/health-inspector-report/route.ts` — inspector report
- `app/webapp/compliance/page.tsx` — compliance dashboard

## RETROFIT LOG

### 2025-02-26 — Batch 3 (operations domains)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
