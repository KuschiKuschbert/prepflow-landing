/**
 * Dish deduplication utilities for performance API
 */

export function deduplicateDishes(dishes: any[]): any[] {
  return dishes.reduce((acc: any[], dish: any) => {
    const existingDish = acc.find((d: any) => d.name === dish.name);
    if (!existingDish || new Date(dish.created_at) > new Date(existingDish.created_at)) {
      // Remove existing entry if it exists
      const filteredAcc = acc.filter((d: any) => d.name !== dish.name);
      return [...filteredAcc, dish];
    }
    return acc;
  }, [] as any[]);
}

export function filterDishesWithSales(dishes: any[]): any[] {
  return dishes.filter(dish => dish.sales_data && dish.sales_data.length > 0);
}
