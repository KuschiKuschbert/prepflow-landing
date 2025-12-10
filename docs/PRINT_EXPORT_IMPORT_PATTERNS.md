# Print, Export, and Import Patterns for Future Development

This document captures the standardized patterns for print, export, and import functionality in PrepFlow. Use these patterns when adding new pages or features.

## Table of Contents

1. [Print Templates](#print-templates)
2. [Export Templates](#export-templates)
3. [CSV Import Modals](#csv-import-modals)
4. [Quick Reference](#quick-reference)

---

## Print Templates

### Overview

All print functionality uses the unified print template system located in `lib/exports/print-template.ts`. This ensures consistent Cyber Carrot branding and PrepFlow voice across all printed documents.

### Template Variants

The print template system supports multiple variants for different use cases:

- **`default`** - Full branding with logo, background elements, and footer
- **`customer`** - Polished, marketing-focused, photo-ready (for customer-facing menus)
- **`supplier`** - Purchase order format, formal layout
- **`compliance`** - Audit-ready, formal layout
- **`kitchen`** - Minimal branding, compact layout (for kitchen prep lists)
- **`compact`** - Compact layout, minimal spacing

### Usage Pattern

```typescript
import { printWithTemplate } from '@/lib/exports/print-template';
import { formatMyDataForPrint } from './utils/formatMyDataForPrint';

export function printMyData(data: MyDataType, variant: TemplateVariant = 'default'): void {
  const content = formatMyDataForPrint(data, variant);

  printWithTemplate({
    title: 'My Document Title',
    subtitle: 'Optional subtitle',
    content,
    totalItems: data.length,
    customMeta: 'Optional metadata',
    variant, // 'default' | 'customer' | 'supplier' | 'compliance' | 'kitchen' | 'compact'
  });
}
```

### Content Formatting

Create a separate formatting utility file (e.g., `formatMyDataForPrint.ts`) that generates HTML content:

```typescript
export function formatMyDataForPrint(
  data: MyDataType,
  variant: TemplateVariant = 'default',
): string {
  return `
    <div style="max-width: 100%;">
      <!-- Your formatted HTML content here -->
      ${data
        .map(
          item => `
        <div style="margin-bottom: 16px;">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}
```

### Adding Print Button

```typescript
import { PrintButton } from '@/components/ui/PrintButton';

<PrintButton
  onClick={handlePrint}
  loading={printLoading}
  disabled={data.length === 0}
/>
```

---

## Export Templates

### Overview

Export functionality supports three formats: CSV, PDF, and HTML. All exports use the unified export template system for consistent branding.

### Export Utilities

- **CSV Export**: `exportToCSV()` from `lib/csv/csv-utils.ts`
- **HTML Export**: `exportHTMLReport()` from `lib/exports/export-html.ts`
- **PDF Export**: `exportPDFReport()` from `lib/exports/export-html.ts`

### Usage Pattern

```typescript
import { exportToCSV } from '@/lib/csv/csv-utils';
import { exportHTMLReport, exportPDFReport } from '@/lib/exports/export-html';
import { formatMyDataForPrint } from './utils/formatMyDataForPrint';

// CSV Export
export function exportMyDataToCSV(data: MyDataType[]): void {
  const headers = ['Column1', 'Column2', 'Column3'];
  const csvData = data.map(item => ({
    Column1: item.field1,
    Column2: item.field2,
    Column3: item.field3,
  }));

  exportToCSV(csvData, headers, `my-data-${new Date().toISOString().split('T')[0]}.csv`);
}

// HTML Export
export function exportMyDataToHTML(data: MyDataType[]): void {
  const content = formatMyDataForPrint(data); // Reuse print formatting

  exportHTMLReport({
    title: 'My Data Report',
    subtitle: 'Optional subtitle',
    content,
    totalItems: data.length,
    filename: `my-data-${new Date().toISOString().split('T')[0]}.html`,
  });
}

// PDF Export
export async function exportMyDataToPDF(data: MyDataType[]): Promise<void> {
  const content = formatMyDataForPrint(data); // Reuse print formatting

  await exportPDFReport({
    title: 'My Data Report',
    subtitle: 'Optional subtitle',
    content,
    totalItems: data.length,
    filename: `my-data-${new Date().toISOString().split('T')[0]}.pdf`,
  });
}
```

### Adding Export Button

```typescript
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';

const handleExport = useCallback(async (format: ExportFormat) => {
  switch (format) {
    case 'csv':
      exportMyDataToCSV(data);
      break;
    case 'html':
      exportMyDataToHTML(data);
      break;
    case 'pdf':
      await exportMyDataToPDF(data);
      break;
  }
}, [data]);

<ExportButton
  onExport={handleExport}
  loading={exportLoading}
  disabled={data.length === 0}
  availableFormats={['csv', 'pdf', 'html']}
/>
```

---

## CSV Import Modals

### Overview

All CSV imports use the standardized `CSVImportModal` component with entity-specific import configurations. This ensures consistent UX, validation, and error handling.

### Available Import Configurations

- ✅ **Suppliers** - `lib/imports/supplier-import.ts` (fully implemented)
- 📋 **Recipes** - `lib/imports/recipe-import.ts`
- 📋 **Temperature Logs** - `lib/imports/temperature-import.ts`
- 📋 **Compliance Records** - `lib/imports/compliance-import.ts`
- 📋 **Order List Items** - `lib/imports/order-list-import.ts`
- 📋 **Par Levels** - `lib/imports/par-level-import.ts`

### Usage Pattern

```typescript
import { ImportButton } from '@/components/ui/ImportButton';
import { CSVImportModal } from '@/components/ui/CSVImportModal';
import { myEntityImportConfig, type MyEntityImportRow } from '@/lib/imports/my-entity-import';
import type { ImportProgressState } from '@/components/ui/ImportProgress';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';

// 1. Add state
const [showImportModal, setShowImportModal] = useState(false);
const [importLoading, setImportLoading] = useState(false);
const [importProgress, setImportProgress] = useState<ImportProgressState | undefined>(undefined);
const { showSuccess, showError } = useNotification();

// 2. Create import handler
const handleImport = useCallback(
  async (importRows: MyEntityImportRow[]) => {
    if (importRows.length === 0) {
      showError('No items to import');
      return;
    }

    setImportLoading(true);
    setImportProgress({
      total: importRows.length,
      processed: 0,
      successful: 0,
      failed: 0,
      isComplete: false,
    });

    const importedItems: any[] = [];
    let successCount = 0;
    let failCount = 0;
    const errors: Array<{ row: number; error: string }> = [];

    try {
      for (let i = 0; i < importRows.length; i++) {
        const row = importRows[i];
        setImportProgress({
          total: importRows.length,
          processed: i + 1,
          successful: successCount,
          failed: failCount,
          currentItem: row.name, // Use appropriate field
          isComplete: false,
          errors,
        });

        try {
          // Map import row to API format
          const itemData = {
            // Map fields according to your API
            field1: row.field1,
            field2: row.field2,
          };

          const response = await fetch('/api/my-entity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            importedItems.push(result.data);
            successCount++;
          } else {
            failCount++;
            errors.push({
              row: i + 1,
              error: result.error || result.message || 'Failed to import item',
            });
          }
        } catch (err) {
          failCount++;
          errors.push({
            row: i + 1,
            error: err instanceof Error ? err.message : 'Failed to import item',
          });
          logger.error(`[Import] Failed to import row ${i + 1}:`, err);
        }
      }

      // Update local state
      if (importedItems.length > 0) {
        const updatedItems = [...existingItems, ...importedItems];
        setItems(updatedItems);
        cacheData('items_cache_key', updatedItems);
      }

      setImportProgress({
        total: importRows.length,
        processed: importRows.length,
        successful: successCount,
        failed: failCount,
        isComplete: true,
        errors: errors.length > 0 ? errors : undefined,
      });

      if (successCount > 0) {
        showSuccess(`Successfully imported ${successCount} item${successCount !== 1 ? 's' : ''}`);
      }
      if (failCount > 0) {
        showError(`Failed to import ${failCount} item${failCount !== 1 ? 's' : ''}`);
      }

      setTimeout(() => {
        setShowImportModal(false);
        setImportProgress(undefined);
      }, 2000);
    } catch (err) {
      logger.error('[Import] Import error:', err);
      showError('Failed to import items. Please try again.');
      setImportProgress(undefined);
    } finally {
      setImportLoading(false);
    }
  },
  [existingItems, setItems, showSuccess, showError],
);

// 3. Add import button
<ImportButton onClick={() => setShowImportModal(true)} />

// 4. Add import modal
<CSVImportModal
  isOpen={showImportModal}
  onClose={() => {
    setShowImportModal(false);
    setImportProgress(undefined);
  }}
  onImport={handleImport}
  config={myEntityImportConfig}
  loading={importLoading}
  progress={importProgress}
/>
```

### Creating New Import Configurations

If you need to create a new import configuration:

1. Create `lib/imports/my-entity-import.ts`
2. Define import row interface
3. Implement parsing function (use `parseCSV` from `lib/csv/csv-utils.ts`)
4. Implement validation function
5. Implement preview formatting function
6. Implement template generation function
7. Export configuration object

See `lib/imports/supplier-import.ts` for a complete example.

---

## Quick Reference

### File Locations

**Print/Export Templates:**

- `lib/exports/print-template.ts` - Print template generator
- `lib/exports/export-template.ts` - Export template wrapper
- `lib/exports/export-html.ts` - HTML/PDF export utilities
- `lib/exports/template-styles.ts` - Shared CSS styles
- `lib/exports/template-utils.ts` - Template utilities (logo, dates, etc.)

**CSV Utilities:**

- `lib/csv/csv-utils.ts` - CSV parsing and export utilities
- `lib/csv/validation.ts` - CSV validation utilities

**Import System:**

- `components/ui/CSVImportModal.tsx` - Reusable import modal
- `components/ui/ImportProgress.tsx` - Progress indicator component
- `lib/imports/import-utils.ts` - Shared import utilities
- `lib/imports/*-import.ts` - Entity-specific import configs

**UI Components:**

- `components/ui/PrintButton.tsx` - Standardized print button
- `components/ui/ExportButton.tsx` - Standardized export button (with format dropdown)
- `components/ui/ImportButton.tsx` - Standardized import button

### Template Variants Reference

| Variant      | Use Case              | Branding            | Layout                |
| ------------ | --------------------- | ------------------- | --------------------- |
| `default`    | General documents     | Full branding       | Standard spacing      |
| `customer`   | Customer-facing menus | Polished, marketing | Photo-ready           |
| `supplier`   | Purchase orders       | Formal              | Purchase order format |
| `compliance` | Audit reports         | Formal              | Audit-ready           |
| `kitchen`    | Kitchen prep lists    | Minimal             | Compact               |
| `compact`    | Space-efficient       | Minimal             | Minimal spacing       |

### Common Patterns

**Print + Export Pattern:**

```typescript
// Reuse formatting function for both print and export
const content = formatMyDataForPrint(data, variant);

// Print
printWithTemplate({ title, content, variant });

// Export HTML/PDF
exportHTMLReport({ title, content });
exportPDFReport({ title, content });
```

**Import Pattern:**

```typescript
// 1. Use standardized modal
<CSVImportModal config={importConfig} onImport={handleImport} />

// 2. Loop through rows, call API, track progress
// 3. Update state and cache on success
// 4. Show notifications
```

### Best Practices

1. **Always use unified templates** - Never create custom print/export templates
2. **Reuse formatting functions** - Use same formatting for print and export
3. **Choose appropriate variant** - Use `customer` for menus, `kitchen` for prep lists, etc.
4. **Validate imports** - Always validate data before importing
5. **Show progress** - Update progress state during import loops
6. **Handle errors gracefully** - Collect and display errors per row
7. **Update cache** - Cache imported data for instant display
8. **Use notifications** - Show success/error notifications using `useNotification`

### Example: Complete Implementation

See `app/webapp/suppliers/page.tsx` for a complete example with:

- Print button and handler
- Export button and handlers (CSV, PDF, HTML)
- Import button and modal
- Progress tracking
- Error handling
- Cache updates

---

## Related Documentation

- `docs/CSV_IMPORT_INTEGRATION.md` - Detailed CSV import integration guide
- `docs/EXPORT_TEMPLATES.md` - Export template system documentation
- `docs/IMPORT_EXPORT_MODERNIZATION.md` - CSV modernization summary



