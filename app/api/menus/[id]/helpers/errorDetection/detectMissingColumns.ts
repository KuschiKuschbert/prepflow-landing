/**
 * Error detection helpers for missing columns
 */

import { extractColumnName } from '../fetchMenuWithItems.helpers';

export interface ColumnErrorInfo {
  isMissingPricing: boolean;
  isMissingDietary: boolean;
  isMissingDescription: boolean;
  isColumnNotFound: boolean;
  columnName: string | null;
}

/**
 * Detects which columns are missing from an error
 *
 * @param {unknown} error - Supabase error
 * @returns {ColumnErrorInfo} Information about missing columns
 */
export function detectMissingColumns(error: unknown): ColumnErrorInfo {
  if (!error || typeof error !== 'object') {
    return {
      isMissingPricing: false,
      isMissingDietary: false,
      isMissingDescription: false,
      isColumnNotFound: false,
      columnName: null,
    };
  }

  const err = error as { code?: string; message?: string; details?: string; hint?: string };
  const errorCode = err.code || '';
  const errorMessage = err.message || '';
  const errorDetails = err.details || '';
  /* Removed duplicate declarations */
  const errorHint = err.hint || '';
  const fullErrorText = `${errorMessage} ${errorDetails} ${errorHint}`.toLowerCase();

  const isColumnNotFound = errorCode === '42703' || errorCode === 'COLUMN_NOT_FOUND';
  const columnName = extractColumnName(error);

  const isMissingPricing =
    isColumnNotFound &&
    (fullErrorText.includes('actual_selling_price') ||
      fullErrorText.includes('recommended_selling_price') ||
      errorMessage.includes('actual_selling_price') ||
      errorMessage.includes('recommended_selling_price'));

  const isMissingDietary =
    isColumnNotFound &&
    (fullErrorText.includes('allergens') ||
      fullErrorText.includes('is_vegetarian') ||
      fullErrorText.includes('is_vegan') ||
      fullErrorText.includes('dietary_confidence') ||
      fullErrorText.includes('dietary_method') ||
      errorMessage.includes('allergens') ||
      errorMessage.includes('is_vegetarian') ||
      errorMessage.includes('is_vegan') ||
      errorMessage.includes('dietary_confidence') ||
      errorMessage.includes('dietary_method'));

  const isMissingDescription =
    isColumnNotFound &&
    (fullErrorText.includes('description') || errorMessage.includes('description'));

  return {
    isMissingPricing,
    isMissingDietary,
    isMissingDescription,
    isColumnNotFound,
    columnName,
  };
}
