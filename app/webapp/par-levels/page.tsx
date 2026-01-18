'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { PrintButton } from '@/components/ui/PrintButton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { TablePagination } from '@/components/ui/TablePagination';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/useTranslation';
import { Package2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ParLevelCard } from './components/ParLevelCard';
import { ParLevelEditDrawer } from './components/ParLevelEditDrawer';
import { ParLevelInlineForm } from './components/ParLevelInlineForm';
import { ParLevelSelectionModeBanner } from './components/ParLevelSelectionModeBanner';
import { ParLevelTable } from './components/ParLevelTable';
import { useParLevelsCRUD } from './hooks/useParLevelsCRUD';
import { useParLevelsData } from './hooks/useParLevelsData';
import { useParLevelsForm } from './hooks/useParLevelsForm';
import { useParLevelsPagination } from './hooks/useParLevelsPagination';
import { useParLevelsSelection } from './hooks/useParLevelsSelection';
import { useSelectionMode } from './hooks/useSelectionMode';
import {
  exportParLevelsToCSV,
  exportParLevelsToHTML,
  exportParLevelsToPDF,
} from './utils/exportParLevels';
import { printParLevels } from './utils/printParLevels';

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
  const { parLevels, ingredients, loading, setParLevels, fetchParLevels: _fetchParLevels } = useParLevelsData({
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
  const { selectedParLevels, handleSelectParLevel, handleSelectAll } = useParLevelsSelection({
    parLevels,
    isSelectionMode,
    exitSelectionMode,
  });

  // Pagination
  const { page, setPage, itemsPerPage, setItemsPerPage, totalPages, paginatedParLevels } =
    useParLevelsPagination({ parLevels });

  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const handlePrint = useCallback(() => {
    if (parLevels.length === 0) {
      showError('No par levels to print');
      return;
    }

    setPrintLoading(true);
    try {
      printParLevels({ parLevels });
      showSuccess('Par levels report opened for printing');
    } catch (error) {
      logger.error('Failed to print par levels:', error);
      showError('Failed to print par levels');
    } finally {
      setPrintLoading(false);
    }
  }, [parLevels, showSuccess, showError]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (parLevels.length === 0) {
        showError('No par levels to export');
        return;
      }

      setExportLoading(format);
      try {
        switch (format) {
          case 'csv':
            exportParLevelsToCSV(parLevels);
            showSuccess('Par levels exported to CSV');
            break;
          case 'html':
            exportParLevelsToHTML(parLevels);
            showSuccess('Par levels exported to HTML');
            break;
          case 'pdf':
            await exportParLevelsToPDF(parLevels);
            showSuccess('Par levels exported to PDF');
            break;
        }
      } catch (error) {
        logger.error(`Failed to export par levels to ${format}:`, error);
        showError(`Failed to export par levels to ${format.toUpperCase()}`);
      } finally {
        setExportLoading(null);
      }
    },
    [parLevels, showSuccess, showError],
  );

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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-[var(--foreground)]">
              <Icon icon={Package2} size="lg" aria-hidden={true} />
              {t('parLevels.title', 'Par Level Management')}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-[var(--foreground-muted)]">
                {t('parLevels.subtitle', 'Set minimum stock levels for automatic reordering')}
              </p>
              <HelpTooltip
                content="Par levels help you manage inventory automatically. Set a minimum stock level (par level) - when stock hits this level, you should order more. Set a reorder point (critical level) - when reached, order immediately to avoid running out."
                title="What are Par Levels?"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
            >
              + {t('parLevels.addParLevel', 'Add Par Level')}
            </button>
            <PrintButton
              onClick={handlePrint}
              loading={printLoading}
              disabled={parLevels.length === 0}
            />
            <ExportButton
              onExport={handleExport}
              loading={exportLoading}
              disabled={parLevels.length === 0}
              availableFormats={['csv', 'pdf', 'html']}
            />
          </div>
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
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
              <Icon
                icon={Package2}
                size="xl"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
              {t('parLevels.noParLevels', 'No Par Levels Set')}
            </h3>
            <p className="mb-6 text-[var(--foreground-muted)]">
              {t(
                'parLevels.noParLevelsDesc',
                'Set par levels to automate your inventory management',
              )}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
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
