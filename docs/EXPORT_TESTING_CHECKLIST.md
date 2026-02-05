# Export Templates Testing Checklist

## Overview

This document provides a comprehensive testing checklist for all export templates, variants, and UI components in the PrepFlow export system. Use this checklist to ensure all exports work correctly across different browsers and print scenarios.

## Pre-Testing Setup

### Environment Requirements

- [ ] Node.js 22+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Test data populated in database
- [ ] Browser DevTools available for debugging

### Test Browsers

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, macOS)
- [ ] Edge (latest, Windows)

### Test Data Requirements

- [ ] Sample ingredients data
- [ ] Sample recipes with ingredients
- [ ] Sample menu with dishes
- [ ] Sample temperature logs
- [ ] Sample cleaning tasks
- [ ] Sample compliance records
- [ ] Sample order lists
- [ ] Sample prep lists

## Template Variants Testing

### Default Variant

**Test Cases:**

- [ ] Renders with full PrepFlow branding (logo, background elements)
- [ ] Dark theme displays correctly
- [ ] Header includes title and subtitle
- [ ] Footer includes PrepFlow branding
- [ ] Print preview shows correctly
- [ ] Colors render correctly in print preview
- [ ] Page breaks work correctly
- [ ] Content is readable and well-formatted

**Files to Test:**

- Order lists (default)
- Temperature logs (default)
- Cleaning records (default)
- General reports

### Kitchen Variant

**Test Cases:**

- [ ] Minimal branding (no background elements)
- [ ] Compact layout (smaller margins)
- [ ] Checkboxes render correctly
- [ ] Content is scannable
- [ ] Print preview optimized for kitchen use
- [ ] Page breaks don't split important sections
- [ ] Font sizes are readable

**Files to Test:**

- Prep lists (kitchen variant)
- Kitchen checklists
- Quick reference guides

### Customer Variant

**Test Cases:**

- [ ] Polished design (elegant typography)
- [ ] Clean white background
- [ ] Marketing-focused layout
- [ ] Photo-ready appearance
- [ ] Print quality is high
- [ ] Colors print correctly
- [ ] Layout is appealing
- [ ] Professional appearance

**Files to Test:**

- Menus (customer variant)
- Customer-facing documents
- Marketing materials

### Supplier Variant

**Test Cases:**

- [ ] Purchase order format displays correctly
- [ ] Bill To / Ship To sections render
- [ ] Itemized list with quantities and prices
- [ ] Totals section calculates correctly
- [ ] Terms and conditions section displays
- [ ] Formal layout is professional
- [ ] Print preview suitable for business use
- [ ] All supplier information visible

**Files to Test:**

- Order lists (supplier variant)
- Purchase orders
- Supplier communications

### Compliance Variant

**Test Cases:**

- [ ] Audit-ready formal layout
- [ ] Detailed tables render correctly
- [ ] Compliance status indicators visible
- [ ] Summary sections display
- [ ] Black borders print correctly
- [ ] Professional appearance
- [ ] Suitable for health inspector review
- [ ] All compliance data visible

**Files to Test:**

- Compliance reports
- Health inspector reports
- Temperature logs (compliance variant)
- Cleaning records (compliance variant)

### Compact Variant

**Test Cases:**

- [ ] Compact layout (minimal spacing)
- [ ] Maximum content per page
- [ ] Still readable despite density
- [ ] Print preview shows all content
- [ ] Page breaks optimized
- [ ] Font sizes appropriate

**Files to Test:**

- Quick reference guides
- Dense data tables
- Space-constrained documents

## Export Format Testing

### CSV Export

**Test Cases:**

- [ ] CSV file downloads correctly
- [ ] File name is correct and descriptive
- [ ] Headers are included
- [ ] All data rows are included
- [ ] Special characters are escaped correctly
- [ ] Commas in data are handled correctly
- [ ] Quotes in data are escaped correctly
- [ ] Numbers format correctly
- [ ] Dates format correctly
- [ ] Empty values handled correctly
- [ ] CSV opens correctly in Excel
- [ ] CSV opens correctly in Google Sheets
- [ ] CSV opens correctly in text editors

**Files to Test:**

- Order lists CSV
- Temperature logs CSV
- Cleaning records CSV
- Compliance records CSV
- Ingredients CSV
- Recipes CSV

### HTML Export

**Test Cases:**

- [ ] HTML file downloads correctly
- [ ] File name is correct
- [ ] HTML structure is valid
- [ ] Styles are included
- [ ] Content renders correctly when opened
- [ ] Images load correctly (if any)
- [ ] Links work correctly (if any)
- [ ] Print preview works from HTML file
- [ ] All variants render correctly in HTML

**Files to Test:**

- Order lists HTML
- Temperature logs HTML
- Cleaning records HTML
- Compliance reports HTML
- Menus HTML
- Prep lists HTML

### PDF Export (Server-Side)

**Test Cases:**

- [ ] Export button triggers download directly
- [ ] No print dialog appears
- [ ] File downloads with correct name and .pdf extension
- [ ] File size is reasonable (not empty)
- [ ] Opens correctly in PDF viewer
- [ ] Layout matches print template
- [ ] Background graphics are included
- [ ] Text is selectable (not an image)
- [ ] Links are clickable (if any)
- [ ] Admin permissions work (bypasses tier check)
- [ ] Non-admin checks work (enforces tier check)

**Files to Test:**

- `generate-pdf.ts` (unit test)
- Order lists PDF
- Temperature logs PDF
- Cleaning records PDF
- Compliance reports PDF
- Menus PDF
- Prep lists PDF
- Recipes PDF

**Files to Test:**

- Order lists PDF
- Temperature logs PDF
- Cleaning records PDF
- Compliance reports PDF
- Menus PDF
- Prep lists PDF
- Recipes PDF

## UI Component Testing

### ExportButton Component

**Test Cases:**

- [ ] Button renders correctly
- [ ] Dropdown opens on click
- [ ] Format options display correctly
- [ ] Icons display correctly
- [ ] Loading state shows during export
- [ ] Disabled state works correctly
- [ ] Click outside closes dropdown
- [ ] Escape key closes dropdown
- [ ] Keyboard navigation works
- [ ] Accessible (ARIA labels)
- [ ] Mobile responsive
- [ ] All variants work correctly

**Test Locations:**

- Order lists page
- Temperature logs page
- Cleaning records page
- Compliance page
- Menu builder page

### PrintButton Component

**Test Cases:**

- [ ] Button renders correctly
- [ ] Click opens print dialog
- [ ] Loading state shows during print
- [ ] Disabled state works correctly
- [ ] Accessible (ARIA labels)
- [ ] Mobile responsive
- [ ] Icon displays correctly

**Test Locations:**

- Order lists page
- Temperature logs page
- Cleaning records page
- Recipes page
- Prep lists page

### ExportOptionsModal Component

**Test Cases:**

- [ ] Modal opens correctly
- [ ] Modal closes on backdrop click
- [ ] Modal closes on Escape key
- [ ] Format selection works
- [ ] Variant selection works
- [ ] Filter selection works (if applicable)
- [ ] Loading state shows during export
- [ ] Export button triggers export
- [ ] Cancel button closes modal
- [ ] Focus trap works correctly
- [ ] Keyboard navigation works
- [ ] Accessible (ARIA labels)
- [ ] Mobile responsive
- [ ] All variants display correctly

**Test Locations:**

- Menu builder (if integrated)
- Complex export scenarios

## Integration Testing

### Order Lists Export

**Test Cases:**

- [ ] Export button appears on order lists page
- [ ] Print button appears on order lists page
- [ ] CSV export works
- [ ] HTML export works
- [ ] PDF export works
- [ ] Default variant works
- [ ] Supplier variant works
- [ ] All data exports correctly
- [ ] Grouped ingredients export correctly
- [ ] Sorting preserved in export

**Test File:** `app/webapp/order-lists/components/MenuIngredientsTable.tsx`

### Temperature Logs Export

**Test Cases:**

- [ ] Export button appears on temperature logs tab
- [ ] Print button appears on temperature logs tab
- [ ] CSV export includes all logs
- [ ] HTML export includes all logs
- [ ] PDF export includes all logs
- [ ] Default variant works
- [ ] Compliance variant works
- [ ] Equipment information included
- [ ] Compliance status displayed correctly
- [ ] Date ranges work correctly

**Test File:** `app/webapp/temperature/components/TemperatureLogsTab.tsx`

### Cleaning Records Export

**Test Cases:**

- [ ] Export button appears on cleaning page
- [ ] Print button appears on cleaning page
- [ ] CSV export works
- [ ] HTML export works
- [ ] PDF export works
- [ ] Default variant works
- [ ] Compliance variant works
- [ ] Grid layout exports correctly
- [ ] Task status indicators visible
- [ ] Date ranges work correctly

**Test File:** `app/webapp/cleaning/page.tsx`

### Compliance Reports Export

**Test Cases:**

- [ ] Compliance report export function works
- [ ] Combines compliance records, temperature logs, cleaning records
- [ ] Compliance variant renders correctly
- [ ] All sections display correctly
- [ ] Summary section accurate
- [ ] Tables formatted correctly
- [ ] Print preview suitable for audit

**Test Files:**

- `app/webapp/compliance/utils/complianceReportExportUtils.ts`
- `app/webapp/compliance/utils/formatComplianceReportForPrint.ts`

### Prep Lists Export

**Test Cases:**

- [ ] Print button works on prep lists
- [ ] Kitchen variant works
- [ ] Default variant works
- [ ] Checkboxes render in kitchen variant
- [ ] Ingredients list exports correctly
- [ ] Instructions export correctly
- [ ] Prep techniques export correctly

**Test Files:**

- `app/webapp/prep-lists/utils/printUtils.ts`
- `app/webapp/prep-lists/utils/formatPrepList.ts`

### Recipes Export

**Test Cases:**

- [ ] Recipe print function works
- [ ] Recipe PDF generation works
- [ ] Ingredients list exports correctly
- [ ] Instructions export correctly
- [ ] Cost breakdown exports correctly
- [ ] Recipe card styling consistent

**Test Files:**

- `app/webapp/recipes/utils/printRecipe.ts`
- `app/api/recipe-share/helpers/generateRecipePDF.ts`

### Menus Export

**Test Cases:**

- [ ] Menu export options work
- [ ] Customer variant works
- [ ] Default variant works
- [ ] Menu display exports correctly
- [ ] Allergen matrix exports correctly
- [ ] Recipe cards export correctly
- [ ] Combined exports work

**Test Files:**

- `app/webapp/menu-builder/utils/menuPrintUtils.ts`
- `app/api/menus/[id]/menu-display/export/helpers/generateHTML.ts`

## Browser-Specific Testing

### Chrome/Chromium

**Test Cases:**

- [ ] All exports work correctly
- [ ] Print preview displays correctly
- [ ] Print to PDF works
- [ ] Colors render correctly
- [ ] Fonts render correctly
- [ ] Page breaks work correctly
- [ ] No console errors

### Firefox

**Test Cases:**

- [ ] All exports work correctly
- [ ] Print preview displays correctly
- [ ] Print to PDF works
- [ ] Colors render correctly
- [ ] Fonts render correctly
- [ ] Page breaks work correctly
- [ ] No console errors

### Safari

**Test Cases:**

- [ ] All exports work correctly
- [ ] Print preview displays correctly
- [ ] Print to PDF works
- [ ] Colors render correctly
- [ ] Fonts render correctly
- [ ] Page breaks work correctly
- [ ] No console errors
- [ ] Safe area insets work correctly (iOS)

### Edge

**Test Cases:**

- [ ] All exports work correctly
- [ ] Print preview displays correctly
- [ ] Print to PDF works
- [ ] Colors render correctly
- [ ] Fonts render correctly
- [ ] Page breaks work correctly
- [ ] No console errors

## Print-Specific Testing

### Print Preview

**Test Cases:**

- [ ] All variants preview correctly
- [ ] Layout is correct
- [ ] Margins are appropriate
- [ ] Page breaks are logical
- [ ] Colors are visible (or grayscale appropriate)
- [ ] Fonts are readable
- [ ] Content fits on pages
- [ ] Headers/footers display correctly

### Print Settings

**Test Cases:**

- [ ] Portrait orientation works
- [ ] Landscape orientation works (if applicable)
- [ ] A4 paper size works
- [ ] Letter paper size works
- [ ] Margins adjustable
- [ ] Background graphics toggle works
- [ ] Headers/footers toggle works

### Print to PDF

**Test Cases:**

- [ ] PDF file created successfully
- [ ] PDF file size is reasonable
- [ ] PDF opens correctly
- [ ] PDF is readable
- [ ] PDF pages are correct
- [ ] PDF metadata is correct
- [ ] PDF is searchable (if applicable)

## Accessibility Testing

### Screen Reader Testing

**Test Cases:**

- [ ] Export buttons are announced correctly
- [ ] Print buttons are announced correctly
- [ ] Modal dialogs are announced correctly
- [ ] Format options are navigable
- [ ] Variant options are navigable
- [ ] Loading states are announced
- [ ] Error messages are announced

**Tools:**

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

### Keyboard Navigation

**Test Cases:**

- [ ] Tab navigation works
- [ ] Shift+Tab navigation works
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate options
- [ ] Focus indicators visible
- [ ] Focus trap in modals works

### Color Contrast

**Test Cases:**

- [ ] Text meets WCAG AA contrast (4.5:1)
- [ ] Interactive elements meet contrast requirements
- [ ] Print versions maintain contrast
- [ ] Grayscale versions are readable

**Tools:**

- Browser DevTools contrast checker
- WebAIM Contrast Checker

## Performance Testing

### Export Performance

**Test Cases:**

- [ ] CSV export completes quickly (< 1 second for 1000 rows)
- [ ] HTML export completes quickly (< 2 seconds)
- [ ] Print dialog opens quickly (< 500ms)
- [ ] Large datasets export correctly
- [ ] No memory leaks during exports
- [ ] Browser doesn't freeze during export

### Print Performance

**Test Cases:**

- [ ] Print preview loads quickly
- [ ] Large documents print correctly
- [ ] Multiple pages render correctly
- [ ] No performance degradation with many items

## Error Handling Testing

### Error Scenarios

**Test Cases:**

- [ ] Empty data exports gracefully
- [ ] Missing data handles correctly
- [ ] Network errors show user-friendly messages
- [ ] Invalid data formats handled
- [ ] Print dialog blocked shows message
- [ ] Export cancellation works
- [ ] Error messages are clear and actionable

## Mobile Testing

### Mobile Export

**Test Cases:**

- [ ] Export buttons work on mobile
- [ ] Print buttons work on mobile
- [ ] Dropdowns work on touch
- [ ] Modals work on mobile
- [ ] Print preview works on mobile
- [ ] PDF generation works on mobile
- [ ] File downloads work on mobile

### Mobile Print

**Test Cases:**

- [ ] Print preview displays correctly
- [ ] Layout is readable on small screens
- [ ] Touch interactions work
- [ ] Safe area insets respected (iOS)

## Regression Testing

### Previous Issues

**Test Cases:**

- [ ] All previously fixed issues remain fixed
- [ ] No new issues introduced
- [ ] Performance hasn't degraded
- [ ] Styling consistency maintained

## Test Execution Log

### Test Session Template

```
Date: ___________
Tester: ___________
Browser: ___________
Version: ___________

Variant Tested: ___________
Format Tested: ___________
Feature Tested: ___________

Results:
- Pass: ___________
- Fail: ___________
- Notes: ___________

Issues Found:
1. ___________
2. ___________
3. ___________
```

## Automated Testing

### Unit Tests

**Test Files:**

- `__tests__/exports/template-utils.test.ts` - Template utility functions
- `__tests__/exports/template-generation.test.ts` - Template generation
- `__tests__/exports/formatting-functions.test.ts` - Content formatting functions

**Test Helpers:**

- `lib/exports/test-helpers.ts` - Test utilities and validation functions

**Run Tests:**

```bash
npm test __tests__/exports/
npm test -- --coverage __tests__/exports/
```

**Coverage:**

- [x] Template generation functions
- [x] Formatting functions
- [x] Utility functions (dates, currency, variants)
- [x] Variant validation
- [x] HTML structure validation

### Integration Tests

**Status:** Manual testing required

- [ ] Export flow end-to-end
- [ ] Print flow end-to-end
- [ ] Variant selection
- [ ] Filter application

### E2E Tests

**Status:** Can be added to existing E2E suite (`e2e/system-audit.spec.ts`)

- [ ] Export button click → export completes
- [ ] Print button click → print dialog opens
- [ ] Modal export → export completes
- [ ] CSV download → file correct
- [ ] HTML download → file correct
- [ ] PDF generation → file correct

## Sign-Off Checklist

- [ ] All variants tested
- [ ] All formats tested
- [ ] All browsers tested
- [ ] All components tested
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Error handling verified
- [ ] Mobile tested
- [ ] Documentation reviewed
- [ ] Issues logged and resolved

## Known Issues

Document any known issues or limitations here:

1. ***
2. ***
3. ***

## Test Results Summary

**Overall Status:** [ ] Pass [ ] Fail [ ] Partial

**Critical Issues:** \***\*\_\_\_\*\***

**Minor Issues:** \***\*\_\_\_\*\***

**Recommendations:** \***\*\_\_\_\*\***

---

**Last Updated:** \***\*\_\_\_\*\***
**Tested By:** \***\*\_\_\_\*\***
**Approved By:** \***\*\_\_\_\*\***
