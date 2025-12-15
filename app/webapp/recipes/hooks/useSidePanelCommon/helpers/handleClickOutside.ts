/**
 * Handle click outside panel to close.
 */
export function createClickOutsideHandler(
  panelRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
): (event: MouseEvent | TouchEvent) => void {
  return (event: MouseEvent | TouchEvent) => {
    const target = event.target as Element;
    if (panelRef.current?.contains(target)) return;
    if (target.closest('[role="dialog"]') || target.closest('[aria-modal="true"]')) return;
    if (target.closest('[role="menu"]') || target.closest('[role="listbox"]')) return;
    onClose();
  };
}
