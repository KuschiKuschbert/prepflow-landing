export interface SetupProgress {
  ingredients: boolean;
  recipes: boolean;
  equipment: boolean;
  country: boolean;
}

export interface EquipmentType {
  value: string;
  label: string;
  icon: string;
  defaultMin: number;
  defaultMax: number;
  category: string;
}

export interface TemperatureEquipment {
  id?: number;
  name: string;
  equipment_type: string;
  location: string;
  min_temp: number | string;
  max_temp: number | string;
  is_active: boolean;
}

export interface NewEquipment {
  name: string;
  equipment_type: string;
  location: string;
  min_temp: string;
  max_temp: string;
  is_active: boolean;
}
