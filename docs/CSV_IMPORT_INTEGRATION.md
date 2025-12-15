# CSV Import Integration Guide

This guide explains how to add standardized CSV import functionality to any page in the PrepFlow webapp.

## Overview

The standardized CSV import system consists of:

1. **CSVImportModal Component** (`components/ui/CSVImportModal.tsx`) - Reusable modal component
2. **Import Configurations** (`lib/imports/*-import.ts`) - Entity-specific parsing and validation
3. **Import Utilities** (`lib/imports/import-utils.ts`) - Shared parsing helpers

## Available Import Configurations

- ✅ **Suppliers** - `lib/imports/supplier-import.ts` (implemented in Suppliers page)
- 📋 **Recipes** - `lib/imports/recipe-import.ts`
- 📋 **Temperature Logs** - `lib/imports/temperature-import.ts`
- 📋 **Compliance Records** - `lib/imports/compliance-import.ts`
- 📋 **Order List Items** - `lib/imports/order-list-import.ts`
- 📋 **Par Levels** - `lib/imports/par-level-import.ts`

## Integration Steps

### 1. Import Required Components and Config

```typescript
import { ImportButton } from '@/components/ui/ImportButton';
import { CSVImportModal } from '@/components/ui/CSVImportModal';
import { supplierImportConfig, type SupplierImportRow } from '@/lib/imports/supplier-import';
import type { ImportProgressState } from '@/components/ui/ImportProgress';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';
```

### 2. Add State Management

```typescript
const [showImportModal, setShowImportModal] = useState(false);
const [importLoading, setImportLoading] = useState(false);
const [importProgress, setImportProgress] = useState<ImportProgressState | undefined>(undefined);
const { showSuccess, showError } = useNotification();
```

### 3. Create Import Handler

```typescript
const handleImport = useCallback(
  async (importRows: SupplierImportRow[]) => {
    if (importRows.length === 0) {
      showError('No suppliers to import');
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
          currentItem: row.name, // Use appropriate field for current item
          isComplete: false,
          errors,
        });

        try {
          // Map import row to API format
          const itemData = {
            // Map fields according to your API requirements
            supplier_name: row.name,
            // ... other fields
          };

          const response = await fetch('/api/suppliers', {
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

      // Close modal after delay
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
```

### 4. Add Import Button to UI

```typescript
<ImportButton onClick={() => setShowImportModal(true)} />
```

### 5. Add Import Modal to Component Tree

```typescript
<CSVImportModal
  isOpen={showImportModal}
  onClose={() => {
    setShowImportModal(false);
    setImportProgress(undefined);
  }}
  onImport={handleImport}
  config={supplierImportConfig} // Use appropriate config
  loading={importLoading}
  progress={importProgress}
/>
```

## Example: Suppliers Page Implementation

See `app/webapp/suppliers/page.tsx` for a complete working example.

## Creating New Import Configurations

If you need to create a new import configuration for a different entity type:

1. Create a new file in `lib/imports/` (e.g., `lib/imports/my-entity-import.ts`)
2. Define the import row interface
3. Implement parsing function
4. Implement validation function
5. Implement preview formatting function
6. Implement template generation function
7. Export the configuration object

See existing configurations for reference patterns.

## Features

- ✅ **Flexible Column Matching** - Handles variations in column names (e.g., "name" vs "Name" vs "supplier_name")
- ✅ **Validation** - Validates data before import
- ✅ **Preview** - Shows parsed data before import
- ✅ **Progress Tracking** - Real-time progress with success/failure counts
- ✅ **Error Reporting** - Detailed error messages per row
- ✅ **Template Download** - Users can download CSV templates
- ✅ **Cyber Carrot Styling** - Consistent with PrepFlow design system
- ✅ **PrepFlow Voice** - User-friendly error messages and instructions

## Best Practices

1. **Always validate** - Use the validation function in your import config
2. **Show progress** - Update progress state during import loop
3. **Handle errors gracefully** - Collect errors and show them to the user
4. **Update cache** - Cache imported data for instant display
5. **Use optimistic updates** - Consider optimistic UI updates for better UX
6. **Provide feedback** - Show success/error notifications

## Testing

1. Test with valid CSV files
2. Test with invalid CSV files (missing columns, wrong types)
3. Test with empty CSV files
4. Test template download
5. Test import cancellation
6. Test error handling

