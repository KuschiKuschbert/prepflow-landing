/**
 * Dish deduplication utilities for performance API
 */

export function deduplicateDishes<
  T extends { name?: string; created_at?: string; sales_data?: unknown[] | null },
>(dishes: T[]): T[] {
  return dishes.reduce((acc: T[], dish: T) => {
    // If name is missing, keep it (safer default)
    if (!dish.name) return [...acc, dish];

    const existingDish = acc.find(d => d.name === dish.name);
    if (
      !existingDish ||
      (dish.created_at &&
        existingDish.created_at &&
        new Date(dish.created_at) > new Date(existingDish.created_at))
    ) {
      // Remove existing entry if it exists
      const filteredAcc = acc.filter(d => d.name !== dish.name);
      return [...filteredAcc, dish];
    }
    return acc;
  }, [] as T[]);
}

export function filterDishesWithSales<T extends { sales_data?: unknown[] | null }>(dishes: T[]): T[] {
  return dishes.filter(dish => dish.sales_data && dish.sales_data.length > 0);
}
