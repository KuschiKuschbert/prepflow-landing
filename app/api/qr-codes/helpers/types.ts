export interface QRCodeEntity {
  id: string;
  name: string;
  type: 'recipe' | 'cleaning-area' | 'employee' | 'supplier' | 'storage-area';
  subtitle?: string;
  destinationUrl: string;
  createdAt?: string;
}

export interface RecipeRow {
  id: string;
  recipe_name: string;
  created_at: string;
}

export interface CleaningAreaRow {
  id: string;
  area_name: string;
  cleaning_frequency: string | null;
  created_at: string;
}

export interface EmployeeRow {
  id: string;
  full_name: string;
  role: string | null;
  created_at: string;
}

export interface SupplierRow {
  id: string;
  supplier_name: string;
  created_at: string;
}

export interface StorageEquipmentRow {
  id: string;
  name: string;
  equipment_type: string | null;
  location: string | null;
  created_at: string;
}
