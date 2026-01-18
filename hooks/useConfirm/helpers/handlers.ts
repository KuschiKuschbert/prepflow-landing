/**
 * Handlers for useConfirm hook.
 */
export function createConfirmHandlers(
  setIsOpen: (open: boolean) => void,
  setResolvePromise: (resolver: ((value: boolean) => void) | null) => void,
  setOptions: (options: any) => void, // justified
  resolvePromise: ((value: boolean) => void) | null,
) {
  return {
    handleConfirm: () => {
      setIsOpen(false);
      if (resolvePromise) {
        resolvePromise(true);
        setResolvePromise(null);
      }
      setTimeout(() => setOptions(null), 200);
    },
    handleCancel: () => {
      setIsOpen(false);
      if (resolvePromise) {
        resolvePromise(false);
        setResolvePromise(null);
      }
      setTimeout(() => setOptions(null), 200);
    },
  };
}
