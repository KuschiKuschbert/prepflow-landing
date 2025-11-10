export interface KitchenSection {
  id: string;
  name: string;
  color: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}

export interface PrepListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: Ingredient;
}

export interface PrepList {
  id: string;
  kitchen_section_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  kitchen_sections: KitchenSection;
  prep_list_items: PrepListItem[];
}

export interface PrepListFormData {
  kitchenSectionId: string;
  name: string;
  notes: string;
  items: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes: string;
  }>;
}
