import Papa from 'papaparse';
import { logger } from '@/lib/logger';
import type { ParseCSVOptions, ParseCSVResult } from '../types';

/**
 * Parse CSV text using PapaParse
 *
 * @param {string} csvText - CSV text to parse
 * @param {ParseCSVOptions} options - Parsing options
 * @returns {ParseCSVResult} Parsed data with errors and metadata
 */
export function parseCSV<T = any>(
  csvText: string,
  options: ParseCSVOptions = {},
): ParseCSVResult<T> {
  const config: Papa.ParseConfig = {
    header: options.header ?? true,
    skipEmptyLines: options.skipEmptyLines ?? true,
    transformHeader: options.transformHeader,
    transform: options.transform,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  };

  const result = Papa.parse<T>(csvText, config);

  if (result.errors.length > 0) {
    logger.warn('[CSV Parse] Parse errors:', result.errors);
  }

  return {
    data: result.data,
    errors: result.errors,
    meta: result.meta,
  };
}

