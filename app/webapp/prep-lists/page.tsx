'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useNotification } from '@/contexts/NotificationContext';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/useTranslation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { PrepListsEmptyState } from './components/PrepListsEmptyState';
import { PrepListsHeader } from './components/PrepListsHeader';
import { PrepListsPagination } from './components/PrepListsPagination';
import { usePrepListsCRUD } from './hooks/usePrepListsCRUD';
import { usePrepListsData } from './hooks/usePrepListsData';
import { usePrepListsForm } from './hooks/usePrepListsForm';
import { usePrepListsModals } from './hooks/usePrepListsModals';
import { usePrepListsPagination } from './hooks/usePrepListsPagination';
import { usePrepListsQuery } from './hooks/usePrepListsQuery';
import type { PrepList, PrepListCreationItem } from '@/lib/types/prep-lists';

// Lazy load prep list components to reduce initial bundle size
const PrepListForm = dynamic(
  () => import('./components/PrepListForm').then(mod => ({ default: mod.PrepListForm })),
  {
    ssr: false,
    loading: () => null, // Forms handle their own loading states
  },
);

const PrepListCard = dynamic(
  () => import('./components/PrepListCard').then(mod => ({ default: mod.PrepListCard })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

const GenerateFromMenuModal = dynamic(
  () =>
    import('./components/GenerateFromMenuModal').then(mod => ({
      default: mod.GenerateFromMenuModal,
    })),
  {
    ssr: false,
    loading: () => null, // Modals handle their own loading states
  },
);

const PrepListPreview = dynamic(
  () => import('./components/PrepListPreview').then(mod => ({ default: mod.PrepListPreview })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

export default function PrepListsPage() {
  const { t: _t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const userId = 'user-123';
  const pageSize = 10;

  // Initialize with empty array to avoid hydration mismatch
  // Cached data will be loaded in useEffect after mount
  const [prepLists, setPrepLists] = useState<PrepList[]>([]);

  // Modals
  const {
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
  } = usePrepListsModals();

  // Pagination
  const {
    page,
    setPage: _setPage,
    totalPages: _totalPages,
    goToPreviousPage,
    goToNextPage,
  } = usePrepListsPagination({
    total: 0, // Will be updated from prepListsData
    pageSize,
  });

  // Data fetching
  const {
    data: prepListsData,
    isLoading: listsLoading,
    refetch: _refetchPrepLists,
  } = usePrepListsQuery(page, pageSize, userId);

  // Fetch kitchen sections and ingredients
  const { kitchenSections, ingredients } = usePrepListsData({
    showForm,
    showGenerateModal,
    showPreview,
    userId,
  });

  // Form handling
  const {
    formData,
    setFormData,
    editingPrepList,
    error: formError,
    handleSubmit,
    resetForm,
    addItem: _addItem,
    removeItem: _removeItem,
    updateItem: _updateItem,
    handleEdit,
    setError,
  } = usePrepListsForm({
    prepLists,
    setPrepLists,
    showError,
    showSuccess,
    userId,
  });

  // CRUD operations
  const { confirmDialog, handleDelete, handleStatusChange, cancelConfirmDialog } = usePrepListsCRUD(
    {
      prepLists,
      setPrepLists,
      showError,
      showSuccess,
    },
  );

  // Load cached data on mount for instant display (client-only)
  useEffect(() => {
    const cachedPrepLists = getCachedData<PrepList[]>('prep_lists');
    if (cachedPrepLists && cachedPrepLists.length > 0) {
      setPrepLists(cachedPrepLists);
    }
  }, []);

  // Update prep lists from query data
  useEffect(() => {
    if (prepListsData?.items) {
      setPrepLists(prepListsData.items as PrepList[]);
      cacheData('prep_lists', prepListsData.items);
    }
  }, [prepListsData]);

  // Update pagination when data changes
  const actualTotal = prepListsData?.total || 0;
  const actualTotalPages = Math.max(1, Math.ceil(actualTotal / pageSize));

  const handleFormClose = () => {
    resetForm();
    closeForm();
  };

  const handleFormEdit = (prepList: PrepList) => {
    handleEdit(prepList);
    openForm();
  };

  const handleSaveBatch = async (
    prepListsToCreate: Array<{
      sectionId: string | null;
      name: string;
      items: PrepListCreationItem[];
    }>,
  ) => {
    try {
      await handleSaveBatchPrepLists(prepListsToCreate, userId, prepLists, setPrepLists, setError);
    } catch (error) {
      logger.error('[PrepLists] Error saving batch prep lists:', {
        error: error instanceof Error ? error.message : String(error),
      });
      // Error is already handled by handleSaveBatchPrepLists via setError and showError
    }
  };

  if (listsLoading) {
    return <PageSkeleton />;
  }

  return (
    <ResponsivePageContainer>
      <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
        <PrepListsHeader onGenerateClick={openGenerateModal} onCreateClick={openForm} />

        {formError && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
            <p className="text-[var(--color-error)]">{formError}</p>
          </div>
        )}

        <div className="space-y-4">
          {prepLists.length === 0 ? (
            <PrepListsEmptyState onCreateClick={openForm} />
          ) : (
            <>
              {prepLists.map(prepList => (
                <PrepListCard
                  key={prepList.id}
                  prepList={prepList}
                  onEdit={handleFormEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}

              <PrepListsPagination
                page={page}
                totalPages={actualTotalPages}
                total={actualTotal}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
              />
            </>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <PrepListForm
              sections={kitchenSections}
              ingredients={ingredients}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onClose={handleFormClose}
              isEditing={!!editingPrepList}
            />
          </div>
        )}

        {/* Generate from Menu Modal */}
        {showGenerateModal && (
          <GenerateFromMenuModal onClose={closeGenerateModal} onGenerate={handleGenerateFromMenu} />
        )}

        {/* Prep List Preview */}
        {showPreview && generatedData && (
          <PrepListPreview
            data={generatedData}
            kitchenSections={kitchenSections}
            ingredients={ingredients}
            onClose={closePreview}
            onSave={handleSaveBatch}
          />
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDialog.onConfirm}
          onCancel={cancelConfirmDialog}
          variant="danger"
        />
      </div>
    </ResponsivePageContainer>
  );
}
