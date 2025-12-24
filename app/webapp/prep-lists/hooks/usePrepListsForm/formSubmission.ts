/**
 * Form submission logic for prep lists.
 */

import { logger } from '@/lib/logger';
import type { PrepList, PrepListFormData } from '../../types';
import { buildRequestBody } from './helpers/buildRequestBody';
import { createTempPrepList } from './helpers/createTempPrepList';
import { applyOptimisticUpdate } from './helpers/applyOptimisticUpdate';
import { replaceWithServerResponse } from './helpers/replaceWithServerResponse';

interface FormSubmissionProps {
  formData: PrepListFormData;
  editingPrepList: PrepList | null;
  userId: string;
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  resetForm: () => void;
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
  setError,
}: FormSubmissionProps): Promise<void> {
  // Store original state for rollback
  const originalPrepLists = [...prepLists];

  // Build request body
  const { url, method, body } = buildRequestBody({ formData, editingPrepList, userId });

  // Store tempId for CREATE operations
  let tempId: string | undefined;
  let tempPrepList: PrepList | undefined;

  // Create temp prep list if needed
  if (!editingPrepList) {
    tempId = `temp-${Date.now()}`;
    tempPrepList = createTempPrepList(formData, tempId);
  }

  // Optimistically update UI immediately
  applyOptimisticUpdate({
    editingPrepList,
    formData,
    tempPrepList,
    prepLists,
    setPrepLists,
  });

  resetForm();
  setError(null);

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.success && result.prepList) {
      // Replace optimistic update with server response
      replaceWithServerResponse({
        editingPrepList,
        tempId,
        serverPrepList: result.prepList,
        prepLists,
        setPrepLists,
      });
      showSuccess(
        editingPrepList ? 'Prep list updated successfully' : 'Prep list created successfully',
      );
    } else {
      // Rollback on error
      setPrepLists(originalPrepLists);
      const errorMsg = result.message || 'Failed to save prep list';
      setError(errorMsg);
      showError(errorMsg);
    }
  } catch (err) {
    // Rollback on error
    setPrepLists(originalPrepLists);
    logger.error('[formSubmission.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    setError('Failed to save prep list');
    showError('Failed to save prep list. Please check your connection and try again.');
  }
}
