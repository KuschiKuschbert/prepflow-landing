export type EntityType = 'dish' | 'recipe' | 'ingredient';
export type ChangeType =
  | 'updated'
  | 'deleted'
  | 'price_changed'
  | 'ingredients_changed'
  | 'recipes_changed'
  | 'cost_changed'
  | 'yield_changed'
  | 'instructions_changed';

export interface ChangeDetails {
  field?: string;
  before?: unknown;
  after?: unknown;
  change?: string;
  [key: string]: unknown;
}

export interface MenuChangeTracking {
  id: string;
  menu_id: string;
  entity_type: EntityType;
  entity_id: string;
  entity_name: string;
  change_type: ChangeType;
  change_details: ChangeDetails;
  changed_at: string;
  changed_by: string | null;
  handled: boolean;
  handled_at: string | null;
}
