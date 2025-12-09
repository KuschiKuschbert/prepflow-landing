/**
 * Generate CSV export for menu display using PapaParse for consistent formatting
 */

import { NextResponse } from 'next/server';
import Papa from 'papaparse';

interface MenuDisplayData {
  name: string;
  description?: string;
  price: number;
  category: string;
}

/**
 * Generate CSV export for menu display
 *
 * @param {string} menuName - Menu name
 * @param {MenuDisplayData[]} menuData - Menu items data
 * @returns {NextResponse} CSV response
 */
export function generateCSV(menuName: string, menuData: MenuDisplayData[]): NextResponse {
  const headers = ['Category', 'Item Name', 'Description', 'Price'];

  const csvData = menuData.map(item => ({
    Category: item.category || 'Uncategorized',
    'Item Name': item.name,
    Description: item.description || '',
    Price: `$${item.price.toFixed(2)}`,
  }));

  const csvContent = Papa.unparse(csvData, {
    columns: headers,
    header: true,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  const fullContent = [`Menu Display - ${menuName}`, '', csvContent].join('\n');

  return new NextResponse(fullContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_menu_display.csv"`,
    },
  });
}
