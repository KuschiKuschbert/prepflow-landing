'use client';

/**
 * Standardized CSV import modal component
 * Reusable across all entity types with configurable parsing and validation
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { type ParseCSVResult } from '@/lib/csv/csv-utils';
import { logger } from '@/lib/logger';
import { X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { CSVImportActions } from './CSVImportModal/CSVImportActions';
import { CSVImportErrors } from './CSVImportModal/CSVImportErrors';
import { CSVImportFileUpload } from './CSVImportModal/CSVImportFileUpload';
import { CSVImportInstructions } from './CSVImportModal/CSVImportInstructions';
import { CSVImportPreview } from './CSVImportModal/CSVImportPreview';
import { CSVImportTemplateDownload } from './CSVImportModal/CSVImportTemplateDownload';
import { Icon } from './Icon';
import { ImportProgress, type ImportProgressState } from './ImportProgress';

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
 * @component
 * @param {CSVImportModalProps} props - Component props
 * @returns {JSX.Element} CSV import modal component
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

  const parseCSVData = useCallback((csvText: string) => {
    try {
      if (!csvText || csvText.trim().length === 0) {
          setErrors([{ row: 0, error: 'CSV file is empty' }]);
          setParsedEntities([]);
          setSelectedIndices(new Set());
          setValidationErrors(new Map());
          return;
        }

        const result = config.parseCSV(csvText);
        const parseErrors = result.errors.map(err => ({ row: err.row || 0, error: err.message || 'Parse error' }));
        setErrors(parseErrors);
        const newValidationErrors = new Map<number, string>();
        if (config.validateEntity && result.data.length > 0) {
          result.data.forEach((entity, index) => {
            const validation = config.validateEntity!(entity, index);
            if (!validation.valid && validation.error) newValidationErrors.set(index, validation.error);
          });
        }
        setValidationErrors(newValidationErrors);
        setParsedEntities(result.data);
        const validIndices = new Set<number>();
        result.data.forEach((_, index) => {
          if (!newValidationErrors.has(index)) validIndices.add(index);
        });
        setSelectedIndices(validIndices);
    } catch (err) {
      logger.error('[CSV Import Modal] Failed to parse CSV:', err);
      setErrors([{ row: 0, error: err instanceof Error ? err.message : 'Failed to parse CSV file' }]);
      setParsedEntities([]);
      setSelectedIndices(new Set());
      setValidationErrors(new Map());
    }
  }, [config]);

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
    [parseCSVData],
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

  const selectedValidCount = Array.from(selectedIndices).filter(
    i => !validationErrors.has(i),
  ).length;
  const validCount = parsedEntities.length - validationErrors.size;

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
            <CSVImportTemplateDownload onDownload={handleDownloadTemplate} />

            {/* File Upload */}
            <CSVImportFileUpload
              expectedColumns={config.expectedColumns}
              optionalColumns={config.optionalColumns}
              onFileUpload={handleFileUpload}
            />

            {/* Errors Display */}
            <CSVImportErrors parseErrors={errors} validationErrors={validationErrors} />

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
                <CSVImportPreview
                  parsedEntities={parsedEntities}
                  selectedIndices={selectedIndices}
                  validationErrors={validationErrors}
                  entityName={config.entityName}
                  entityNamePlural={config.entityNamePlural}
                  formatEntityForPreview={config.formatEntityForPreview}
                  onSelectEntity={handleSelectEntity}
                  onSelectAll={handleSelectAll}
                />

                <CSVImportActions
                  selectedValidCount={selectedValidCount}
                  validCount={validCount}
                  entityNamePlural={config.entityNamePlural}
                  loading={loading}
                  onClose={handleClose}
                  onImport={handleImport}
                />
              </>
            )}

            <CSVImportInstructions instructions={config.instructions} />
          </div>
        </div>
      </div>
    </div>
  );
}
