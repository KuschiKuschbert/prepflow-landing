'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { LANDING_COLORS } from '@/lib/landing-styles';
import { Package } from 'lucide-react';

interface IngredientEmptyStateProps {
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  onAddIngredient?: () => void;
  onImportCSV?: () => void;
  onExportCSV?: () => void;
}

export function IngredientEmptyState({
  searchTerm,
  supplierFilter,
  storageFilter,
  onAddIngredient,
  onImportCSV,
  onExportCSV,
}: IngredientEmptyStateProps) {
  const headerActions = onAddIngredient && (onImportCSV || onExportCSV) && (
    <div className="flex items-center gap-2">
      <button
        onClick={onAddIngredient}
        className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl"
        style={{
          background: `linear-gradient(to right, ${LANDING_COLORS.primary}, ${LANDING_COLORS.accent})`,
        }}
      >
        + Add
      </button>
      {onImportCSV && (
        <button
          onClick={onImportCSV}
          className="rounded-lg bg-gradient-to-r from-[var(--color-info)] to-[var(--primary)] px-3 py-1.5 text-sm font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--color-info)]/80 hover:to-[var(--primary)]/80 hover:shadow-xl"
          style={{
            background: `linear-gradient(to right, ${LANDING_COLORS.secondary}, ${LANDING_COLORS.primary})`,
          }}
        >
          📁 Import
        </button>
      )}
      {onExportCSV && (
        <button
          onClick={onExportCSV}
          className="rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--color-info)] px-3 py-1.5 text-sm font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--accent)]/80 hover:to-[var(--color-info)]/80 hover:shadow-xl"
          style={{
            background: `linear-gradient(to right, ${LANDING_COLORS.accent}, ${LANDING_COLORS.secondary})`,
          }}
        >
          📤 Export
        </button>
      )}
    </div>
  );

  return (
    <EmptyState
      title="No Ingredients Found"
      message={
        searchTerm || supplierFilter || storageFilter
          ? 'Try adjusting your filters to see more results.'
          : 'Start by adding your first ingredient to get started.'
      }
      icon={Package}
      header={
        headerActions
          ? {
              title: 'Ingredients (0)',
              actions: headerActions,
            }
          : undefined
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
