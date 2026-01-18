/**
 * CSV Import Preview Component
 * Displays parsed entities with selection checkboxes
 */
'use client';

import { CheckCircle2 } from 'lucide-react';
import { Icon } from '../Icon';

interface CSVImportPreviewProps<T> {
  parsedEntities: T[];
  selectedIndices: Set<number>;
  validationErrors: Map<number, string>;
  entityName: string;
  entityNamePlural: string;
  formatEntityForPreview: (entity: T, index: number) => React.ReactNode;
  onSelectEntity: (index: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function CSVImportPreview<T>({
  parsedEntities,
  selectedIndices,
  validationErrors,
  entityName,
  entityNamePlural,
  formatEntityForPreview,
  onSelectEntity,
  onSelectAll,
}: CSVImportPreviewProps<T>) {
  const validCount = parsedEntities.length - validationErrors.size;
  const _selectedValidCount = Array.from(selectedIndices).filter(
    i => !validationErrors.has(i),
  ).length;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]">
      {/* Preview Header */}
      <div className="border-b border-[var(--border)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Preview ({parsedEntities.length} {entityNamePlural} found)
            </h3>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {validCount} valid, {validationErrors.size} with errors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectAll(true)}
              className="text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
            >
              Select All Valid
            </button>
            <span className="text-[var(--foreground-subtle)]">|</span>
            <button
              onClick={() => onSelectAll(false)}
              className="text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
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
                  ? 'border-[var(--color-error)]/50 bg-red-900/10'
                  : isSelected
                    ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border)]/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onSelectEntity(index, !isSelected)}
                  disabled={hasError}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    hasError
                      ? 'cursor-not-allowed border-[var(--color-error)]/50 bg-red-900/20'
                      : isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)]/20'
                        : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'
                  }`}
                  aria-label={`${isSelected ? 'Deselect' : 'Select'} ${entityName} ${index + 1}`}
                >
                  {isSelected && !hasError && (
                    <Icon
                      icon={CheckCircle2}
                      size="sm"
                      className="text-[var(--primary)]"
                      aria-hidden={true}
                    />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">{formatEntityForPreview(entity, index)}</div>
                    {hasError && (
                      <div className="ml-2 text-xs text-[var(--color-error)]">{errorMessage}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
