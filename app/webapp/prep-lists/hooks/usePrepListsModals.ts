/**
 * Hook for managing prep list modal and preview state.
 */

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { GeneratedPrepListData } from '../types';

/**
 * Hook for managing prep list modal and preview state.
 *
 * @returns {Object} Modal state and handlers
 */
export function usePrepListsModals() {
  const [showForm, setShowForm] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedPrepListData | null>(null);

  const openForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const openGenerateModal = useCallback(() => {
    setShowGenerateModal(true);
  }, []);

  const closeGenerateModal = useCallback(() => {
    setShowGenerateModal(false);
  }, []);

  const handleGenerateFromMenu = useCallback((data: GeneratedPrepListData) => {
    setGeneratedData(data);
    setShowPreview(true);
    setShowGenerateModal(false);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
    setGeneratedData(null);
  }, []);

  const handleSaveBatchPrepLists = useCallback(
    async (
      prepLists: Array<{ sectionId: string | null; name: string; items: any[] }>,
      userId: string,
      refetchPrepLists: () => Promise<unknown>,
      setError: (error: string | null) => void,
    ) => {
      try {
        setError(null);
        const response = await fetch('/api/prep-lists/batch-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prepLists, userId }),
        });

        const result = await response.json();

        if (result.success) {
          await refetchPrepLists();
          setShowPreview(false);
          setGeneratedData(null);
          setError(null);
        } else {
          setError(result.message || 'Failed to save prep lists');
        }
      } catch (err) {
        setError('Failed to save prep lists');
        logger.error('Error saving batch prep lists:', err);
      }
    },
    [],
  );

  return {
    showForm,
    showGenerateModal,
    showPreview,
    generatedData,
    openForm,
    closeForm,
    openGenerateModal,
    closeGenerateModal,
    handleGenerateFromMenu,
    closePreview,
    handleSaveBatchPrepLists,
  };
}
