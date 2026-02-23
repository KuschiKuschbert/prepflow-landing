'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { TablePagination } from '@/components/ui/TablePagination';
import { useNotification } from '@/contexts/NotificationContext';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { useEffect, useState } from 'react';

import { ParLevelCard } from './components/ParLevelCard';
import { ParLevelEditDrawer } from './components/ParLevelEditDrawer';
import { ParLevelEmptyState } from './components/ParLevelEmptyState';
import { ParLevelHeader } from './components/ParLevelHeader';
import { ParLevelInlineForm } from './components/ParLevelInlineForm';
import { ParLevelSelectionModeBanner } from './components/ParLevelSelectionModeBanner';
import { ParLevelTable } from './components/ParLevelTable';
import { useParLevelsCRUD } from './hooks/useParLevelsCRUD';
import { useParLevelsData } from './hooks/useParLevelsData';
import { useParLevelsExport } from './hooks/useParLevelsExport';
import { useParLevelsForm } from './hooks/useParLevelsForm';
import { useParLevelsPagination } from './hooks/useParLevelsPagination';
import { markFirstDone } from '@/lib/page-help/first-done-storage';
import { useParLevelsSelection } from './hooks/useParLevelsSelection';
import { useSelectionMode } from './hooks/useSelectionMode';

export default function ParLevelsPage() {
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
  const {
    parLevels,
    ingredients,
    loading,
    setParLevels,
    fetchParLevels: _fetchParLevels,
  } = useParLevelsData({
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
    handleDeleteClick: _handleDeleteClick,
    confirmDelete,
    cancelDelete,
    closeEditDrawer,
  } = useParLevelsCRUD({
    parLevels,
    setParLevels,
    showError,
    showSuccess,
  });

  // Selection
  // Mark first done for InlineHint/RescueNudge when user sets first par level
  useEffect(() => {
    if (parLevels.length > 0) markFirstDone('par-levels');
  }, [parLevels.length]);

  const { selectedParLevels, handleSelectParLevel, handleSelectAll } = useParLevelsSelection({
    parLevels,
    isSelectionMode,
    exitSelectionMode,
  });

  // Pagination
  const { page, setPage, itemsPerPage, setItemsPerPage, totalPages, paginatedParLevels } =
    useParLevelsPagination({ parLevels });

  // Export & Print
  const { exportLoading, printLoading, handlePrint, handleExport } = useParLevelsExport({
    parLevels,
  });

  const handleFormClose = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading && parLevels.length === 0) {
    return (
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
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
      <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
        <ParLevelHeader
          onAdd={() => setShowForm(true)}
          onPrint={handlePrint}
          onExport={handleExport}
          printLoading={printLoading}
          exportLoading={exportLoading}
          hasItems={parLevels.length > 0}
        />

        {PAGE_TIPS_CONFIG['par-levels'] && (
          <div className="mb-6">
            <PageTipsCard config={PAGE_TIPS_CONFIG['par-levels']} />
          </div>
        )}

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
          <ParLevelEmptyState onAdd={() => setShowForm(true)} />
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
          message="Are you sure you want to delete this par level? This action can't be undone."
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
