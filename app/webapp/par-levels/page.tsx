'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { createOptimisticDelete, createOptimisticUpdate } from '@/lib/optimistic-updates';
import { logger } from '@/lib/logger';
import { useSelectionMode } from './hooks/useSelectionMode';
import type { ParLevel, Ingredient } from './types';

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
  const [parLevels, setParLevels] = useState<ParLevel[]>(() => getCachedData('par_levels') || []);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingParLevel, setEditingParLevel] = useState<ParLevel | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedParLevels, setSelectedParLevels] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [formData, setFormData] = useState({
    ingredientId: '',
    parLevel: '',
    reorderPointPercentage: '50', // Default to 50%
    unit: '',
  });

  useEffect(() => {
    fetchParLevels();
    fetchIngredients();
  }, []);

  const fetchParLevels = useCallback(async () => {
    setLoading(true);
    console.log('[Par Levels] Fetching par levels...');
    try {
      const response = await fetch('/api/par-levels');
      console.log('[Par Levels] Response status:', response.status, response.statusText);

      // Parse JSON even if status is not 200
      let result;
      try {
        const responseText = await response.text();
        console.log('[Par Levels] Response text:', responseText);
        result = JSON.parse(responseText);
        console.log('[Par Levels] Parsed result:', result);
      } catch (parseError) {
        logger.error('Failed to parse response:', parseError);
        console.error('[Par Levels] Parse error:', parseError);
        showError(`Server error (${response.status}). Please check the server logs.`);
        return;
      }

      if (response.ok && result.success) {
        setParLevels(result.data || []);
        cacheData('par_levels', result.data || []);
      } else {
        // Show detailed error message with instructions if available
        const errorMessage =
          result.message || result.error || `Failed to fetch par levels (${response.status})`;
        const instructions = result.details?.instructions || [];

        // Log full error details for debugging
        const errorDetails = {
          status: response.status,
          error: errorMessage,
          details: result.details,
          code: result.code,
          fullResponse: result,
        };

        logger.error('Failed to fetch par levels:', errorDetails);

        // Always log to console for debugging (client-side)
        console.error('[Par Levels] API Error:', errorDetails);

        // Show error notification
        if (instructions.length > 0) {
          const fullMessage = `${errorMessage}\n\n${instructions.join('\n')}`;
          showError(fullMessage);
          console.error('[Par Levels] Error Instructions:', instructions);
        } else {
          showError(errorMessage);
        }
      }
    } catch (err) {
      logger.error('Failed to fetch par levels:', err);
      showError('Failed to fetch par levels. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchIngredients = useCallback(async () => {
    try {
      const response = await fetch('/api/ingredients');
      const result = await response.json();

      if (result.success) {
        const items = result.data?.items || result.data || [];
        setIngredients(items);
      }
    } catch (err) {
      logger.error('Failed to fetch ingredients:', err);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ingredientId || !formData.parLevel || !formData.unit) {
      showError('Please fill in all required fields');
      return;
    }

    // Ensure reorderPointPercentage has a default value
    const reorderPointPercentageValue = formData.reorderPointPercentage || '50';
    const parLevelValue = parseFloat(formData.parLevel);
    const reorderPointPercentage = parseFloat(reorderPointPercentageValue);

    if (isNaN(parLevelValue) || isNaN(reorderPointPercentage)) {
      showError('Par level and reorder point percentage must be valid numbers');
      return;
    }

    if (parLevelValue <= 0) {
      showError('Par level must be greater than 0');
      return;
    }

    if (reorderPointPercentage < 0 || reorderPointPercentage > 100) {
      showError('Reorder point percentage must be between 0 and 100');
      return;
    }

    // Calculate actual reorder point from percentage
    const reorderPointValue = parLevelValue * (reorderPointPercentage / 100);

    if (reorderPointValue >= parLevelValue) {
      showError('Reorder point must be less than par level');
      return;
    }

    // Create new par level
    const tempId = `temp-${Date.now()}`;
    const selectedIngredient = ingredients.find(ing => ing.id === formData.ingredientId);
    const tempParLevel: ParLevel = {
      id: tempId,
      ingredient_id: formData.ingredientId,
      par_level: parLevelValue,
      reorder_point: reorderPointValue,
      unit: formData.unit,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ingredients: {
        id: selectedIngredient?.id || formData.ingredientId,
        ingredient_name: selectedIngredient?.ingredient_name || '',
        unit: selectedIngredient?.unit,
        category: selectedIngredient?.category,
      },
    };

    // Store original state for rollback
    const originalParLevels = [...parLevels];

    // Optimistically add to UI immediately
    setParLevels(prevItems => [...prevItems, tempParLevel]);

    try {
      const response = await fetch('/api/par-levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: formData.ingredientId,
          parLevel: parLevelValue,
          reorderPoint: reorderPointValue,
          unit: formData.unit,
        }),
      });

      // Parse JSON even if status is not 200
      let result;
      try {
        const responseText = await response.text();
        console.log('[Par Levels] POST Response status:', response.status, response.statusText);
        console.log('[Par Levels] POST Response text:', responseText);
        result = JSON.parse(responseText);
        console.log('[Par Levels] POST Parsed result:', result);
      } catch (parseError) {
        logger.error('Failed to parse response:', parseError);
        console.error('[Par Levels] POST Parse error:', parseError);
        // Revert optimistic update on error
        setParLevels(originalParLevels);
        showError(`Server error (${response.status}). Please check the server logs.`);
        return;
      }

      if (response.ok && result.success && result.data) {
        // Replace temp item with real item from server
        // Ensure ingredients data is present (fallback to temp data if missing)
        const serverData = result.data;
        if (!serverData.ingredients && tempParLevel.ingredients) {
          serverData.ingredients = tempParLevel.ingredients;
        }

        setParLevels(prevItems => {
          const updated = prevItems.map(item => (item.id === tempId ? serverData : item));
          cacheData('par_levels', updated);
          return updated;
        });
        showSuccess('Par level created successfully');
        resetForm();
      } else {
        // Revert optimistic update on error
        setParLevels(originalParLevels);

        // Show detailed error message with instructions if available
        const errorMessage =
          result.message || result.error || `Failed to create par level (${response.status})`;
        const instructions = result.details?.instructions || [];

        // Log full error details for debugging
        const errorDetails = {
          status: response.status,
          error: errorMessage,
          details: result.details,
          code: result.code,
          fullResponse: result,
          requestBody: {
            ingredientId: formData.ingredientId,
            parLevel: parLevelValue,
            reorderPoint: reorderPointValue,
            unit: formData.unit,
          },
        };

        logger.error('Failed to create par level:', errorDetails);

        // Always log to console for debugging (client-side)
        console.error('[Par Levels] POST API Error:', errorDetails);

        // Show error notification
        if (instructions.length > 0) {
          const fullMessage = `${errorMessage}\n\n${instructions.join('\n')}`;
          showError(fullMessage);
          console.error('[Par Levels] POST Error Instructions:', instructions);
        } else {
          showError(errorMessage);
        }
      }
    } catch (err) {
      // Revert optimistic update on error
      setParLevels(originalParLevels);
      logger.error('Failed to create par level:', err);
      console.error('[Par Levels] POST Exception:', err);
      showError('Failed to create par level. Please check your connection and try again.');
    }
  };

  const handleUpdate = async (updates: Partial<ParLevel>) => {
    if (!updates.id) return;

    await createOptimisticUpdate(
      parLevels,
      updates.id,
      updates,
      () =>
        fetch('/api/par-levels', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: updates.id,
            parLevel: updates.par_level,
            reorderPoint: updates.reorder_point,
            unit: updates.unit,
          }),
        }),
      setParLevels,
      () => {
        showSuccess('Par level updated successfully');
        fetchParLevels();
      },
      error => showError(error),
    );
  };

  const handleEdit = (parLevel: ParLevel) => {
    setEditingParLevel(parLevel);
  };

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      const parLevelToDelete = parLevels.find(pl => pl.id === id);
      if (!parLevelToDelete) return;

      await createOptimisticDelete(
        parLevels,
        id,
        () => fetch(`/api/par-levels?id=${id}`, { method: 'DELETE' }),
        setParLevels,
        () => {
          showSuccess('Par level deleted successfully');
          fetchParLevels();
        },
        error => showError(error),
      );
    },
    [parLevels, showSuccess, showError, fetchParLevels],
  );

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;

    await handleDelete(deleteConfirmId);

    setShowDeleteConfirm(false);
    setDeleteConfirmId(null);
  }, [deleteConfirmId, handleDelete]);

  const resetForm = () => {
    setFormData({
      ingredientId: '',
      parLevel: '',
      reorderPointPercentage: '50', // Default to 50%
      unit: '',
    });
    setShowForm(false);
    setEditingParLevel(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(parLevels.length / itemsPerPage);
  const paginatedParLevels = parLevels.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  // Selection handlers
  const handleSelectParLevel = useCallback((id: string, selected: boolean) => {
    setSelectedParLevels(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        const allIds = new Set(parLevels.map(pl => pl.id));
        setSelectedParLevels(allIds);
      } else {
        setSelectedParLevels(new Set());
        exitSelectionMode();
      }
    },
    [parLevels, exitSelectionMode],
  );

  // Clear selection when exiting selection mode
  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedParLevels(new Set());
    }
  }, [isSelectionMode]);

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
            onClose={resetForm}
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
          onClose={() => setEditingParLevel(null)}
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
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteConfirmId(null);
          }}
          variant="danger"
        />
      </div>
    </ResponsivePageContainer>
  );
}
