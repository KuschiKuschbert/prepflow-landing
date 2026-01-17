/**
 * Catalog mapping helpers for Square ↔ PrepFlow conversion.
 */
import type { Dish, SquareCatalogObject } from '../../catalog';

/**
 * Map Square catalog item to PrepFlow dish
 */
export function mapSquareItemToDish(squareItem: SquareCatalogObject, locationId: string): Dish {
  const itemData = squareItem.itemData;
  if (!itemData) {
    return {
      id: '',
      dish_name: 'Unnamed Dish',
      selling_price: 0,
    };
  }

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
  const category: string | undefined = undefined;
  // TODO: Implement correct category mapping using category_id or similar
  /*
  if (itemData.categories && itemData.categories.length > 0) {
    category = itemData.categories[0];
  }
  */

  return {
    id: '', // Will be set when creating dish
    dish_name: dishName,
    description: description || undefined,
    selling_price: sellingPrice,
    category,
  };
}

/**
 * Map PrepFlow dish to Square catalog item
 */
export function mapDishToSquareItem(dish: Dish): SquareCatalogObject {
  return {
    type: 'ITEM',
    id: `#${dish.id}`,
    itemData: {
      name: dish.dish_name,
      description: dish.description || undefined,
      // categories: dish.category ? [dish.category] : undefined, // Removed due to type incompatibility
      variations: [
        {
          type: 'ITEM_VARIATION',
          id: `#${dish.id}-variation`,
          itemVariationData: {
            name: dish.dish_name,
            pricingType: 'FIXED_PRICING',
            priceMoney: {
              amount: BigInt(Math.round(dish.selling_price * 100)), // Convert dollars to cents
              currency: 'AUD',
            },
          },
        },
      ],
    },
  };
}
