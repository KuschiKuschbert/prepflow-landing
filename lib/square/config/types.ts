/**
 * Square configuration types.
 */

export interface SquareConfig {
  id: string;
  user_id: string;
  square_application_id: string;
  square_access_token_encrypted: string;
  refresh_token_encrypted: string | null; // OAuth refresh token (encrypted)
  square_environment: 'sandbox' | 'production';
  default_location_id: string | null;
  auto_sync_enabled: boolean;
  sync_frequency_minutes: number;
  sync_menu_items: boolean;
  sync_staff: boolean;
  sync_sales_data: boolean;
  sync_food_costs: boolean;
  webhook_enabled: boolean;
  webhook_url: string | null;
  webhook_secret: string | null;
  last_full_sync_at: string | null;
  last_menu_sync_at: string | null;
  last_staff_sync_at: string | null;
  last_sales_sync_at: string | null;
  initial_sync_completed: boolean;
  initial_sync_started_at: string | null;
  initial_sync_completed_at: string | null;
  initial_sync_status: 'pending' | 'in_progress' | 'completed' | 'failed' | null;
  initial_sync_error: string | null;
  auto_sync_direction: 'prepflow_to_square' | 'bidirectional';
  auto_sync_staff: boolean;
  auto_sync_dishes: boolean;
  auto_sync_costs: boolean;
  sync_debounce_ms: number;
  sync_queue_batch_size: number;
  created_at: string;
  updated_at: string;
}

export interface SquareConfigInput {
  square_application_id: string;
  square_access_token: string; // Plaintext token (will be encrypted)
  refresh_token?: string; // Plaintext refresh token (will be encrypted, optional - only for OAuth)
  square_application_secret?: string; // DEPRECATED: No longer used - PrepFlow uses env vars for Application Secret
  square_environment?: 'sandbox' | 'production';
  default_location_id?: string;
  auto_sync_enabled?: boolean;
  sync_frequency_minutes?: number;
  sync_menu_items?: boolean;
  sync_staff?: boolean;
  sync_sales_data?: boolean;
  sync_food_costs?: boolean;
  webhook_enabled?: boolean;
  webhook_url?: string;
  webhook_secret?: string;
  auto_sync_direction?: 'prepflow_to_square' | 'bidirectional';
  auto_sync_staff?: boolean;
  auto_sync_dishes?: boolean;
  auto_sync_costs?: boolean;
  sync_debounce_ms?: number;
  sync_queue_batch_size?: number;
}
