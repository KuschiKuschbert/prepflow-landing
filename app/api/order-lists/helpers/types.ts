export interface SupplierRecord {
  id: string;
  supplier_name?: string;
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
}

export interface IngredientRecord {
  id: string;
  ingredient_name?: string;
  name?: string;
  unit?: string;
  category?: string;
}

export interface OrderListItemRecord {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients?: IngredientRecord | null;
}

export interface OrderListRecord {
  id: string;
  user_id: string;
  supplier_id: number;
  name: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
  suppliers?: SupplierRecord | null;
  order_list_items?: OrderListItemRecord[] | null;
}
