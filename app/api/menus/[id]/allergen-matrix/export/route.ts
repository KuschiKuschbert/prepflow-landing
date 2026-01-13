/**
 * API endpoint for exporting allergen matrix in various formats
 */

import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import {
  aggregateDishDietaryStatus,
  aggregateRecipeDietaryStatus,
} from '@/lib/dietary/dietary-aggregation';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { EnrichedMenuItem } from '../../../helpers/schemas';
import { fetchMenuWithItems } from '../../helpers/fetchMenuWithItems';
import { generateHTML } from './helpers/generateHTML';

interface MatrixItem {
  name: string;
  type: 'Dish' | 'Recipe';
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  category: string | undefined;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!['html', 'csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid format. Must be html, csv, or pdf',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Ensure fresh dietary data by triggering recalculation for all recipes/dishes
    // This ensures the allergen matrix always shows accurate vegan/vegetarian status
    const dietaryRecalculations = (menu.items || []).map(async (item: EnrichedMenuItem) => {
      try {
        if (item.recipe_id) {
          // Force recalculation for recipes to ensure fresh dietary status
          await aggregateRecipeDietaryStatus(item.recipe_id, false, true);
        } else if (item.dish_id) {
          // Force recalculation for dishes to ensure fresh dietary status
          await aggregateDishDietaryStatus(item.dish_id, false, true);
        }
      } catch (err: unknown) {
        // Log but don't fail the export if recalculation fails
        logger.warn('[Allergen Matrix Export] Failed to recalculate dietary status:', {
          itemId: item.recipe_id || item.dish_id,
          type: item.recipe_id ? 'recipe' : 'dish',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    // Wait for all dietary recalculations to complete (in parallel)
    await Promise.all(dietaryRecalculations);

    // Re-fetch menu with items to get updated dietary status
    const menuWithFreshData = await fetchMenuWithItems(menuId);

    if (!menuWithFreshData) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    const matrixData: MatrixItem[] = (menuWithFreshData.items || []).map(
      (item: EnrichedMenuItem) => {
        let allergens: string[] = [];
        if (item.allergens && Array.isArray(item.allergens)) {
          allergens = item.allergens;
        } else if (item.dish_id && item.dishes?.allergens && Array.isArray(item.dishes.allergens)) {
          allergens = item.dishes.allergens as string[];
        } else if (
          item.recipe_id &&
          item.recipes?.allergens &&
          Array.isArray(item.recipes.allergens)
        ) {
          allergens = item.recipes.allergens as string[];
        }
        const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
        allergens = consolidateAllergens(allergens).filter(code =>
          validAllergenCodes.includes(code),
        );
        const isVegetarian =
          item.is_vegetarian ??
          (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
        const isVegan =
          item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);
        return {
          name: item.dish_id
            ? item.dishes?.dish_name || 'Unknown'
            : item.recipes?.recipe_name || (item.recipes as any)?.name || 'Unknown',
          type: item.dish_id ? 'Dish' : 'Recipe',
          allergens,
          isVegetarian: isVegetarian === true,
          isVegan: isVegan === true,
          category: item.category,
        };
      },
    );
    if (format === 'csv') return generateCSV(menuWithFreshData.menu_name, matrixData);
    if (format === 'pdf') return generateHTML(menuWithFreshData.menu_name, matrixData, true);
    return generateHTML(menuWithFreshData.menu_name, matrixData, false);
  } catch (err: unknown) {
    logger.error('[Allergen Matrix Export API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

function generateCSV(menuName: string, matrixData: MatrixItem[]): NextResponse {
  const headers = [
    'Item Name',
    'Type',
    'Category',
    ...AUSTRALIAN_ALLERGENS.map(a => a.displayName),
    'Vegetarian',
    'Vegan',
  ];

  const csvData = matrixData.map(item => {
    const allergenColumns: Record<string, string> = {};
    AUSTRALIAN_ALLERGENS.forEach(allergen => {
      allergenColumns[allergen.displayName] = item.allergens.includes(allergen.code) ? 'Yes' : '';
    });

    return {
      'Item Name': item.name,
      Type: item.type,
      Category: item.category || '',
      ...allergenColumns,
      Vegetarian: item.isVegetarian ? 'Yes' : '',
      Vegan: item.isVegan ? 'Yes' : '',
    };
  });

  const csvContent = Papa.unparse(csvData, {
    columns: headers,
    header: true,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  const fullContent = [`Allergen Matrix - ${menuName}`, '', csvContent].join('\n');

  return new NextResponse(fullContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.csv"`,
    },
  });
}
