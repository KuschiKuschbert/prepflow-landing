/**
 * Export utilities for par levels
 * Supports CSV, PDF, HTML export formats
 */
import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import { downloadFile } from './exportParLevels/helpers/downloadFile';
import { formatParLevelsForExport } from './exportParLevels/helpers/formatParLevelsForExport';
import { mapParLevelToCSVRow } from './exportParLevels/helpers/mapParLevelToCSVRow';
import type { ParLevel } from '../types';

const CSV_HEADERS = ['Ingredient', 'Category', 'Par Level', 'Reorder Point', 'Unit'];

export function exportParLevelsToCSV(parLevels: ParLevel[]): void {
  if (!parLevels || parLevels.length === 0) return;
  const csvData = parLevels.map(mapParLevelToCSVRow);
  const filename = `par-levels-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}


export function exportParLevelsToHTML(parLevels: ParLevel[]): void {
  if (!parLevels || parLevels.length === 0) return;
  const content = formatParLevelsForExport(parLevels);
  const html = generatePrintTemplate({
    title: 'Par Level Report',
    subtitle: 'Inventory Par Levels',
    content,
    totalItems: parLevels.length,
  });
  downloadFile(new Blob([html], { type: 'text/html' }), `par-levels-${new Date().toISOString().split('T')[0]}.html`);
}

export async function exportParLevelsToPDF(parLevels: ParLevel[]): Promise<void> {
  if (!parLevels || parLevels.length === 0) return;
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
  if (!response.ok) throw new Error('Failed to generate PDF');
  downloadFile(await response.blob(), `par-levels-${new Date().toISOString().split('T')[0]}.pdf`);
}
