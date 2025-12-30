/**
 * Catalog mapping helpers for Square ↔ PrepFlow conversion.
 */
import type { Dish } from '../../catalog';

/**
 * Map Square catalog item to PrepFlow dish
 */
export function mapSquareItemToDish(squareItem: any, locationId: string): Dish {
  const itemData = squareItem.itemData;
  const dishName = itemData.name || 'Unnamed Dish';
  const description = itemData.description || null;

  // Get price from variations or item variations
  let sellingPrice = 0;
  if (itemData.variations && itemData.variations.length > 0) {
    const firstVariation = itemData.variations[0];
    if (firstVariation.itemVariationData?.priceMoney) {
      sellingPrice = Number(firstVariation.itemVariationData.priceMoney.amount) / 100; // Convert cents to dollars
    }
  }

  // Extract category from categories array if available
  let category: string | undefined = undefined;
  if (itemData.categories && itemData.categories.length > 0) {
    category = itemData.categories[0];
  }

  return {
    id: '', // Will be set when creating dish
    dish_name: dishName,
    description,
    selling_price: sellingPrice,
    category,
  };
}

/**
 * Map PrepFlow dish to Square catalog item
 */
export function mapDishToSquareItem(dish: Dish): any {
  return {
    type: 'ITEM',
    id: `#${dish.id}`,
    itemData: {
      name: dish.dish_name,
      description: dish.description || undefined,
      categories: dish.category ? [dish.category] : undefined,
      variations: [
        {
          type: 'ITEM_VARIATION',
          id: `#${dish.id}-variation`,
          itemVariationData: {
            name: dish.dish_name,
            pricingType: 'FIXED_PRICING',
            priceMoney: {
              amount: Math.round(dish.selling_price * 100), // Convert dollars to cents
              currency: 'AUD',
            },
          },
        },
      ],
    },
  };
}


