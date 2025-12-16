# Export Templates System Documentation

## Overview

PrepFlow uses a unified export and print template system that provides consistent branding, formatting, and styling across all export formats (CSV, HTML, PDF). The system supports multiple template variants optimized for different use cases, from kitchen prep lists to customer-facing menus to audit-ready compliance reports.

## Architecture

### Core Components

1. **Template System** (`lib/exports/print-template.ts`)
   - `generatePrintTemplate()` - Generates complete HTML document with Cyber Carrot branding
   - `printWithTemplate()` - Opens print dialog with unified template
   - Supports 6 template variants: `default`, `kitchen`, `customer`, `supplier`, `compliance`, `compact`

2. **Style System** (`lib/exports/template-styles.ts`)
   - `getAllTemplateStyles()` - Returns complete CSS for selected variant
   - Variant-specific style functions: `getKitchenVariantCSS()`, `getCustomerVariantCSS()`, etc.
   - Base styles, background elements, content wrapper, header, footer, print media queries

3. **Template Utilities** (`lib/exports/template-utils.ts`)
   - `formatDateAustralian()` - Australian date formatting
   - `formatCurrency()` - AUD currency formatting
   - `formatDateRange()` - Date range formatting
   - `getRecommendedVariant()` - Smart variant selection based on content type
   - `getVariantDisplayName()` - Human-readable variant names
   - `getVariantDescription()` - Variant descriptions for UI

4. **UI Components**
   - `ExportButton` - Dropdown button with format selection (CSV, HTML, PDF)
   - `PrintButton` - Simple print button
   - `ExportOptionsModal` - Modal for complex exports with format, variant, and filter selection

## Template Variants

### Default Variant

**Use Case:** Standard exports with full PrepFlow branding

**Features:**

- Full Cyber Carrot branding (logo, background elements, gradients)
- Dark theme with accent colors
- Professional footer with PrepFlow branding
- Suitable for internal documentation

**When to Use:**

- General exports
- Internal reports
- Default choice when no specific variant is needed

**Example:**

```typescript
printWithTemplate({
  title: 'Order List',
  subtitle: 'Weekly Order',
  content: htmlContent,
  variant: 'default', // or omit for default
});
```

### Kitchen Variant

**Use Case:** Kitchen prep lists and operational documents

**Features:**

- Minimal branding (no background elements, smaller header)
- Compact layout (smaller margins, tighter spacing)
- Checkboxes for marking off items
- Optimized for quick scanning and marking

**When to Use:**

- Prep lists for kitchen staff
- Operational checklists
- Quick reference documents

**Example:**

```typescript
printWithTemplate({
  title: 'Prep List',
  subtitle: 'Morning Prep',
  content: htmlContent,
  variant: 'kitchen',
});
```

### Customer Variant

**Use Case:** Customer-facing menus and marketing materials

**Features:**

- Polished design (elegant serif typography)
- Marketing-focused layout (appealing, appetizing)
- Photo-ready (high quality, professional appearance)
- Clean white background with subtle shadows
- Better visual hierarchy for menu items

**When to Use:**

- Customer menus
- Marketing materials
- Photo-ready documents
- Public-facing content

**Example:**

```typescript
printWithTemplate({
  title: 'Menu',
  subtitle: 'Spring Menu 2025',
  content: htmlContent,
  variant: 'customer',
});
```

### Supplier Variant

**Use Case:** Purchase orders and supplier communications

**Features:**

- Purchase order format (formal layout)
- Supplier details section (Bill To / Ship To)
- Itemized list with quantities, unit prices, totals
- Terms and conditions section
- Professional appearance suitable for business use

**When to Use:**

- Purchase orders
- Supplier order lists
- Business-to-business communications
- Formal order documents

**Example:**

```typescript
printWithTemplate({
  title: 'Purchase Order',
  subtitle: 'Weekly Order',
  content: htmlContent,
  variant: 'supplier',
  customMeta: 'PO: PO-20250115',
});
```

### Compliance Variant

**Use Case:** Audit-ready compliance reports and health inspector reports

**Features:**

- Audit-ready formal layout
- Detailed tables with compliance status
- Summary sections
- Professional appearance suitable for inspections
- Black borders and formal typography

**When to Use:**

- Compliance reports
- Health inspector reports
- Audit documentation
- Regulatory submissions

**Example:**

```typescript
printWithTemplate({
  title: 'Compliance Report',
  subtitle: 'Q1 2025',
  content: htmlContent,
  variant: 'compliance',
});
```

### Compact Variant

**Use Case:** Space-efficient documents with minimal spacing

**Features:**

- Compact layout (minimal margins, tight spacing)
- Minimal branding
- Optimized for maximum content per page
- Smaller fonts and reduced padding

**When to Use:**

- Space-constrained documents
- Dense data tables
- Quick reference guides
- When maximum content per page is needed

**Example:**

```typescript
printWithTemplate({
  title: 'Quick Reference',
  subtitle: 'Ingredient List',
  content: htmlContent,
  variant: 'compact',
});
```

## Usage Examples

### Basic Export with Default Variant

```typescript
import { printWithTemplate } from '@/lib/exports/print-template';
import { formatOrderListForPrint } from './formatOrderListForPrint';
import { getOrderListPrintStyles } from './orderListPrintStyles';

function printOrderList(data: OrderListData) {
  const contentHtml = formatOrderListForPrint(data);
  const styles = getOrderListPrintStyles();

  printWithTemplate({
    title: 'Order List',
    subtitle: data.menuName,
    content: `<style>${styles}</style>${contentHtml}`,
    totalItems: Object.values(data.groupedIngredients).flat().length,
  });
}
```

### Export with Variant Selection

```typescript
import { printWithTemplate } from '@/lib/exports/print-template';
import { getRecommendedVariant } from '@/lib/exports/template-utils';

function printMenu(menu: Menu, variant?: TemplateVariant) {
  const contentHtml = formatMenuForPrint(menu);
  const styles = getMenuPrintStyles(variant || 'default');
  const recommendedVariant = variant || getRecommendedVariant('menu', { isCustomerFacing: true });

  printWithTemplate({
    title: menu.menu_name,
    subtitle: menu.description || 'Menu',
    content: `<style>${styles}</style>${contentHtml}`,
    variant: recommendedVariant,
  });
}
```

### Using ExportButton Component

```typescript
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';

function MyComponent() {
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setExportLoading(format);
    try {
      if (format === 'csv') {
        exportToCSV(data);
      } else if (format === 'pdf' || format === 'html') {
        printWithTemplate({ /* ... */ });
      }
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <ExportButton
      onExport={handleExport}
      loading={exportLoading}
      availableFormats={['csv', 'pdf', 'html']}
    />
  );
}
```

### Using ExportOptionsModal Component

```typescript
import { ExportOptionsModal } from '@/components/ui/ExportOptionsModal';
import type { TemplateVariant } from '@/lib/exports/template-utils';

function MyComponent() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async (options: {
    format: ExportFormat;
    variant?: TemplateVariant;
    filters?: Record<string, any>;
  }) => {
    setExportLoading(true);
    try {
      // Use options.format, options.variant, options.filters
      await performExport(options);
      setShowExportModal(false);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowExportModal(true)}>Export</button>
      <ExportOptionsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        loading={exportLoading}
        title="Export Order List"
        availableFormats={['csv', 'pdf', 'html']}
        availableVariants={['default', 'supplier']}
        filters={[
          {
            id: 'dateRange',
            label: 'Date Range',
            type: 'select',
            options: [
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ],
          },
        ]}
      />
    </>
  );
}
```

## Format-Specific Guidelines

### CSV Export

- Use `exportToCSV()` from `lib/csv/csv-utils.ts`
- Flatten nested data structures
- Include all relevant columns
- Use consistent header naming
- Proper escaping of special characters (handled automatically)

**Example:**

```typescript
import { exportToCSV } from '@/lib/csv/csv-utils';

const csvData = items.map(item => ({
  'Item Name': item.name,
  Price: item.price,
  Category: item.category,
}));

exportToCSV(csvData, Object.keys(csvData[0]), 'export.csv');
```

### HTML Export

- Generate HTML using formatting functions
- Include styles inline or via `<style>` tag
- Use unified template for consistent branding
- Optimize for print media queries

**Example:**

```typescript
const html = generatePrintTemplate({
  title: 'Report',
  content: `<style>${styles}</style>${contentHtml}`,
  variant: 'default',
});

// Download as HTML file
const blob = new Blob([html], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'report.html';
a.click();
```

### PDF Export

- Use browser's print dialog (Print to PDF)
- Ensure print media queries are optimized
- Test print preview before finalizing
- Consider page breaks and margins

**Example:**

```typescript
// PDF is handled via print dialog
printWithTemplate({
  title: 'Report',
  content: htmlContent,
  variant: 'compliance',
});
// User selects "Print to PDF" in browser print dialog
```

## Best Practices

### 1. Content Formatting

- Use dedicated formatting functions (`formatOrderListForPrint`, `formatTemperatureLogsForPrint`, etc.)
- Separate content generation from styling
- Escape HTML content using `escapeHtml()` utility
- Use semantic HTML structure

### 2. Style Management

- Create variant-specific style functions (`getOrderListPrintStyles`, `getMenuPrintStyles`, etc.)
- Include print media queries for optimal printing
- Use Cyber Carrot color palette consistently
- Test print preview in multiple browsers

### 3. Variant Selection

- Use `getRecommendedVariant()` for smart default selection
- Allow users to override variant when needed
- Document variant choices in component props
- Consider use case (customer-facing vs. internal vs. kitchen)

### 4. Performance

- Lazy load heavy formatting functions
- Cache formatted content when possible
- Optimize print styles for fast rendering
- Minimize inline styles (use CSS classes)

### 5. Accessibility

- Use semantic HTML elements
- Include proper ARIA labels
- Ensure sufficient color contrast
- Test with screen readers

## File Structure

```
lib/exports/
├── print-template.ts          # Core template generation
├── template-styles.ts          # Variant styles and base CSS
├── template-utils.ts          # Utility functions (dates, currency, variants)
└── export-template.ts         # Server-side export wrapper

components/ui/
├── ExportButton.tsx           # Dropdown export button
├── PrintButton.tsx            # Simple print button
└── ExportOptionsModal.tsx     # Complex export options modal

app/webapp/[feature]/utils/
├── format[Feature]ForPrint.ts    # Content formatting
├── [feature]PrintStyles.ts       # Feature-specific styles
└── [feature]ExportUtils.ts        # Export functions
```

## Variant Selection Guide

| Content Type       | Recommended Variant | Use Case                                 |
| ------------------ | ------------------- | ---------------------------------------- |
| Prep Lists         | `kitchen`           | Kitchen staff use, checkboxes needed     |
| Menus              | `customer`          | Customer-facing, marketing materials     |
| Order Lists        | `supplier`          | Purchase orders, supplier communications |
| Compliance Reports | `compliance`        | Audit-ready, formal documentation        |
| Temperature Logs   | `compliance`        | Health inspector reports                 |
| Cleaning Records   | `compliance`        | Audit documentation                      |
| Quick Reference    | `compact`           | Space-efficient, dense content           |
| General Reports    | `default`           | Internal documentation                   |

## Component Integration

### ExportButton Integration

```typescript
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';

<ExportButton
  onExport={handleExport}
  loading={exportLoading}
  availableFormats={['csv', 'pdf', 'html']}
  label="Export"
  variant="primary"
  size="md"
/>
```

### PrintButton Integration

```typescript
import { PrintButton } from '@/components/ui/PrintButton';

<PrintButton
  onClick={handlePrint}
  loading={printLoading}
  label="Print"
  variant="primary"
  size="md"
/>
```

### ExportOptionsModal Integration

```typescript
import { ExportOptionsModal } from '@/components/ui/ExportOptionsModal';

<ExportOptionsModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onExport={handleExport}
  loading={exportLoading}
  title="Export Options"
  availableFormats={['csv', 'pdf', 'html']}
  availableVariants={['default', 'customer', 'supplier']}
  filters={[
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'select',
      options: [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
      ],
    },
  ]}
/>
```

## Testing Checklist

- [ ] Test all variants render correctly
- [ ] Verify print preview in Chrome, Firefox, Safari
- [ ] Check CSV export formatting
- [ ] Validate HTML export structure
- [ ] Test PDF generation via print dialog
- [ ] Verify responsive design for print
- [ ] Check color contrast for accessibility
- [ ] Test with screen readers
- [ ] Validate page breaks and margins
- [ ] Test with large datasets

## Troubleshooting

### Print Dialog Not Opening

- Check browser popup blocker settings
- Verify `window.open()` is not blocked
- Use user gesture (button click) to trigger print

### Styles Not Applying

- Ensure styles are included in `<style>` tag
- Check print media queries are present
- Verify variant is correctly passed to template

### CSV Export Issues

- Check data structure matches headers
- Verify special characters are escaped
- Test with various data types (numbers, dates, text)

### Variant Not Working

- Verify variant name matches exactly (`'kitchen'` not `'Kitchen'`)
- Check variant is supported in `getAllTemplateStyles()`
- Ensure variant-specific styles are included

## Related Documentation

- `docs/IMPORT_EXPORT_MODERNIZATION.md` - CSV import/export modernization
- `lib/exports/print-template.ts` - Template system source code
- `lib/exports/template-styles.ts` - Style system source code
- `lib/exports/template-utils.ts` - Utility functions source code

## Support

For issues or questions about the export template system:

1. Check this documentation
2. Review source code in `lib/exports/`
3. Check component examples in `components/ui/`
4. Refer to existing implementations in `app/webapp/[feature]/utils/`




