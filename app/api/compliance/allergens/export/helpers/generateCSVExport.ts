/**
 * CSV export generator for allergen overview
 */

import { NextResponse } from 'next/server';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';
import type { AllergenExportItem } from './fetchAllergenExportData';

/**
 * Generates CSV export for allergen overview
 *
 * @param {AllergenExportItem[]} items - Items to export
 * @returns {NextResponse} CSV file response
 */
export function generateCSVExport(items: AllergenExportItem[]): NextResponse {
  const headers = ['Item Name', 'Type', 'Menus', ...AUSTRALIAN_ALLERGENS.map(a => a.displayName)];

  const rows = items.map(item => {
    const allergenColumns = AUSTRALIAN_ALLERGENS.map(allergen =>
      item.allergens.includes(allergen.code) ? 'Yes' : '',
    );
    const menuNames = item.menus.map(m => m.menu_name).join('; ') || 'None';
    return [item.name, item.type, menuNames, ...allergenColumns];
  });

  const csvContent = [
    'Compliance Allergen Overview',
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="allergen_overview.csv"',
    },
  });
}
