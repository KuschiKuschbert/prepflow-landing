'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useState } from 'react';
import { IngredientTableRow } from './IngredientTableRow';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface IngredientTableProps {
  ingredients: Ingredient[];
  displayUnit: string;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => Promise<void>;
  selectedIngredients: Set<string>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  loading?: boolean;
}

export default function IngredientTable({
  ingredients,
  displayUnit,
  onEdit,
  onDelete,
  selectedIngredients,
  onSelectIngredient,
  onSelectAll,
  loading = false,
}: IngredientTableProps) {
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async (id: string): Promise<void> => {
    setDeleteConfirmId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setShowDeleteConfirm(false);
    setDeletingId(deleteConfirmId);
    try {
      await onDelete(deleteConfirmId);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <div className="mb-4 text-[var(--foreground-muted)]">
          <svg className="mx-auto mb-4 h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-fluid-xl mb-2 font-semibold text-[var(--foreground)]">No Ingredients Found</h3>
          <p className="text-fluid-sm text-[var(--foreground-muted)]">
            Start by adding your first ingredient to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-fluid-xl font-semibold text-[var(--button-active-text)]">
            Ingredients ({ingredients.length})
          </h2>
          <div className="flex items-center gap-2">
            {selectedIngredients.size > 0 ? (
              <button
                onClick={() => onSelectAll(false)}
                className="text-fluid-sm flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1.5 font-medium text-[var(--primary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/20"
                aria-label="Deselect all ingredients"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{selectedIngredients.size} selected</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectAll(true)}
                className="text-fluid-sm flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1.5 font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--primary)]"
                aria-label="Select all ingredients"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Select All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
            <tr>
              <th className="desktop:table-cell text-fluid-xs hidden px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                <button
                  onClick={() => onSelectAll(selectedIngredients.size !== ingredients.length)}
                  className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
                  aria-label={
                    selectedIngredients.size === ingredients.length ? 'Deselect all' : 'Select all'
                  }
                >
                  {selectedIngredients.size === ingredients.length && ingredients.length > 0 ? (
                    <svg
                      className="h-4 w-4 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
                  )}
                </button>
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Name
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Brand
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Pack Size
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Cost/Unit
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Supplier
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Stock
              </th>
              <th className="text-fluid-xs px-6 py-3 text-left font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
            {ingredients.map(ingredient => (
              <IngredientTableRow
                key={ingredient.id}
                ingredient={ingredient}
                displayUnit={displayUnit}
                selectedIngredients={selectedIngredients}
                onSelectIngredient={onSelectIngredient}
                onEdit={onEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Ingredient"
        message="Are you sure you want to delete this ingredient? This action can't be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmId(null);
        }}
        variant="danger"
      />
    </div>
  );
}
