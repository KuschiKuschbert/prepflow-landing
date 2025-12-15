/**
 * Move menu item to new category.
 */
interface NotificationFunctions {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function moveItemToCategory(
  menuId: string,
  itemId: string,
  targetCategory: string,
  targetPosition: number,
  onMenuDataReload: () => Promise<void>,
  onStatisticsUpdate: () => void,
  notifications?: NotificationFunctions,
): Promise<void> {
  try {
    const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: targetCategory, position: targetPosition }),
    });

    if (response.ok) {
      await onMenuDataReload();
      await onStatisticsUpdate();
    } else {
      const result = await response.json();
      notifications?.showError(
        `Failed to move item: ${result.error || result.message || 'Unknown error'}`,
      );
    }
  } catch (err) {
    notifications?.showError('Failed to move item. Give it another go, chef.');
  }
}
