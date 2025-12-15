/**
 * Create initial confirm dialog state.
 */
export function createInitialDialogState(): {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
} {
  return {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning',
  };
}
