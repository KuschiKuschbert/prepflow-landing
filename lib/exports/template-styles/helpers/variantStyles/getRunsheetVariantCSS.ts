/**
 * Get runsheet variant styles (restaurant/catering runsheet format)
 * Theme-aware layout for event runsheets
 */
import { getRunsheetBaseCSS } from './getRunsheetVariantCSS-base';
import { getRunsheetTableCSS } from './getRunsheetVariantCSS-table';
import { getRunsheetPrintCSS } from './getRunsheetVariantCSS-print';

export function getRunsheetVariantCSS(): string {
  return `
    /* Runsheet Variant - Restaurant/Catering Format */
    ${getRunsheetBaseCSS()}

    /* Runsheet table */
    ${getRunsheetTableCSS()}

    ${getRunsheetPrintCSS()}
  `;
}
