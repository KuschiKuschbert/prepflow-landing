'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Package, Plus } from 'lucide-react';

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
}: IngredientEmptyStateProps) {
  const hasFilters = !!(searchTerm || supplierFilter || storageFilter);

  if (hasFilters) {
    return (
      <EmptyState
        title="No results match your filters"
        message="Try adjusting your filters to see more results."
        icon={Package}
        useLandingStyles={true}
        variant="landing"
        animated={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      <RescueNudge
        pageKey="ingredients"
        guideId="getting-started"
        guideStepIndex={1}
        enabled={!hasFilters}
      />
      <EmptyState
        title="Your first ingredient is one click away"
        message="1 step to your first recipe cost. Add an ingredient to unlock cost calculations."
        icon={Package}
        actions={
          <div className="flex flex-col items-center gap-3">
            {onAddIngredient && (
              <>
                <Button
                  onClick={onAddIngredient}
                  variant="primary"
                  landingStyle={true}
                  className="flex items-center gap-2"
                >
                  <Icon icon={Plus} size="sm" aria-hidden />
                  Add your first ingredient
                </Button>
                <InlineHint context="ingredients">
                  Start here—one click to unlock recipe costs
                </InlineHint>
              </>
            )}
            {onImportCSV && (
              <button
                onClick={onImportCSV}
                className="text-sm text-[var(--foreground-muted)] underline-offset-2 transition-colors hover:text-[var(--primary)] hover:underline"
              >
                Import from CSV instead
              </button>
            )}
          </div>
        }
        useLandingStyles={true}
        variant="landing"
        animated={true}
      />
    </div>
  );
}
