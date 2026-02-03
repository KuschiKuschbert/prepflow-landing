'use client';

import { Button } from '@/components/ui/Button';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { Icon } from '@/components/ui/Icon';
import { PrintButton } from '@/components/ui/PrintButton';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { Plus, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
  exportRecipesToCSV,
  exportRecipesToHTML,
  exportRecipesToPDF,
} from '../utils/exportRecipes';
import { printRecipes } from '../utils/printRecipes';

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
      <Button
        href="/webapp/recipes#dishes"
        variant="primary"
        size="sm"
        className="shadow-lg hover:shadow-xl"
        landingStyle
      >
        <Icon icon={Plus} size="sm" className="mr-1.5 text-current" aria-hidden={true} />
        Add Recipe
      </Button>
      <Button
        onClick={onRefresh}
        variant="secondary"
        size="sm"
        disabled={loading}
        className="shadow-lg hover:shadow-xl"
        landingStyle
      >
        <Icon
          icon={RefreshCw}
          size="sm"
          className={`mr-1.5 text-current ${loading ? 'animate-spin' : ''}`}
          aria-hidden={true}
        />
        Refresh Recipes
      </Button>
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
