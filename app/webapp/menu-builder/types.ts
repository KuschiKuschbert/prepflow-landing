export interface Menu {
  id: string;
  menu_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  items_count?: number;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  dish_id: string;
  category: string;
  position: number;
  dishes?: {
    id: string;
    dish_name: string;
    description?: string;
    selling_price: number;
  };
}

export interface MenuStatistics {
  total_dishes: number;
  total_cogs: number;
  total_revenue: number;
  average_profit_margin: number;
  food_cost_percent: number;
}

export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
}
