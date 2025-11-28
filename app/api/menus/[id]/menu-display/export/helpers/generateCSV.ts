/**
 * Generate CSV export for menu display
 */

import { NextResponse } from 'next/server';

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

  const rows = menuData.map(item => [
    item.category || 'Uncategorized',
    item.name,
    item.description || '',
    `$${item.price.toFixed(2)}`,
  ]);

  const csvContent = [
    `Menu Display - ${menuName}`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_menu_display.csv"`,
    },
  });
}
