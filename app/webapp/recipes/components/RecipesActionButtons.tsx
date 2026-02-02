'use client';

import { useState, useCallback } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { LANDING_COLORS } from '@/lib/landing-styles';
import { PrintButton } from '@/components/ui/PrintButton';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { printRecipes } from '../utils/printRecipes';
import {
  exportRecipesToCSV,
  exportRecipesToHTML,
  exportRecipesToPDF,
} from '../utils/exportRecipes';
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface RecipesActionButtonsProps {
  onRefresh: () => void;
  loading?: boolean;
  recipes: Recipe[];
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
}

export function RecipesActionButtons({
  onRefresh,
  loading = false,
  recipes,
  fetchBatchRecipeIngredients,
}: RecipesActionButtonsProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const getIngredientsMap = useCallback(async (): Promise<
    Map<string, RecipeIngredientWithDetails[]>
  > => {
    if (recipes.length === 0) {
      return new Map();
    }

    const recipeIds = recipes.map(r => r.id);
    const batchIngredients = await fetchBatchRecipeIngredients(recipeIds);
    const ingredientsMap = new Map<string, RecipeIngredientWithDetails[]>();

    Object.entries(batchIngredients).forEach(([recipeId, ingredients]) => {
      ingredientsMap.set(recipeId, ingredients);
    });

    return ingredientsMap;
  }, [recipes, fetchBatchRecipeIngredients]);

  const handlePrint = useCallback(async () => {
    if (recipes.length === 0) {
      showError('No recipes to print');
      return;
    }

    setPrintLoading(true);
    try {
      const ingredientsMap = await getIngredientsMap();
      printRecipes({ recipes, ingredientsMap });
      showSuccess('Print dialog opened');
    } catch (error) {
      logger.error('Failed to print recipes:', error);
      showError('Failed to print recipes');
    } finally {
      setPrintLoading(false);
    }
  }, [recipes, getIngredientsMap, showSuccess, showError]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (recipes.length === 0) {
        showError('No recipes to export');
        return;
      }

      setExportLoading(format);
      try {
        switch (format) {
          case 'csv':
            exportRecipesToCSV(recipes);
            showSuccess('Recipes exported to CSV');
            break;
          case 'html': {
            const ingredientsMap = await getIngredientsMap();
            exportRecipesToHTML(recipes, ingredientsMap);
            showSuccess('Recipes exported to HTML');
            break;
          }
          case 'pdf': {
            const ingredientsMap = await getIngredientsMap();
            await exportRecipesToPDF(recipes, ingredientsMap);
            showSuccess('Recipes exported to PDF');
            break;
          }
        }
      } catch (error) {
        logger.error(`Failed to export recipes to ${format}:`, error);
        showError(`Failed to export recipes to ${format.toUpperCase()}`);
      } finally {
        setExportLoading(null);
      }
    },
    [recipes, getIngredientsMap, showSuccess, showError],
  );

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <a
        href="/webapp/recipes#dishes"
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl"
        style={{
          background: `linear-gradient(to right, ${LANDING_COLORS.primary}, ${LANDING_COLORS.accent})`,
        }}
      >
        <Icon icon={Plus} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
        Add Recipe
      </a>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--color-info)] to-[var(--primary)] px-6 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--color-info)]/80 hover:to-[var(--primary)]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, ${LANDING_COLORS.secondary}, ${LANDING_COLORS.primary})`,
        }}
      >
        <Icon
          icon={RefreshCw}
          size="sm"
          className={`text-[var(--foreground)] ${loading ? 'animate-spin' : ''}`}
          aria-hidden={true}
        />
        Refresh Recipes
      </button>
      <PrintButton onClick={handlePrint} loading={printLoading} disabled={recipes.length === 0} />
      <ExportButton
        onExport={handleExport}
        loading={exportLoading}
        disabled={recipes.length === 0}
        availableFormats={['csv', 'pdf', 'html']}
      />
    </div>
  );
}
