/**
 * Par level CSV import configuration
 * Provides parsing, validation, and template generation for par level imports
 */

import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { mapCSVRowToEntity, normalizeColumnName, parseNumber } from './import-utils';

export interface ParLevelImportRow {
  ingredient_id: string;
  par_level: number;
  reorder_point: number;
  unit: string;
}

/**
 * Parse par levels from CSV text
 */
export function parseParLevelsCSV(csvText: string): ParseCSVResult<ParLevelImportRow> {
  const result = parseCSV<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => normalizeColumnName(header),
  });

  const parLevels: ParLevelImportRow[] = result.data.map(row => {
    const parLevel = mapCSVRowToEntity<ParLevelImportRow>(row, {
      ingredient_id: ['ingredient_id', 'ingredient', 'ingredient id'],
      par_level: ['par_level', 'par level', 'par', 'minimum_level', 'minimum level'],
      reorder_point: [
        'reorder_point',
        'reorder point',
        'reorder',
        'reorder_level',
        'reorder level',
      ],
      unit: ['unit'],
    });

    // Normalize values
    return {
      ingredient_id: String(parLevel.ingredient_id || '').trim(),
      par_level: parseNumber(parLevel.par_level, 0),
      reorder_point: parseNumber(parLevel.reorder_point, 0),
      unit: String(parLevel.unit || '').trim(),
    };
  });

  return {
    ...result,
    data: parLevels,
  };
}

/**
 * Validate par level import row
 */
export function validateParLevel(
  row: ParLevelImportRow,
  _index: number,
): { valid: boolean; error?: string } {
  if (!row.ingredient_id || row.ingredient_id.trim().length === 0) {
    return { valid: false, error: 'Ingredient ID is required' };
  }

  if (row.par_level === undefined || isNaN(row.par_level) || row.par_level < 0) {
    return { valid: false, error: 'Par level must be a non-negative number' };
  }

  if (row.reorder_point === undefined || isNaN(row.reorder_point) || row.reorder_point < 0) {
    return { valid: false, error: 'Reorder point must be a non-negative number' };
  }

  if (!row.unit || row.unit.trim().length === 0) {
    return { valid: false, error: 'Unit is required' };
  }

  return { valid: true };
}

/**
 * Format par level for preview
 */
export function formatParLevelPreview(parLevel: ParLevelImportRow, _index: number): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">Ingredient ID: {parLevel.ingredient_id}</div>
      <div className="text-xs text-gray-400">
        Par Level: {parLevel.par_level} {parLevel.unit} | Reorder Point: {parLevel.reorder_point}{' '}
        {parLevel.unit}
      </div>
    </div>
  );
}

/**
 * Generate par level CSV template
 */
export function generateParLevelTemplate(): string {
  const headers = ['ingredient_id', 'par_level', 'reorder_point', 'unit'];

  const exampleRow = ['abc123', '50', '20', 'kg'];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Par level import configuration
 */
export const parLevelImportConfig: CSVImportConfig<ParLevelImportRow> = {
  entityName: 'Par Level',
  entityNamePlural: 'par levels',
  expectedColumns: ['ingredient_id', 'par_level', 'reorder_point', 'unit'],
  optionalColumns: [],
  parseCSV: parseParLevelsCSV,
  validateEntity: validateParLevel,
  formatEntityForPreview: formatParLevelPreview,
  generateTemplate: generateParLevelTemplate,
  templateFilename: 'par-level-import-template.csv',
  instructions: [
    'First row should contain column headers',
    'Required columns: ingredient_id (or ingredient), par_level (or par level), reorder_point (or reorder point), unit',
    'Par level and reorder point should be numbers',
    'Unit should match the ingredient unit (e.g., kg, g, L, mL)',
  ],
};
