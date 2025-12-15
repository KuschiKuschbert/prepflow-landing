/**
 * Focus trap helper for input dialog.
 */
export function setupInputDialogFocusTrap(
  dialogRef: React.RefObject<HTMLDivElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  onCancel: () => void,
): () => void {
  if (!dialogRef.current) return () => {};
  const triggerRef = document.activeElement as HTMLElement;
  const getFocusableElements = (): HTMLElement[] => {
    if (!dialogRef.current) return [];
    return Array.from(
      dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];
  };
  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    } else if (firstElement) firstElement.focus();
  }, 100);
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };
  document.addEventListener('keydown', handleTab);
  document.addEventListener('keydown', handleEscape);
  return () => {
    document.removeEventListener('keydown', handleTab);
    document.removeEventListener('keydown', handleEscape);
    if (triggerRef && typeof triggerRef.focus === 'function') triggerRef.focus();
  };
}
