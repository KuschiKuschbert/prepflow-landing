'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { ParLevelInlineForm } from './components/ParLevelInlineForm';
import { ParLevelEditDrawer } from './components/ParLevelEditDrawer';
import { ParLevelCard } from './components/ParLevelCard';
import { ParLevelTable } from './components/ParLevelTable';
import { ParLevelSelectionModeBanner } from './components/ParLevelSelectionModeBanner';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TablePagination } from '@/components/ui/TablePagination';
import { Package2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useSelectionMode } from './hooks/useSelectionMode';
import { useParLevelsData } from './hooks/useParLevelsData';
import { useParLevelsForm } from './hooks/useParLevelsForm';
import { useParLevelsCRUD } from './hooks/useParLevelsCRUD';
import { useParLevelsSelection } from './hooks/useParLevelsSelection';
import { useParLevelsPagination } from './hooks/useParLevelsPagination';

export default function ParLevelsPage() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const {
    isSelectionMode,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
  } = useSelectionMode();
  const [showForm, setShowForm] = useState(false);

  // Data fetching
  const { parLevels, ingredients, loading, setParLevels, fetchParLevels } = useParLevelsData({
    showError,
  });

  // Form handling
  const { formData, setFormData, handleSubmit, resetForm } = useParLevelsForm({
    parLevels,
    ingredients,
    setParLevels,
    showError,
    showSuccess,
  });

  // CRUD operations
  const {
    editingParLevel,
    showDeleteConfirm,
    deleteConfirmId,
    handleUpdate,
    handleEdit,
    handleDelete,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    closeEditDrawer,
  } = useParLevelsCRUD({
    parLevels,
    setParLevels,
    fetchParLevels,
    showError,
    showSuccess,
  });

  // Selection
  const { selectedParLevels, handleSelectParLevel, handleSelectAll } = useParLevelsSelection({
    parLevels,
    isSelectionMode,
    exitSelectionMode,
  });

  // Pagination
  const { page, setPage, itemsPerPage, setItemsPerPage, totalPages, paginatedParLevels } =
    useParLevelsPagination({ parLevels });

  const handleFormClose = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading && parLevels.length === 0) {
    return (
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-8 text-white">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="mt-6 space-y-4">
            <LoadingSkeleton variant="card" count={5} height="80px" />
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="min-h-screen bg-transparent py-8 text-white">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
              <Icon icon={Package2} size="lg" aria-hidden={true} />
              {t('parLevels.title', 'Par Level Management')}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-400">
                {t('parLevels.subtitle', 'Set minimum stock levels for automatic reordering')}
              </p>
              <HelpTooltip
                content="Par levels help you manage inventory automatically. Set a minimum stock level (par level) - when stock hits this level, you should order more. Set a reorder point (critical level) - when reached, order immediately to avoid running out."
                title="What are Par Levels?"
              />
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            + {t('parLevels.addParLevel', 'Add Par Level')}
          </button>
        </div>

        {/* Inline Add Form */}
        {showForm && !editingParLevel && (
          <ParLevelInlineForm
            formData={formData}
            ingredients={ingredients}
            onClose={handleFormClose}
            onSubmit={handleSubmit}
            onFormDataChange={(field, value) => setFormData({ ...formData, [field]: value })}
          />
        )}

        {/* Selection Mode Banner */}
        <ParLevelSelectionModeBanner
          isSelectionMode={isSelectionMode}
          onExitSelectionMode={exitSelectionMode}
        />

        {/* Par Levels List */}
        {parLevels.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={Package2} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              {t('parLevels.noParLevels', 'No Par Levels Set')}
            </h3>
            <p className="mb-6 text-gray-400">
              {t(
                'parLevels.noParLevelsDesc',
                'Set par levels to automate your inventory management',
              )}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              {t('parLevels.addFirstParLevel', 'Add Your First Par Level')}
            </button>
          </div>
        ) : (
          <>
            {/* Pagination - Top */}
            <TablePagination
              page={page}
              totalPages={totalPages}
              total={parLevels.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={setItemsPerPage}
              className="mb-4"
            />

            {/* Mobile/Tablet Cards */}
            <div className="desktop:hidden block space-y-4">
              {paginatedParLevels.map(parLevel => (
                <ParLevelCard
                  key={parLevel.id}
                  parLevel={parLevel}
                  selectedParLevels={selectedParLevels}
                  onSelectParLevel={handleSelectParLevel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  deletingId={deleteConfirmId}
                  isSelectionMode={isSelectionMode}
                  onStartLongPress={startLongPress}
                  onCancelLongPress={cancelLongPress}
                  onEnterSelectionMode={enterSelectionMode}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <ParLevelTable
              parLevels={paginatedParLevels}
              selectedParLevels={selectedParLevels}
              totalFiltered={parLevels.length}
              onSelectParLevel={handleSelectParLevel}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingId={deleteConfirmId}
              isSelectionMode={isSelectionMode}
              onStartLongPress={startLongPress}
              onCancelLongPress={cancelLongPress}
              onEnterSelectionMode={enterSelectionMode}
            />

            {/* Pagination - Bottom */}
            <TablePagination
              page={page}
              totalPages={totalPages}
              total={parLevels.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={setItemsPerPage}
              className="mt-4"
            />
          </>
        )}

        {/* Edit Drawer */}
        <ParLevelEditDrawer
          isOpen={!!editingParLevel}
          parLevel={editingParLevel}
          ingredients={ingredients}
          onClose={closeEditDrawer}
          onSave={handleUpdate}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Par Level"
          message="Are you sure you want to delete this par level? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          variant="danger"
        />
      </div>
    </ResponsivePageContainer>
  );
}
