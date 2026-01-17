export interface IngredientRow {
  id: string;
  ingredient_name: string;
  supplier?: string;
  brand?: string;
  pack_size?: string;
  unit?: string;
  cost_per_unit?: number;
}

export interface UsageMap {
  [key: string]: number;
}

export interface IngredientGroup {
  ids: string[];
  survivor?: string;
}

export interface IngredientMerge {
  key: string;
  survivor: string;
  removed: string[];
}
