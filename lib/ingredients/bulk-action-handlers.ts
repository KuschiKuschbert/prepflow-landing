/**
 * Bulk action handlers for ingredients. Extracted from useBulkActions.
 */

export type ShowConfirmFn = (opts: {
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
}) => Promise<boolean>;

export type ShowPromptFn = (opts: {
  title: string;
  message: string;
  placeholder: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  validation?: (v: string) => string | null;
}) => Promise<string | null>;

export type ShowAlertFn = (opts: {
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
}) => Promise<void>;

export type ExecuteBulkActionFn = (
  actionName: string,
  action: () => Promise<void>,
  context?: Record<string, unknown>,
) => Promise<void>;

export function createBulkHandlers(
  selectedIngredients: Set<string>,
  selectedCount: number,
  onBulkDelete: (ids: string[]) => Promise<void>,
  onBulkUpdate: (ids: string[], updates: Record<string, unknown>) => Promise<void>,
  showConfirm: ShowConfirmFn,
  showPrompt: ShowPromptFn,
  showAlert: ShowAlertFn,
  executeBulkAction: ExecuteBulkActionFn,
) {
  const ids = () => Array.from(selectedIngredients);
  const plural = selectedCount !== 1 ? 's' : '';
  const label = `${selectedCount} ingredient${plural}`;

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;
    const confirmed = await showConfirm({
      title: `Delete ${selectedCount} Ingredient${plural}?`,
      message: `Delete ${label}? This action can't be undone. Last chance to back out.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    await executeBulkAction('bulk delete', () => onBulkDelete(ids()));
  };

  const handleBulkUpdateSupplier = async () => {
    if (selectedCount === 0) return;
    const newSupplier = await showPrompt({
      title: 'Update Supplier',
      message: `What supplier should these ${label} use?`,
      placeholder: 'Supplier name',
      type: 'text' as const,
      validation: (v: string) => (v.trim().length > 0 ? null : 'Supplier name is required'),
    });
    if (!newSupplier?.trim()) return;
    await executeBulkAction(
      'bulk update supplier',
      () => onBulkUpdate(ids(), { supplier: newSupplier.trim() }),
      { supplier: newSupplier.trim() },
    );
  };

  const handleBulkUpdateStorage = async () => {
    if (selectedCount === 0) return;
    const newStorage = await showPrompt({
      title: 'Update Storage Location',
      message: `Where should these ${label} be stored?`,
      placeholder: 'Storage location',
      type: 'text' as const,
      validation: (v: string) => (v.trim().length > 0 ? null : 'Storage location is required'),
    });
    if (!newStorage?.trim()) return;
    await executeBulkAction(
      'bulk update storage',
      () => onBulkUpdate(ids(), { storage_location: newStorage.trim() }),
      { storage: newStorage.trim() },
    );
  };

  const handleBulkUpdateWastage = async () => {
    if (selectedCount === 0) return;
    const wastageInput = await showPrompt({
      title: 'Update Wastage Percentage',
      message: `What wastage percentage (0-100) for these ${label}?`,
      placeholder: '0-100',
      type: 'number' as const,
      min: 0,
      max: 100,
      validation: (v: string) => {
        const num = parseFloat(v);
        return isNaN(num) || num < 0 || num > 100
          ? 'Please enter a valid percentage between 0 and 100'
          : null;
      },
    });
    if (!wastageInput) return;
    const wastage = parseFloat(wastageInput);
    if (isNaN(wastage) || wastage < 0 || wastage > 100) {
      await showAlert({
        title: 'Invalid Percentage',
        message: "That's not a valid percentage. Give me something between 0 and 100, chef.",
        variant: 'warning' as const,
      });
      return;
    }
    await executeBulkAction(
      'bulk update wastage',
      () =>
        onBulkUpdate(ids(), {
          trim_peel_waste_percentage: wastage,
          yield_percentage: 100 - wastage,
        }),
      { wastage },
    );
  };

  return {
    handleBulkDelete,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
  };
}
