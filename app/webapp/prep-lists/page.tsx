'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

interface KitchenSection {
  id: string;
  name: string;
  color: string;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}

interface PrepListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: Ingredient;
}

interface PrepList {
  id: string;
  kitchen_section_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  kitchen_sections: KitchenSection;
  prep_list_items: PrepListItem[];
}

export default function PrepListsPage() {
  const { t } = useTranslation();
  const [prepLists, setPrepLists] = useState<PrepList[]>([]);
  const [kitchenSections, setKitchenSections] = useState<KitchenSection[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPrepList, setEditingPrepList] = useState<PrepList | null>(null);
  const [formData, setFormData] = useState({
    kitchenSectionId: '',
    name: '',
    notes: '',
    items: [] as Array<{
      ingredientId: string;
      quantity: string;
      unit: string;
      notes: string;
    }>
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchPrepLists();
    fetchKitchenSections();
    fetchIngredients();
  }, []);

  const fetchPrepLists = async () => {
    try {
      const response = await fetch(`/api/prep-lists?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setPrepLists(result.data);
      } else {
        setError(result.message || 'Failed to fetch prep lists');
      }
    } catch (err) {
      setError('Failed to fetch prep lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchKitchenSections = async () => {
    try {
      const response = await fetch(`/api/kitchen-sections?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setKitchenSections(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch kitchen sections:', err);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`/api/ingredients?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setIngredients(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch ingredients:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPrepList ? '/api/prep-lists' : '/api/prep-lists';
      const method = editingPrepList ? 'PUT' : 'POST';
      
      const body = editingPrepList 
        ? {
            id: editingPrepList.id,
            kitchenSectionId: formData.kitchenSectionId,
            name: formData.name,
            notes: formData.notes,
            status: 'draft',
            items: formData.items.filter(item => item.ingredientId && item.quantity)
          }
        : {
            userId,
            kitchenSectionId: formData.kitchenSectionId,
            name: formData.name,
            notes: formData.notes,
            items: formData.items.filter(item => item.ingredientId && item.quantity)
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPrepLists();
        resetForm();
        setError(null);
      } else {
        setError(result.message || 'Failed to save prep list');
      }
    } catch (err) {
      setError('Failed to save prep list');
    }
  };

  const handleEdit = (prepList: PrepList) => {
    setEditingPrepList(prepList);
    setFormData({
      kitchenSectionId: prepList.kitchen_section_id,
      name: prepList.name,
      notes: prepList.notes || '',
      items: prepList.prep_list_items.map(item => ({
        ingredientId: item.ingredient_id,
        quantity: item.quantity.toString(),
        unit: item.unit,
        notes: item.notes || ''
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prep list?')) return;
    
    try {
      const response = await fetch(`/api/prep-lists?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPrepLists();
      } else {
        setError(result.message || 'Failed to delete prep list');
      }
    } catch (err) {
      setError('Failed to delete prep list');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/prep-lists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPrepLists();
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ingredientId: '', quantity: '', unit: '', notes: '' }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      kitchenSectionId: '',
      name: '',
      notes: '',
      items: []
    });
    setShowForm(false);
    setEditingPrepList(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-400/10';
      case 'active': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📝 {t('prepLists.title', 'Prep Lists')}</h1>
            <p className="text-gray-400">{t('prepLists.subtitle', 'Create and manage kitchen prep lists by section')}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
          >
            + {t('prepLists.createPrepList', 'Create Prep List')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Prep Lists */}
        <div className="space-y-4">
          {prepLists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('prepLists.noPrepLists', 'No Prep Lists')}</h3>
              <p className="text-gray-400 mb-6">{t('prepLists.noPrepListsDesc', 'Create your first prep list to organize kitchen preparation')}</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {t('prepLists.createFirstPrepList', 'Create Your First Prep List')}
              </button>
            </div>
          ) : (
            prepLists.map((prepList) => (
              <div
                key={prepList.id}
                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6 hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${prepList.kitchen_sections.color}20` }}
                      >
                        <span className="text-lg">📝</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{prepList.name}</h3>
                        <p className="text-sm text-gray-400">{prepList.kitchen_sections.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('prepLists.status', 'Status')}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prepList.status)}`}>
                          {prepList.status.charAt(0).toUpperCase() + prepList.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('prepLists.items', 'Items')}</p>
                        <p className="text-white font-semibold">{prepList.prep_list_items.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('prepLists.created', 'Created')}</p>
                        <p className="text-white font-semibold">{new Date(prepList.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {prepList.notes && (
                      <p className="text-sm text-gray-300 mb-4">{prepList.notes}</p>
                    )}

                    {/* Prep Items Preview */}
                    {prepList.prep_list_items.length > 0 && (
                      <div className="bg-[#2a2a2a]/30 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-white mb-3">{t('prepLists.items', 'Items')}</h4>
                        <div className="space-y-2">
                          {prepList.prep_list_items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{item.ingredients.name}</span>
                              <span className="text-white font-semibold">{item.quantity} {item.unit}</span>
                            </div>
                          ))}
                          {prepList.prep_list_items.length > 3 && (
                            <p className="text-xs text-gray-400">+{prepList.prep_list_items.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {/* Status Dropdown */}
                    <select
                      value={prepList.status}
                      onChange={(e) => handleStatusChange(prepList.id, e.target.value)}
                      className="px-3 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(prepList)}
                        className="p-2 text-[#29E7CD] hover:bg-[#29E7CD]/10 rounded-xl transition-colors"
                         title={String(t('prepLists.edit', 'Edit'))}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(prepList.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                         title={String(t('prepLists.delete', 'Delete'))}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingPrepList ? t('prepLists.editPrepList', 'Edit Prep List') : t('prepLists.createPrepList', 'Create Prep List')}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('prepLists.kitchenSection', 'Kitchen Section')}
                    </label>
                    <select
                      value={formData.kitchenSectionId}
                      onChange={(e) => setFormData({ ...formData, kitchenSectionId: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    >
                      <option value="">{t('prepLists.selectSection', 'Select a kitchen section')}</option>
                      {kitchenSections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('prepLists.name', 'Prep List Name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder="e.g., Morning Prep - Hot Kitchen"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('prepLists.notes', 'Notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    rows={3}
                     placeholder={String(t('prepLists.notesPlaceholder', 'Optional notes about this prep list'))}
                  />
                </div>

                {/* Prep Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{t('prepLists.items', 'Items')}</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-2 bg-[#29E7CD]/10 text-[#29E7CD] rounded-xl hover:bg-[#29E7CD]/20 transition-colors text-sm font-semibold"
                    >
                      + {t('prepLists.addItem', 'Add Item')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="bg-[#2a2a2a]/30 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">{t('prepLists.ingredient', 'Ingredient')}</label>
                            <select
                              value={item.ingredientId}
                              onChange={(e) => updateItem(index, 'ingredientId', e.target.value)}
                              className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                              required
                            >
                              <option value="">{t('prepLists.selectIngredient', 'Select ingredient')}</option>
                              {ingredients.map((ingredient) => (
                                <option key={ingredient.id} value={ingredient.id}>
                                  {ingredient.name} ({ingredient.unit})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">{t('prepLists.quantity', 'Quantity')}</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">{t('prepLists.unit', 'Unit')}</label>
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(index, 'unit', e.target.value)}
                              className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                              placeholder="kg"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateItem(index, 'notes', e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent mr-3"
                             placeholder={String(t('prepLists.itemNotes', 'Item notes (optional)'))}
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#2a2a2a]/80 transition-colors"
                  >
                    {t('prepLists.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    {editingPrepList ? t('prepLists.update', 'Update') : t('prepLists.create', 'Create')}
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
