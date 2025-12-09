/**
 * Export utilities for par levels
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { ParLevel } from '../types';

const CSV_HEADERS = ['Ingredient', 'Category', 'Par Level', 'Reorder Point', 'Unit'];

/**
 * Map par level to CSV row format
 *
 * @param {ParLevel} parLevel - Par level to map
 * @returns {Record<string, any>} CSV row object
 */
function mapParLevelToCSVRow(parLevel: ParLevel): Record<string, any> {
  return {
    Ingredient: parLevel.ingredients.ingredient_name || '',
    Category: parLevel.ingredients.category || '',
    'Par Level': parLevel.par_level || 0,
    'Reorder Point': parLevel.reorder_point || 0,
    Unit: parLevel.unit || '',
  };
}

/**
 * Export par levels to CSV
 *
 * @param {ParLevel[]} parLevels - Par levels to export
 */
export function exportParLevelsToCSV(parLevels: ParLevel[]): void {
  if (!parLevels || parLevels.length === 0) {
    return;
  }

  const csvData = parLevels.map(mapParLevelToCSVRow);
  const filename = `par-levels-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Format par levels for HTML/PDF export
 *
 * @param {ParLevel[]} parLevels - Par levels to format
 * @returns {string} HTML content
 */
function formatParLevelsForExport(parLevels: ParLevel[]): string {
  // Group by category
  const parLevelsByCategory = parLevels.reduce(
    (acc, parLevel) => {
      const category = parLevel.ingredients.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(parLevel);
      return acc;
    },
    {} as Record<string, ParLevel[]>,
  );

  return Object.entries(parLevelsByCategory)
    .map(
      ([category, categoryParLevels]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${category}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: rgba(42, 42, 42, 0.5);">
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Ingredient</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Par Level</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Reorder Point</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Unit</th>
            </tr>
          </thead>
          <tbody>
            ${categoryParLevels
              .sort((a, b) =>
                a.ingredients.ingredient_name.localeCompare(b.ingredients.ingredient_name),
              )
              .map(
                parLevel => `
                <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                  <td style="padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${parLevel.ingredients.ingredient_name}</td>
                  <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${parLevel.par_level}</td>
                  <td style="text-align: right; padding: 10px; color: #FF6B00; font-weight: 600;">${parLevel.reorder_point}</td>
                  <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${parLevel.unit}</td>
                </tr>
              `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `,
    )
    .join('');
}

/**
 * Export par levels to HTML
 *
 * @param {ParLevel[]} parLevels - Par levels to export
 */
export function exportParLevelsToHTML(parLevels: ParLevel[]): void {
  if (!parLevels || parLevels.length === 0) {
    return;
  }

  const content = formatParLevelsForExport(parLevels);

  const html = generatePrintTemplate({
    title: 'Par Level Report',
    subtitle: 'Inventory Par Levels',
    content,
    totalItems: parLevels.length,
  });

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `par-levels-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export par levels to PDF (via API)
 *
 * @param {ParLevel[]} parLevels - Par levels to export
 */
export async function exportParLevelsToPDF(parLevels: ParLevel[]): Promise<void> {
  if (!parLevels || parLevels.length === 0) {
    return;
  }

  const content = formatParLevelsForExport(parLevels);

  const response = await fetch('/api/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Par Level Report',
      subtitle: 'Inventory Par Levels',
      content,
      totalItems: parLevels.length,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `par-levels-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
