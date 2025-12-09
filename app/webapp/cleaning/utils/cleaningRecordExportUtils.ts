/**
 * Cleaning record export utilities
 * Provides print and CSV export functionality for cleaning records
 */

import type { CleaningRecordExportData } from './formatCleaningRecordsForPrint';
import { printCleaningRecords } from './cleaningRecordExportUtils/printExport';
import { exportCleaningRecordsToCSV } from './cleaningRecordExportUtils/csvExport';

// Re-export functions for backward compatibility
export { printCleaningRecords, exportCleaningRecordsToCSV };
