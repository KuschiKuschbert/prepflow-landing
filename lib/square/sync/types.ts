/**
 * Type definitions for Square sync operations.
 */
export interface QueuedSyncOperation {
  id: string;
  user_id: string;
  entity_type: 'dish' | 'employee' | 'recipe' | 'ingredient';
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  direction: 'prepflow_to_square' | 'square_to_prepflow' | 'bidirectional';
  priority: 'high' | 'normal' | 'low';
  retry_count: number;
  created_at: string;
  metadata?: Record<string, any>;
}
