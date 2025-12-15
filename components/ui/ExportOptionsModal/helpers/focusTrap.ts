/**
 * Focus trap helper for export options modal.
 */
export function setupFocusTrap(modalRef: React.RefObject<HTMLDivElement>) {
  if (!modalRef.current) return () => {};
  const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
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
  document.addEventListener('keydown', handleTab);
  firstElement?.focus();
  return () => document.removeEventListener('keydown', handleTab);
}
