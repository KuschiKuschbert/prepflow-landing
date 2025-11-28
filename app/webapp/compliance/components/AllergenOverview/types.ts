export interface AllergenItem {
  id: string;
  name: string;
  description?: string;
  type: 'recipe' | 'dish';
  allergens: string[];
  allergenSources?: Record<string, string[]>; // allergen_code -> ingredient names
  menus: Array<{ menu_id: string; menu_name: string }>;
}
