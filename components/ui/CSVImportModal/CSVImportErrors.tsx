/**
 * CSV Import Errors Component
 * Displays parse and validation errors
 */
'use client';

import { AlertCircle } from 'lucide-react';
import { Icon } from '../Icon';

interface CSVImportErrorsProps {
  parseErrors: Array<{ row: number; error: string }>;
  validationErrors: Map<number, string>;
}

export function CSVImportErrors({ parseErrors, validationErrors }: CSVImportErrorsProps) {
  return (
    <>
      {/* Parse Errors Display */}
      {parseErrors.length > 0 && (
        <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
            <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
            <span>CSV Parse Errors ({parseErrors.length})</span>
          </div>
          <div className="max-h-32 space-y-1 overflow-y-auto text-xs text-red-300">
            {parseErrors.slice(0, 10).map((error, index) => (
              <div key={index}>
                Row {error.row}: {error.error}
              </div>
            ))}
            {parseErrors.length > 10 && <div>... and {parseErrors.length - 10} more errors</div>}
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
    </>
  );
}
