/**
 * Get list of tables that have user_id column and should be backed up.
 */
export const USER_TABLES = [
  { name: 'order_lists', idColumn: 'id' },
  { name: 'prep_lists', idColumn: 'id' },
  { name: 'recipe_shares', idColumn: 'id' },
  { name: 'ai_specials_ingredients', idColumn: 'id' },
];

/**
 * Child tables that reference parent tables (no user_id on child rows).
 */
export const CHILD_TABLES = [
  {
    name: 'order_list_items',
    fk: 'order_list_id',
    parentTable: 'order_lists',
    parentIdColumn: 'id',
  },
  {
    name: 'prep_list_items',
    fk: 'prep_list_id',
    parentTable: 'prep_lists',
    parentIdColumn: 'id',
  },
];

