/**
 * Handle keyboard shortcuts for side panel.
 */
export function createKeyboardHandler(
  onClose: () => void,
  onEdit?: () => void,
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey && onEdit) {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        onEdit();
      }
    }
  };
}
