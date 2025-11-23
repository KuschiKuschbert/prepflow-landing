'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useNotification } from '@/contexts/NotificationContext';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useState } from 'react';
import { PrepListForm } from './components/PrepListForm';
import { PrepListCard } from './components/PrepListCard';
import { GenerateFromMenuModal } from './components/GenerateFromMenuModal';
import { PrepListPreview } from './components/PrepListPreview';
import { usePrepListsQuery } from './hooks/usePrepListsQuery';
import { usePrepListsData } from './hooks/usePrepListsData';
import { usePrepListsForm } from './hooks/usePrepListsForm';
import { usePrepListsCRUD } from './hooks/usePrepListsCRUD';
import { usePrepListsModals } from './hooks/usePrepListsModals';
import { usePrepListsPagination } from './hooks/usePrepListsPagination';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import type { PrepList } from './types';
import { ListChecks, ChefHat } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export default function PrepListsPage() {
  const { t } = useTranslation();
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
  const { page, setPage, totalPages, goToPreviousPage, goToNextPage } = usePrepListsPagination({
    total: 0, // Will be updated from prepListsData
    pageSize,
  });

  // Data fetching
  const {
    data: prepListsData,
    isLoading: listsLoading,
    refetch: refetchPrepLists,
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
    addItem,
    removeItem,
    updateItem,
    handleEdit,
    setError,
  } = usePrepListsForm({
    prepLists,
    setPrepLists,
    refetchPrepLists,
    showError,
    showSuccess,
    userId,
  });

  // CRUD operations
  const { confirmDialog, handleDelete, handleStatusChange, cancelConfirmDialog } = usePrepListsCRUD(
    {
      prepLists,
      setPrepLists,
      refetchPrepLists,
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
    prepLists: Array<{ sectionId: string | null; name: string; items: any[] }>,
  ) => {
    await handleSaveBatchPrepLists(prepLists, userId, refetchPrepLists, setError);
  };

  if (listsLoading) {
    return <PageSkeleton />;
  }

  return (
    <ResponsivePageContainer>
      <div className="min-h-screen bg-transparent py-8 text-white">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
              <Icon icon={ListChecks} size="lg" aria-hidden={true} />
              {t('prepLists.title', 'Prep Lists')}
            </h1>
            <p className="text-gray-400">
              {t('prepLists.subtitle', 'Create and manage kitchen prep lists by section')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openGenerateModal}
              className="flex items-center gap-2 rounded-2xl bg-[#29E7CD]/10 px-6 py-3 font-semibold text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20"
            >
              <Icon icon={ChefHat} size="md" aria-hidden={true} />
              {t('prepLists.generateFromMenu', 'Generate from Menu')}
            </button>
            <button
              onClick={openForm}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              + {t('prepLists.createPrepList', 'Create Prep List')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {formError && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{formError}</p>
          </div>
        )}

        {/* Prep Lists */}
        <div className="space-y-4">
          {prepLists.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <Icon icon={ListChecks} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t('prepLists.noPrepLists', 'No Prep Lists')}
              </h3>
              <p className="mb-6 text-gray-400">
                {t(
                  'prepLists.noPrepListsDesc',
                  'Create your first prep list to organize kitchen preparation',
                )}
              </p>
              <button
                onClick={openForm}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
              >
                {t('prepLists.createFirstPrepList', 'Create Your First Prep List')}
              </button>
            </div>
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

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Page {page} of {actualTotalPages} ({actualTotal} items)
                </span>
                <div className="space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={page <= 1}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={page >= actualTotalPages}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <PrepListForm
              sections={kitchenSections}
              ingredients={ingredients}
              formData={formData as any}
              setFormData={setFormData as any}
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
