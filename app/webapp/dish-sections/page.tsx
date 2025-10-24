'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

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
      console.error('Failed to fetch menu dishes:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSection ? '/api/kitchen-sections' : '/api/kitchen-sections';
      const method = editingSection ? 'PUT' : 'POST';

      const body = editingSection
        ? {
            id: editingSection.id,
            name: formData.name,
            description: formData.description,
            color: formData.color,
          }
        : {
            userId,
            name: formData.name,
            description: formData.description,
            color: formData.color,
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await fetchKitchenSections();
        resetForm();
        setError(null);
      } else {
        setError(result.message || 'Failed to save kitchen section');
      }
    } catch (err) {
      setError('Failed to save kitchen section');
    }
  };

  const handleEdit = (section: KitchenSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description || '',
      color: section.color,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this kitchen section? All dishes will be unassigned.',
      )
    )
      return;

    try {
      const response = await fetch(`/api/kitchen-sections?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchKitchenSections();
        await fetchMenuDishes();
      } else {
        setError(result.message || 'Failed to delete kitchen section');
      }
    } catch (err) {
      setError('Failed to delete kitchen section');
    }
  };

  const handleAssignDish = async (dishId: string, sectionId: string | null) => {
    try {
      const response = await fetch('/api/assign-dish-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishId, sectionId }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchMenuDishes();
        await fetchKitchenSections();
      } else {
        setError(result.message || 'Failed to assign dish to section');
      }
    } catch (err) {
      setError('Failed to assign dish to section');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#29E7CD',
    });
    setShowForm(false);
    setEditingSection(null);
  };

  const getUnassignedDishes = () => {
    return menuDishes.filter(dish => !dish.kitchen_section_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="mt-6 space-y-4">
            <LoadingSkeleton variant="card" count={5} height="80px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              🍽️ {t('dishSections.title', 'Dish Sections')}
            </h1>
            <p className="text-gray-400">
              {t('dishSections.subtitle', 'Organize dishes by kitchen sections for prep lists')}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            + {t('dishSections.addSection', 'Add Section')}
          </button>
        </div>

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
                <span className="text-3xl">🍽️</span>
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
                      <span className="text-lg">🍽️</span>
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
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingSection
                    ? t('dishSections.editSection', 'Edit Section')
                    : t('dishSections.addSection', 'Add Section')}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 transition-colors hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('dishSections.sectionName', 'Section Name')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    placeholder="e.g., Hot Kitchen, Cold Kitchen, Pastry"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('dishSections.description', 'Description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    rows={3}
                    placeholder="Optional description of this section"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('dishSections.color', 'Color')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="h-12 w-12 cursor-pointer rounded-xl border border-[#2a2a2a]"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="#29E7CD"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
                  >
                    {t('dishSections.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
                  >
                    {editingSection
                      ? t('dishSections.update', 'Update')
                      : t('dishSections.create', 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
