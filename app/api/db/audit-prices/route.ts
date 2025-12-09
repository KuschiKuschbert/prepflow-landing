import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { validateAdmin } from './helpers/validateAdmin';
import { fetchDishes } from './helpers/fetchDishes';
import { fetchRecipes } from './helpers/fetchRecipes';
import { auditDish } from './helpers/auditDish';
import { auditRecipe } from './helpers/auditRecipe';
import { calculateSummary } from './helpers/calculateSummary';

interface PriceAuditResult {
  itemId: string;
  itemName: string;
  itemType: 'dish' | 'recipe';
  menuBuilderPrice: number | null;
  recipeDishBuilderPrice: number | null;
  discrepancy: number;
  discrepancyPercent: number;
  issues: string[];
}

/**
 * Audit endpoint to compare recommended prices between menu builder and recipe/dish builder
 * GET /api/db/audit-prices
 * Requires X-Admin-Key header
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin key and environment
    const adminError = validateAdmin(request);
    if (adminError) {
      return adminError;
    }

    const auditResults: PriceAuditResult[] = [];

    // Fetch all dishes
    const dishesResult = await fetchDishes();
    if (dishesResult instanceof NextResponse) {
      return dishesResult;
    }
    const { dishes } = dishesResult;

    // Fetch all recipes
    const recipesResult = await fetchRecipes();
    if (recipesResult instanceof NextResponse) {
      return recipesResult;
    }
    const { recipes } = recipesResult;

    // Audit dishes
    if (dishes && dishes.length > 0) {
      for (const dish of dishes) {
        const result = await auditDish(dish);
        auditResults.push(result);
      }
    }

    // Audit recipes
    if (recipes && recipes.length > 0) {
      for (const recipe of recipes) {
        const result = await auditRecipe(recipe);
        auditResults.push(result);
      }
    }

    // Calculate summary statistics
    const summary = calculateSummary(auditResults, dishes.length, recipes.length);

    return NextResponse.json({
      success: true,
      message: summary.message,
      summary: {
        totalItems: summary.totalItems,
        itemsWithIssues: summary.itemsWithIssues,
        itemsWithDiscrepancies: summary.itemsWithDiscrepancies,
        avgDiscrepancy: summary.avgDiscrepancy,
        maxDiscrepancy: summary.maxDiscrepancy,
      },
      results: auditResults,
    });
  } catch (error) {
    logger.error('[Audit Prices] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to audit prices',
        'INTERNAL_ERROR',
        500,
        error instanceof Error ? error.message : String(error),
      ),
      { status: 500 },
    );
  }
}
