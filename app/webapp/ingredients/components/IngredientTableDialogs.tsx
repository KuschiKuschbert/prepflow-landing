'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InputDialog } from '@/components/ui/InputDialog';

interface InputDialogConfig {
  title: string;
  message: string;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  onConfirm: (value: string) => void;
}

interface IngredientTableDialogsProps {
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  showInputDialog: boolean;
  setShowInputDialog: (show: boolean) => void;
  inputDialogConfig: InputDialogConfig | null;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  selectedCount: number;
  confirmDelete: () => void;
  confirmBulkDelete: () => void;
}

export function IngredientTableDialogs({
  showConfirmDialog,
  setShowConfirmDialog,
  showInputDialog,
  setShowInputDialog,
  inputDialogConfig,
  deleteConfirmId,
  setDeleteConfirmId,
  selectedCount,
  confirmDelete,
  confirmBulkDelete,
}: IngredientTableDialogsProps) {
  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={
          deleteConfirmId
            ? 'Delete Ingredient'
            : `Delete ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}`
        }
        message={
          deleteConfirmId
            ? 'Are you sure you want to delete this ingredient? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={deleteConfirmId ? confirmDelete : confirmBulkDelete}
        onCancel={() => {
          setShowConfirmDialog(false);
          setDeleteConfirmId(null);
        }}
        variant="danger"
      />

      {inputDialogConfig && (
        <InputDialog
          isOpen={showInputDialog}
          title={inputDialogConfig.title}
          message={inputDialogConfig.message}
          placeholder={inputDialogConfig.placeholder}
          type={inputDialogConfig.type}
          min={inputDialogConfig.min}
          max={inputDialogConfig.max}
          confirmLabel="Update"
          cancelLabel="Cancel"
          onConfirm={inputDialogConfig.onConfirm}
          onCancel={() => {
            setShowInputDialog(false);
          }}
          variant="info"
        />
      )}
    </>
  );
}
