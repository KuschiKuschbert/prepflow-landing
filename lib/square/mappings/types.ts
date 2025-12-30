/**
 * Square mapping types.
 */

export interface SquareMapping {
  id: string;
  user_id: string;
  entity_type: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location';
  prepflow_id: string;
  square_id: string;
  square_location_id: string | null;
  sync_direction: 'bidirectional' | 'square_to_prepflow' | 'prepflow_to_square';
  last_synced_at: string | null;
  last_synced_from_square: string | null;
  last_synced_to_square: string | null;
  sync_metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SquareMappingInput {
  user_id: string;
  entity_type: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location';
  prepflow_id: string;
  square_id: string;
  square_location_id?: string | null;
  sync_direction?: 'bidirectional' | 'square_to_prepflow' | 'prepflow_to_square';
  sync_metadata?: Record<string, any>;
}
