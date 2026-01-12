/**
 * Error detection helpers for missing columns
 */

import { PostgrestError } from '@supabase/supabase-js';
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
 * @param {PostgrestError | any} error - Supabase error
 * @returns {ColumnErrorInfo} Information about missing columns
 */
export function detectMissingColumns(error: PostgrestError | any): ColumnErrorInfo {
  const errorCode = error?.code;
  const errorMessage = error?.message || '';
  const errorDetails = error?.details || '';
  const errorHint = error?.hint || '';
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
