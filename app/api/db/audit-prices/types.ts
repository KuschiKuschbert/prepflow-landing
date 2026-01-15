export interface PriceAuditResult {
  itemId: string;
  itemName: string;
  itemType: 'dish' | 'recipe';
  menuBuilderPrice: number | null;
  recipeDishBuilderPrice: number | null;
  discrepancy: number;
  discrepancyPercent: number;
  issues: string[];
}

export interface AuditDishItem {
  id: string;
  dish_name: string;
}

export interface AuditRecipeItem {
  id: string;
  name: string;
}
