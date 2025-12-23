export interface SquareConfig {
  square_environment: 'sandbox' | 'production';
  default_location_id?: string;
  auto_sync_enabled: boolean;
  sync_menu_items: boolean;
  sync_staff: boolean;
  sync_sales_data: boolean;
  sync_food_costs: boolean;
  webhook_enabled: boolean;
  webhook_url?: string;
  webhook_secret?: string;
}

