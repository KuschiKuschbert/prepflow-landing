export interface RecipeRow {
  id: string;
  recipe_name: string;
}

export interface RecipeMerge {
  key: string;
  survivor: string;
  removed: string[];
}
