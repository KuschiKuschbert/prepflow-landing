import { calculateDishSellingPrice } from '@/app/api/menus/[id]/statistics/helpers/calculateDishSellingPrice';

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
 * Audit a single dish
 */
export async function auditDish(dish: any): Promise<PriceAuditResult> {
  const result: PriceAuditResult = {
    itemId: dish.id,
    itemName: dish.dish_name || 'Unknown Dish',
    itemType: 'dish',
    menuBuilderPrice: null,
    recipeDishBuilderPrice: null,
    discrepancy: 0,
    discrepancyPercent: 0,
    issues: [],
  };

  try {
    // Get menu builder price (using calculateDishSellingPrice)
    const menuBuilderPrice = await calculateDishSellingPrice(dish.id);
    result.menuBuilderPrice = menuBuilderPrice;

    // Get recipe/dish builder price (from /api/dishes/[id]/cost endpoint)
    const costResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dishes/${dish.id}/cost`,
    );
    if (costResponse.ok) {
      const costData = await costResponse.json();
      if (costData.success && costData.cost?.recommendedPrice != null) {
        result.recipeDishBuilderPrice = costData.cost.recommendedPrice;
      } else {
        result.issues.push('Failed to get recipe/dish builder price from API');
      }
    } else {
      result.issues.push(`API call failed: ${costResponse.status}`);
    }

    // Calculate discrepancy
    if (result.menuBuilderPrice != null && result.recipeDishBuilderPrice != null) {
      result.discrepancy = Math.abs(result.menuBuilderPrice - result.recipeDishBuilderPrice);
      const avgPrice = (result.menuBuilderPrice + result.recipeDishBuilderPrice) / 2;
      result.discrepancyPercent = avgPrice > 0 ? (result.discrepancy / avgPrice) * 100 : 0;

      // Flag discrepancies > 0.01 (1 cent)
      if (result.discrepancy > 0.01) {
        result.issues.push(
          `Price mismatch: Menu Builder=$${result.menuBuilderPrice.toFixed(2)}, Recipe/Dish Builder=$${result.recipeDishBuilderPrice.toFixed(2)}, Diff=$${result.discrepancy.toFixed(2)}`,
        );
      }
    }
  } catch (err) {
    result.issues.push(`Error auditing dish: ${err instanceof Error ? err.message : String(err)}`);
  }

  return result;
}
