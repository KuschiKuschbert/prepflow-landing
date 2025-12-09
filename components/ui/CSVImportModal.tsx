'use client';

/**
 * Standardized CSV import modal component
 * Reusable across all entity types with configurable parsing and validation
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { useState, useCallback } from 'react';
import { Icon } from './Icon';
import { ImportProgress, type ImportProgressState } from './ImportProgress';
import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { logger } from '@/lib/logger';
import { X, Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportToCSV } from '@/lib/csv/csv-utils';

export interface CSVImportConfig<T = any> {
  /** Entity type name (e.g., "Ingredients", "Recipes") */
  entityName: string;
  /** Entity name plural (e.g., "ingredients", "recipes") */
  entityNamePlural: string;
  /** CSV column headers expected */
  expectedColumns: string[];
  /** Optional columns that may be present */
  optionalColumns?: string[];
  /** Parse CSV text into entity objects */
  parseCSV: (csvText: string) => ParseCSVResult<T>;
  /** Validate parsed entity */
  validateEntity?: (entity: T, index: number) => { valid: boolean; error?: string };
  /** Format entity for preview display */
  formatEntityForPreview: (entity: T, index: number) => React.ReactNode;
  /** Generate template CSV content */
  generateTemplate: () => string;
  /** Template filename */
  templateFilename: string;
  /** Instructions for CSV format */
  instructions: string[];
}

export interface CSVImportModalProps<T = any> {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Import handler - receives selected entities */
  onImport: (entities: T[]) => Promise<void>;
  /** Import configuration */
  config: CSVImportConfig<T>;
  /** Loading state */
  loading?: boolean;
  /** Import progress state */
  progress?: ImportProgressState;
}

/**
 * Standardized CSV import modal
 *
 * @component
 * @param {CSVImportModalProps} props - Component props
 * @returns {JSX.Element} CSV import modal component
 *
 * @example
 * ```tsx
 * <CSVImportModal
 *   isOpen={isImportOpen}
 *   onClose={() => setIsImportOpen(false)}
 *   onImport={handleImport}
 *   config={ingredientsImportConfig}
 *   loading={isImporting}
 * />
 * ```
 */
export function CSVImportModal<T = any>({
  isOpen,
  onClose,
  onImport,
  config,
  loading = false,
  progress,
}: CSVImportModalProps<T>) {
  const [csvData, setCsvData] = useState<string>('');
  const [parsedEntities, setParsedEntities] = useState<T[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Array<{ row: number; error: string }>>([]);
  const [validationErrors, setValidationErrors] = useState<Map<number, string>>(new Map());

  const parseCSVData = useCallback(
    (csvText: string) => {
      try {
        if (!csvText || csvText.trim().length === 0) {
          setErrors([{ row: 0, error: 'CSV file is empty' }]);
          setParsedEntities([]);
          setSelectedIndices(new Set());
          setValidationErrors(new Map());
          return;
        }

        const result = config.parseCSV(csvText);

        // Collect parse errors
        const parseErrors = result.errors.map(err => ({
          row: err.row || 0,
          error: err.message || 'Parse error',
        }));

        setErrors(parseErrors);

        // Validate entities if validator provided
        const newValidationErrors = new Map<number, string>();
        if (config.validateEntity && result.data.length > 0) {
          result.data.forEach((entity, index) => {
            const validation = config.validateEntity!(entity, index);
            if (!validation.valid && validation.error) {
              newValidationErrors.set(index, validation.error);
            }
          });
        }

        setValidationErrors(newValidationErrors);

        // Set parsed entities
        setParsedEntities(result.data);

        // Auto-select all valid entities
        const validIndices = new Set<number>();
        result.data.forEach((_, index) => {
          if (!newValidationErrors.has(index)) {
            validIndices.add(index);
          }
        });
        setSelectedIndices(validIndices);
      } catch (err) {
        logger.error('[CSV Import Modal] Failed to parse CSV:', err);
        setErrors([
          { row: 0, error: err instanceof Error ? err.message : 'Failed to parse CSV file' },
        ]);
        setParsedEntities([]);
        setSelectedIndices(new Set());
        setValidationErrors(new Map());
      }
    },
    [config],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        const csvText = e.target?.result as string;
        setCsvData(csvText);
        parseCSVData(csvText);
      };
      reader.readAsText(file);
    },
    [config, parseCSVData],
  );

  const handleSelectEntity = useCallback((index: number, selected: boolean) => {
    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        // Select all valid entities
        const validIndices = new Set<number>();
        parsedEntities.forEach((_, index) => {
          if (!validationErrors.has(index)) {
            validIndices.add(index);
          }
        });
        setSelectedIndices(validIndices);
      } else {
        setSelectedIndices(new Set());
      }
    },
    [parsedEntities, validationErrors],
  );

  const handleImport = useCallback(async () => {
    try {
      const entitiesToImport = parsedEntities.filter((_, index) => selectedIndices.has(index));

      if (entitiesToImport.length === 0) {
        return;
      }

      await onImport(entitiesToImport);

      // Reset state on success
      setCsvData('');
      setParsedEntities([]);
      setSelectedIndices(new Set());
      setErrors([]);
      setValidationErrors(new Map());
    } catch (err) {
      logger.error(`[CSV Import Modal] Failed to import ${config.entityNamePlural}:`, err);
    }
  }, [parsedEntities, selectedIndices, onImport, config.entityNamePlural]);

  const handleClose = useCallback(() => {
    setCsvData('');
    setParsedEntities([]);
    setSelectedIndices(new Set());
    setErrors([]);
    setValidationErrors(new Map());
    onClose();
  }, [onClose]);

  const handleDownloadTemplate = useCallback(() => {
    const template = config.generateTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = config.templateFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [config]);

  const validCount = parsedEntities.length - validationErrors.size;
  const selectedValidCount = Array.from(selectedIndices).filter(
    i => !validationErrors.has(i),
  ).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div className="max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-[#1f1f1f]/95">
          {/* Header */}
          <div className="desktop:p-6 border-b border-[#2a2a2a] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="desktop:text-2xl text-xl font-bold text-white">
                  Import {config.entityName} from CSV
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Upload a CSV file or download our template to get started
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full bg-[#2a2a2a] p-2 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white"
                aria-label="Close import modal"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="desktop:space-y-6 desktop:p-6 space-y-4 p-4">
            {/* Template Download */}
            <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Need a template?</h3>
                    <p className="text-xs text-gray-400">
                      Download our CSV template with all required columns
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
                >
                  <Icon icon={Download} size="sm" aria-hidden={true} />
                  Download Template
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white transition-colors focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">
                Required columns: {config.expectedColumns.join(', ')}
                {config.optionalColumns && config.optionalColumns.length > 0 && (
                  <> | Optional: {config.optionalColumns.join(', ')}</>
                )}
              </p>
            </div>

            {/* Errors Display */}
            {errors.length > 0 && (
              <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
                  <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
                  <span>CSV Parse Errors ({errors.length})</span>
                </div>
                <div className="max-h-32 space-y-1 overflow-y-auto text-xs text-red-300">
                  {errors.slice(0, 10).map((error, index) => (
                    <div key={index}>
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                  {errors.length > 10 && <div>... and {errors.length - 10} more errors</div>}
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.size > 0 && (
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-900/20 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-400">
                  <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
                  <span>Validation Errors ({validationErrors.size})</span>
                </div>
                <div className="max-h-32 space-y-1 overflow-y-auto text-xs text-yellow-300">
                  {Array.from(validationErrors.entries())
                    .slice(0, 10)
                    .map(([index, error]) => (
                      <div key={index}>
                        Row {index + 1}: {error}
                      </div>
                    ))}
                  {validationErrors.size > 10 && (
                    <div>... and {validationErrors.size - 10} more errors</div>
                  )}
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {loading && progress && (
              <ImportProgress
                progress={progress}
                title={`Importing ${config.entityNamePlural}...`}
              />
            )}

            {/* Preview */}
            {parsedEntities.length > 0 && !loading && (
              <>
                <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]">
                  {/* Preview Header */}
                  <div className="border-b border-[#2a2a2a] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Preview ({parsedEntities.length} {config.entityNamePlural} found)
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {validCount} valid, {validationErrors.size} with errors
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSelectAll(true)}
                          className="text-xs text-gray-400 transition-colors hover:text-[#29E7CD]"
                        >
                          Select All Valid
                        </button>
                        <span className="text-gray-600">|</span>
                        <button
                          onClick={() => handleSelectAll(false)}
                          className="text-xs text-gray-400 transition-colors hover:text-[#29E7CD]"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="max-h-96 space-y-2 overflow-y-auto p-4">
                    {parsedEntities.map((entity, index) => {
                      const isSelected = selectedIndices.has(index);
                      const hasError = validationErrors.has(index);
                      const errorMessage = validationErrors.get(index);

                      return (
                        <div
                          key={index}
                          className={`rounded-lg border p-3 transition-colors ${
                            hasError
                              ? 'border-red-500/50 bg-red-900/10'
                              : isSelected
                                ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10'
                                : 'border-[#2a2a2a] bg-[#1f1f1f] hover:border-[#2a2a2a]/80'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleSelectEntity(index, !isSelected)}
                              disabled={hasError}
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                hasError
                                  ? 'cursor-not-allowed border-red-500/50 bg-red-900/20'
                                  : isSelected
                                    ? 'border-[#29E7CD] bg-[#29E7CD]/20'
                                    : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#29E7CD]/50'
                              }`}
                              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${config.entityName} ${index + 1}`}
                            >
                              {isSelected && !hasError && (
                                <Icon
                                  icon={CheckCircle2}
                                  size="sm"
                                  className="text-[#29E7CD]"
                                  aria-hidden={true}
                                />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  {config.formatEntityForPreview(entity, index)}
                                </div>
                                {hasError && (
                                  <div className="ml-2 text-xs text-red-400">{errorMessage}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {selectedValidCount} of {validCount} valid {config.entityNamePlural} selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={loading || selectedValidCount === 0}
                      className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Import Selected ({selectedValidCount})
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Instructions */}
            <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
              <h4 className="mb-2 text-sm font-semibold text-white">CSV Format Instructions</h4>
              <div className="space-y-1 text-xs text-gray-400">
                {config.instructions.map((instruction, index) => (
                  <p key={index}>• {instruction}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
