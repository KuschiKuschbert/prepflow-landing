'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';

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
    color: '#29E7CD'
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchKitchenSections();
    fetchMenuDishes();
  }, []);

  const fetchKitchenSections = async () => {
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
            color: formData.color
          }
        : {
            userId,
            name: formData.name,
            description: formData.description,
            color: formData.color
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
      color: section.color
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this kitchen section? All dishes will be unassigned.')) return;
    
    try {
      const response = await fetch(`/api/kitchen-sections?id=${id}`, {
        method: 'DELETE'
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
        body: JSON.stringify({ dishId, sectionId })
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
      color: '#29E7CD'
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
          <div className="animate-pulse">
            <div className="h-8 bg-[#1f1f1f] rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-[#1f1f1f] rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🍽️ {t('dishSections.title', 'Dish Sections')}</h1>
            <p className="text-gray-400">{t('dishSections.subtitle', 'Organize dishes by kitchen sections for prep lists')}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
          >
            + {t('dishSections.addSection', 'Add Section')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Kitchen Sections */}
        <div className="space-y-6">
          {kitchenSections.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('dishSections.noSections', 'No Kitchen Sections')}</h3>
              <p className="text-gray-400 mb-6">{t('dishSections.noSectionsDesc', 'Create kitchen sections to organize your dishes for prep lists')}</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {t('dishSections.createFirstSection', 'Create Your First Section')}
              </button>
            </div>
          ) : (
            kitchenSections.map((section) => (
              <div
                key={section.id}
                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6 hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${section.color}20` }}
                    >
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{section.name}</h3>
                      {section.description && (
                        <p className="text-sm text-gray-400">{section.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-[#29E7CD] hover:bg-[#29E7CD]/10 rounded-xl transition-colors"
                       title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                       title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Dishes in this section */}
                <div className="bg-[#2a2a2a]/30 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    {t('dishSections.dishesInSection', 'Dishes in this section')} ({section.menu_dishes.length})
                  </h4>
                  {section.menu_dishes.length === 0 ? (
                    <p className="text-sm text-gray-400">{t('dishSections.noDishesInSection', 'No dishes assigned to this section')}</p>
                  ) : (
                    <div className="space-y-2">
                      {section.menu_dishes.map((dish) => (
                        <div key={dish.id} className="flex items-center justify-between bg-[#1f1f1f] rounded-lg p-3">
                          <div>
                            <p className="text-white font-semibold text-sm">{dish.name}</p>
                            <p className="text-gray-400 text-xs">{dish.category}</p>
                          </div>
                          <button
                            onClick={() => handleAssignDish(dish.id, null)}
                            className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                             title="Unassign"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('dishSections.unassignedDishes', 'Unassigned Dishes')} ({getUnassignedDishes().length})
            </h2>
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="space-y-3">
                {getUnassignedDishes().map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between bg-[#2a2a2a]/30 rounded-lg p-4">
                    <div>
                      <p className="text-white font-semibold">{dish.name}</p>
                      <p className="text-gray-400 text-sm">{dish.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value=""
                        onChange={(e) => handleAssignDish(dish.id, e.target.value || null)}
                        className="px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      >
                        <option value="">{t('dishSections.assignToSection', 'Assign to section')}</option>
                        {kitchenSections.map((section) => (
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-3xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingSection ? t('dishSections.editSection', 'Edit Section') : t('dishSections.addSection', 'Add Section')}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('dishSections.sectionName', 'Section Name')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    placeholder="e.g., Hot Kitchen, Cold Kitchen, Pastry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('dishSections.description', 'Description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    rows={3}
                     placeholder="Optional description of this section"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('dishSections.color', 'Color')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-[#2a2a2a] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder="#29E7CD"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#2a2a2a]/80 transition-colors"
                  >
                    {t('dishSections.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    {editingSection ? t('dishSections.update', 'Update') : t('dishSections.create', 'Create')}
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
