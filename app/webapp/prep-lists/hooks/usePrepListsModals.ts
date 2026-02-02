/**
 * Hook for managing prep list modal and preview state.
 */

import { useNotification } from '@/contexts/NotificationContext';
import { useCallback, useState } from 'react';
import type { GeneratedPrepListData, PrepList, PrepListCreationItem } from '@/lib/types/prep-lists';
import { handleSaveBatchPrepLists as handleSaveBatchPrepListsHelper } from './helpers/handleSaveBatchPrepLists';

/**
 * Hook for managing prep list modal and preview state.
 *
 * @returns {Object} Modal state and handlers
 */
export function usePrepListsModals() {
  const { showSuccess, showError } = useNotification();
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
      prepListsToCreate: Array<{
        sectionId: string | null;
        name: string;
        items: PrepListCreationItem[];
      }>,
      userId: string,
      currentPrepLists: PrepList[],
      setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>,
      setError: (error: string | null) => void,
    ) => {
      await handleSaveBatchPrepListsHelper({
        prepListsToCreate,
        userId,
        currentPrepLists,
        setPrepLists,
        setError,
        setShowPreview,
        setGeneratedData,
        generatedData,
        showSuccess,
        showError,
      });
    },
    [generatedData, showSuccess, showError, setShowPreview, setGeneratedData],
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
