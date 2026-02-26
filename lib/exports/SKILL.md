# EXPORTS & PDF GENERATION SKILL

## PURPOSE

Load when working on PDF exports, print views, QR code generation, allergen matrix exports, recipe card exports, or menu exports.

## HOW IT WORKS IN THIS CODEBASE

**PDF generation:** Puppeteer Core + @sparticuz/chromium (Vercel-compatible)

- Wrapper: `lib/exports/generate-pdf.ts`
- All PDF routes are in API routes (server-side only)
- QR codes: `lib/qr-codes/` + qrcode / react-qr-code packages

**Export types and their routes:**
| Export | Route | Notes |
|--------|-------|-------|
| Menu display PDF | `GET /api/menus/[id]/menu-display/export` | For customers |
| Combined menu PDF | `GET /api/menus/[id]/export-combined` | All menu info |
| Recipe cards | `GET /api/menus/[id]/recipe-cards/export` | For kitchen |
| Allergen matrix | `GET /api/menus/[id]/allergen-matrix/export` | For compliance |
| Function runsheet | `GET /api/functions/[id]/export` | Event PDF |
| Par levels CSV | `GET /api/par-levels` with `?format=csv` | Inventory |
| Compliance report | `GET /api/compliance/health-inspector-report` | HACCP |

**QR code endpoints:**

- `GET /api/ingredients/[id]/qr-code`
- `GET /api/cleaning-areas/[id]/qr-code`
- `GET /api/compliance-records/[id]/qr-code`
- `GET /api/employees/[id]/qr-code`
- `GET /api/temperature-equipment/[id]/qr-code` (via `app/api/temperature-equipment/[id]/qr-code/`)

**Print patterns:**

- Locked menus use `?locked=1` to skip expensive price enrichment in print views
- PDF generation is slow (2-5s) — always show loading state in UI

## STEP-BY-STEP: Add a new PDF export

1. Create `app/api/my-domain/[id]/export/route.ts`
2. Build HTML string for the PDF content (or use a React component to HTML)
3. Call `generatePDF(htmlContent, options)` from `lib/exports/generate-pdf.ts`
4. Return with `Content-Type: application/pdf` and appropriate headers
5. Add download button in UI using an anchor tag with `href` pointing to the export route

## STEP-BY-STEP: Generate a QR code

```typescript
import { generateQRCode } from '@/lib/qr-codes/generate';

const qrCodeDataURL = await generateQRCode(`https://app.prepflow.org/scan/${id}`);
// Returns a data:image/png;base64,... string
```

## GOTCHAS

- **Puppeteer memory:** PDF generation uses significant memory. Don't generate multiple PDFs concurrently.
- **@sparticuz/chromium path:** This is not a standard Chromium install. Path configured in `lib/exports/generate-pdf.ts`.
- **Vercel function timeout:** PDF generation may time out on large documents. Consider streaming or increasing timeout.
- **QR code URLs** contain auth tokens — they expire and may need regeneration.
- **CSV exports** use PapaParse (`lib/csv/`) — format before sending.

## REFERENCE FILES

- `lib/exports/generate-pdf.ts` — PDF generation wrapper
- `lib/qr-codes/generate.ts` — QR code generation
- `app/api/menus/[id]/export-combined/route.ts` — combined menu export
- `app/api/menus/[id]/recipe-cards/export/route.ts` — recipe cards
- `app/api/functions/[id]/export/route.ts` — function runsheet export

## RETROFIT LOG

## LAST UPDATED

2025-02-26
