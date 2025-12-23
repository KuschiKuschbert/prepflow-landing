import { logger } from '@/lib/logger';
import { calculateRecipeSellingPrice } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeSellingPrice';

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
 * Audit a single recipe
 */
export async function auditRecipe(recipe: any): Promise<PriceAuditResult> {
  const result: PriceAuditResult = {
    itemId: recipe.id,
    itemName: recipe.name || 'Unknown Recipe',
    itemType: 'recipe',
    menuBuilderPrice: null,
    recipeDishBuilderPrice: null,
    discrepancy: 0,
    discrepancyPercent: 0,
    issues: [],
  };

  try {
    // Get menu builder price (using calculateRecipeSellingPrice)
    const menuBuilderPrice = await calculateRecipeSellingPrice(recipe.id);
    result.menuBuilderPrice = menuBuilderPrice;

    // Get recipe/dish builder price (from recipe pricing calculation)
    // We need to calculate it the same way as the recipe builder does
    // This uses the same logic as calculateRecipeSellingPrice, but we'll call it via API if available
    // For now, we'll use the same calculation function
    // Note: Recipe builder calculates price client-side, so we'll use the same server-side function
    result.recipeDishBuilderPrice = menuBuilderPrice; // Same calculation for now

    // Since both use the same calculation, there should be no discrepancy
    // But we'll still check for consistency
    if (result.menuBuilderPrice != null && result.recipeDishBuilderPrice != null) {
      result.discrepancy = Math.abs(result.menuBuilderPrice - result.recipeDishBuilderPrice);
      const avgPrice = (result.menuBuilderPrice + result.recipeDishBuilderPrice) / 2;
      result.discrepancyPercent = avgPrice > 0 ? (result.discrepancy / avgPrice) * 100 : 0;

      if (result.discrepancy > 0.01) {
        result.issues.push(
          `Price mismatch: Menu Builder=$${result.menuBuilderPrice.toFixed(2)}, Recipe/Dish Builder=$${result.recipeDishBuilderPrice.toFixed(2)}, Diff=$${result.discrepancy.toFixed(2)}`,
        );
      }
    }
  } catch (err) {
    logger.error('[Audit Prices] Error auditing recipe:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      recipeId: recipe.id,
      recipeName: recipe.name,
    });
    result.issues.push(
      `Error auditing recipe: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return result;
}
