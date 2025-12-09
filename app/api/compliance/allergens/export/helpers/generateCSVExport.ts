/**
 * CSV export generator for allergen overview using PapaParse for consistent formatting
 */

import { NextResponse } from 'next/server';
import Papa from 'papaparse';
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

  const csvData = items.map(item => {
    const allergenColumns: Record<string, string> = {};
    AUSTRALIAN_ALLERGENS.forEach(allergen => {
      allergenColumns[allergen.displayName] = item.allergens.includes(allergen.code) ? 'Yes' : '';
    });
    const menuNames = item.menus.map(m => m.menu_name).join('; ') || 'None';

    return {
      'Item Name': item.name,
      Type: item.type,
      Menus: menuNames,
      ...allergenColumns,
    };
  });

  const csvContent = Papa.unparse(csvData, {
    columns: headers,
    header: true,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  const fullContent = ['Compliance Allergen Overview', '', csvContent].join('\n');

  return new NextResponse(fullContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': 'attachment; filename="allergen_overview.csv"',
    },
  });
}
