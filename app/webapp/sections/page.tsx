'use client';

import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useDishSectionActions } from './hooks/useDishSectionActions';
import { DishSectionsHeader } from './components/DishSectionsHeader';
import { SectionFormModal } from './components/SectionFormModal';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { markFirstDone } from '@/lib/page-help/first-done-storage';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { useSectionsData } from './hooks/useSectionsData';
import { SectionsEmptyState } from './components/SectionsEmptyState';
import { SectionsList } from './components/SectionsList';
import { UnassignedDishes } from './components/UnassignedDishes';
import type { KitchenSection } from './types';

export default function DishSectionsPage() {
  const userId = 'user-123';
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<KitchenSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#29E7CD',
  });

  const {
    kitchenSections,
    menuDishes,
    loading,
    error,
    setKitchenSections,
    setMenuDishes,
    setError,
    fetchKitchenSections,
    fetchMenuDishes,
  } = useSectionsData(userId);

  // Mark first done for InlineHint/RescueNudge when user creates first section
  useEffect(() => {
    if (kitchenSections.length > 0) markFirstDone('sections');
  }, [kitchenSections.length]);

  const {
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAssignDish,
    resetForm,
    getUnassignedDishes,
    ConfirmDialog,
  } = useDishSectionActions({
    userId,
    kitchenSections,
    menuDishes,
    editingSection,
    formData,
    setKitchenSections,
    setMenuDishes,
    setError,
    setFormData,
    setShowForm,
    setEditingSection,
    fetchKitchenSections,
    fetchMenuDishes,
  });

  if (loading) {
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
        <DishSectionsHeader onAddClick={() => setShowForm(true)} />
        {PAGE_TIPS_CONFIG.sections && (
          <div className="mb-6">
            <PageTipsCard config={PAGE_TIPS_CONFIG.sections} />
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
            <p className="text-[var(--color-error)]">{error}</p>
          </div>
        )}
        <div className="space-y-6">
          {kitchenSections.length === 0 ? (
            <SectionsEmptyState onAddClick={() => setShowForm(true)} />
          ) : (
            <SectionsList
              sections={kitchenSections}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUnassignDish={dishId => handleAssignDish(dishId, null)}
            />
          )}
        </div>

        <UnassignedDishes
          unassignedDishes={getUnassignedDishes()}
          sections={kitchenSections}
          onAssignDish={handleAssignDish}
        />
        <SectionFormModal
          show={showForm}
          editingSection={editingSection}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
        <ConfirmDialog />
      </div>
    </ResponsivePageContainer>
  );
}
