'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useDishSectionActions } from './hooks/useDishSectionActions';
import { DishSectionsHeader } from './components/DishSectionsHeader';
import { SectionFormModal } from './components/SectionFormModal';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

import { logger } from '../../lib/logger';
interface KitchenSection {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  menu_dishes: MenuDish[];
}

interface MenuDish {
  id: string;
  name: string;
  description?: string;
  selling_price: number;
  category: string;
  kitchen_section_id?: string;
}

export default function DishSectionsPage() {
  const { t } = useTranslation();
  const [kitchenSections, setKitchenSections] = useState<KitchenSection[]>([]);
  const [menuDishes, setMenuDishes] = useState<MenuDish[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<KitchenSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#29E7CD',
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchKitchenSections();
    fetchMenuDishes();
  }, []);

  const fetchKitchenSections = async () => {
    // Disable loading state to prevent skeleton flashes during API errors
    // setLoading(true);
    try {
      const response = await fetch(`/api/kitchen-sections?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setKitchenSections(result.data);
      } else {
        setError(result.message || 'Failed to fetch kitchen sections');
      }
    } catch (err) {
      setError('Failed to fetch kitchen sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuDishes = async () => {
    try {
      const response = await fetch(`/api/menu-dishes?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setMenuDishes(result.data);
      }
    } catch (err) {
      logger.error('Failed to fetch menu dishes:', err);
    }
  };

  const {
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAssignDish,
    resetForm,
    getUnassignedDishes,
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
        <DishSectionsHeader onAddClick={() => setShowForm(true)} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Kitchen Sections */}
        <div className="space-y-6">
          {kitchenSections.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <Icon
                  icon={UtensilsCrossed}
                  size="xl"
                  className="text-[#29E7CD]"
                  aria-hidden={true}
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t('dishSections.noSections', 'No Kitchen Sections')}
              </h3>
              <p className="mb-6 text-gray-400">
                {t(
                  'dishSections.noSectionsDesc',
                  'Create kitchen sections to organize your dishes for prep lists',
                )}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
              >
                {t('dishSections.createFirstSection', 'Create Your First Section')}
              </button>
            </div>
          ) : (
            kitchenSections.map(section => (
              <div
                key={section.id}
                className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${section.color}20` }}
                    >
                      <Icon
                        icon={UtensilsCrossed}
                        size="md"
                        className="text-current"
                        aria-hidden={true}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{section.name}</h3>
                      {section.description && (
                        <p className="text-sm text-gray-400">{section.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
                      title="Edit"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-400/10"
                      title="Delete"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Dishes in this section */}
                <div className="rounded-xl bg-[#2a2a2a]/30 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-white">
                    {t('dishSections.dishesInSection', 'Dishes in this section')} (
                    {section.menu_dishes.length})
                  </h4>
                  {section.menu_dishes.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      {t('dishSections.noDishesInSection', 'No dishes assigned to this section')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {section.menu_dishes.map(dish => (
                        <div
                          key={dish.id}
                          className="flex items-center justify-between rounded-lg bg-[#1f1f1f] p-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{dish.name}</p>
                            <p className="text-xs text-gray-400">{dish.category}</p>
                          </div>
                          <button
                            onClick={() => handleAssignDish(dish.id, null)}
                            className="rounded p-1 text-red-400 transition-colors hover:bg-red-400/10"
                            title="Unassign"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Unassigned Dishes */}
        {getUnassignedDishes().length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {t('dishSections.unassignedDishes', 'Unassigned Dishes')} (
              {getUnassignedDishes().length})
            </h2>
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
              <div className="space-y-3">
                {getUnassignedDishes().map(dish => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between rounded-lg bg-[#2a2a2a]/30 p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{dish.name}</p>
                      <p className="text-sm text-gray-400">{dish.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value=""
                        onChange={e => handleAssignDish(dish.id, e.target.value || null)}
                        className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      >
                        <option value="">
                          {t('dishSections.assignToSection', 'Assign to section')}
                        </option>
                        {kitchenSections.map(section => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        <SectionFormModal
          show={showForm}
          editingSection={editingSection}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </div>
    </ResponsivePageContainer>
  );
}
