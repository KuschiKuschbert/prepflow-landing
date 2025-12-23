/**
 * Form submission logic for prep lists.
 */

import { logger } from '@/lib/logger';
import type { PrepList, PrepListFormData } from '../../types';

interface FormSubmissionProps {
  formData: PrepListFormData;
  editingPrepList: PrepList | null;
  userId: string;
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  resetForm: () => void;
  refetchPrepLists: () => Promise<unknown>;
  setError: (error: string | null) => void;
}

/**
 * Submit prep list form with optimistic updates.
 *
 * @param {FormSubmissionProps} props - Form submission props
 */
export async function submitPrepListForm({
  formData,
  editingPrepList,
  userId,
  prepLists,
  setPrepLists,
  showError,
  showSuccess,
  resetForm,
  refetchPrepLists,
  setError,
}: FormSubmissionProps): Promise<void> {
  try {
    const url = editingPrepList ? '/api/prep-lists' : '/api/prep-lists';
    const method = editingPrepList ? 'PUT' : 'POST';

    const body = editingPrepList
      ? {
          id: editingPrepList.id,
          kitchenSectionId: formData.kitchenSectionId,
          name: formData.name,
          notes: formData.notes,
          status: 'draft',
          items: formData.items.filter(item => item.ingredientId && item.quantity),
        }
      : {
          userId,
          kitchenSectionId: formData.kitchenSectionId,
          name: formData.name,
          notes: formData.notes,
          items: formData.items.filter(item => item.ingredientId && item.quantity),
        };

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.success) {
      // Optimistically update UI
      if (editingPrepList) {
        // Update existing prep list
        setPrepLists(prevLists =>
          prevLists.map(list =>
            list.id === editingPrepList.id ? { ...list, ...result.prepList } : list,
          ),
        );
      } else {
        // Add new prep list
        if (result.prepList) {
          setPrepLists(prevLists => [...prevLists, result.prepList]);
        }
      }
      resetForm();
      setError(null);
      showSuccess(
        editingPrepList ? 'Prep list updated successfully' : 'Prep list created successfully',
      );
      // Optionally refresh in background for accuracy (non-blocking)
      refetchPrepLists().catch(err => logger.error('Failed to refresh prep lists:', err));
    } else {
      const errorMsg = result.message || 'Failed to save prep list';
      setError(errorMsg);
      showError(errorMsg);
    }
  } catch (err) {
    logger.error('[formSubmission.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    setError('Failed to save prep list');
    showError('Failed to save prep list. Please check your connection and try again.');
  }
}
