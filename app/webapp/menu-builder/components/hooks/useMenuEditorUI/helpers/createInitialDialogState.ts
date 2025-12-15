/**
 * Create initial confirm dialog state.
 */
export function createInitialDialogState() {
  return {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning' as const,
  };
}
