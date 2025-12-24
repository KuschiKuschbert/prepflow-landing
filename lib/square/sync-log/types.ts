/**
 * Sync log types.
 */

export interface SyncLog {
  id: string;
  user_id: string;
  operation_type:
    | 'sync_catalog'
    | 'sync_orders'
    | 'sync_staff'
    | 'sync_costs'
    | 'initial_sync'
    | 'webhook_event'
    | 'auto_sync';
  direction: 'square_to_prepflow' | 'prepflow_to_square' | 'bidirectional';
  entity_type: string | null;
  entity_id: string | null;
  square_id: string | null;
  status: 'success' | 'error' | 'conflict' | 'skipped' | 'pending' | 'retrying';
  error_message: string | null;
  error_details: Record<string, any> | null;
  sync_metadata: Record<string, any> | null;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  created_at: string;
}

export interface SyncOperation {
  user_id: string;
  operation_type:
    | 'sync_catalog'
    | 'sync_orders'
    | 'sync_staff'
    | 'sync_costs'
    | 'initial_sync'
    | 'webhook_event'
    | 'auto_sync';
  direction: 'square_to_prepflow' | 'prepflow_to_square' | 'bidirectional';
  entity_type?: string;
  entity_id?: string;
  square_id?: string;
  status: 'success' | 'error' | 'conflict' | 'skipped' | 'pending' | 'retrying';
  error_message?: string;
  error_details?: Record<string, any>;
  sync_metadata?: Record<string, any>;
  retry_count?: number;
  max_retries?: number;
  next_retry_at?: string | null;
}
