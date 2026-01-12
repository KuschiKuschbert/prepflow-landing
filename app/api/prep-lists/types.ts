export interface PrepList {
  id: string;
  user_id: string;
  kitchen_section_id: string | null;
  section_id?: string; // Legacy/Alias support
  name: string;
  notes: string | null;
  status: 'draft' | 'pending' | 'completed' | 'archived' | string;
  created_at: string;
  updated_at: string;
}

export interface PrepListItem {
  id: string;
  prep_list_id: string;
  ingredient_id: string | null;
  quantity: number | string | null;
  quantity_needed?: number; // Alias often used in queries
  unit: string | null;
  notes: string | null;
}

export interface KitchenSection {
  id: string;
  name?: string;
  section_name?: string;
  color?: string;
  color_code?: string;
}

export interface Ingredient {
  id: string;
  ingredient_name?: string;
  name?: string;
  unit: string;
  category?: string;
}

export interface CreatePrepListItemParams {
  ingredientId: string;
  quantity: string;
  unit: string;
  notes?: string;
}

export interface CreatePrepListParams {
  userId: string;
  kitchenSectionId: string;
  name: string;
  notes?: string;
  items?: CreatePrepListItemParams[];
}

export interface UpdatePrepListParams {
  id: string;
  kitchenSectionId?: string;
  name?: string;
  notes?: string;
  status?: string;
  items?: CreatePrepListItemParams[];
}

export interface FetchPrepListsParams {
  userId: string | null;
  page: number;
  pageSize: number;
}
