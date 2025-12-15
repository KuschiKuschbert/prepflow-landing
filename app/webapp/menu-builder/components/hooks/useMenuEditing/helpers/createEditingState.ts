/**
 * Create editing state from title and description editing hooks.
 */
interface CreateEditingStateParams {
  titleEditingMenuId: string | null;
  descEditingMenuId: string | null;
}

export function createEditingState({
  titleEditingMenuId,
  descEditingMenuId,
}: CreateEditingStateParams): {
  editingMenuId: string | null;
  editingField: 'title' | 'description' | null;
} {
  const editingMenuId = titleEditingMenuId || descEditingMenuId || null;
  const editingField: 'title' | 'description' | null = titleEditingMenuId
    ? 'title'
    : descEditingMenuId
      ? 'description'
      : null;
  return { editingMenuId, editingField };
}
