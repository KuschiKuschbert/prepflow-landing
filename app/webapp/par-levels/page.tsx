'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}

interface ParLevel {
  id: string;
  ingredient_id: string;
  par_level: number;
  reorder_point: number;
  unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  ingredients: Ingredient;
}

export default function ParLevelsPage() {
  const { t } = useTranslation();
  const [parLevels, setParLevels] = useState<ParLevel[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingParLevel, setEditingParLevel] = useState<ParLevel | null>(null);
  const [formData, setFormData] = useState({
    ingredientId: '',
    parLevel: '',
    reorderPoint: '',
    unit: '',
    notes: ''
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchParLevels();
    fetchIngredients();
  }, []);

  const fetchParLevels = async () => {
    try {
      const response = await fetch(`/api/par-levels?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setParLevels(result.data);
      } else {
        setError(result.message || 'Failed to fetch par levels');
      }
    } catch (err) {
      setError('Failed to fetch par levels');
    } finally {
      setLoading(false);
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
      const url = editingParLevel ? '/api/par-levels' : '/api/par-levels';
      const method = editingParLevel ? 'PUT' : 'POST';
      
      const body = editingParLevel 
        ? {
            id: editingParLevel.id,
            parLevel: parseFloat(formData.parLevel),
            reorderPoint: parseFloat(formData.reorderPoint),
            unit: formData.unit,
            notes: formData.notes
          }
        : {
            userId,
            ingredientId: formData.ingredientId,
            parLevel: parseFloat(formData.parLevel),
            reorderPoint: parseFloat(formData.reorderPoint),
            unit: formData.unit,
            notes: formData.notes
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchParLevels();
        resetForm();
        setError(null);
      } else {
        setError(result.message || 'Failed to save par level');
      }
    } catch (err) {
      setError('Failed to save par level');
    }
  };

  const handleEdit = (parLevel: ParLevel) => {
    setEditingParLevel(parLevel);
    setFormData({
      ingredientId: parLevel.ingredient_id,
      parLevel: parLevel.par_level.toString(),
      reorderPoint: parLevel.reorder_point.toString(),
      unit: parLevel.unit,
      notes: parLevel.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this par level?')) return;
    
    try {
      const response = await fetch(`/api/par-levels?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchParLevels();
      } else {
        setError(result.message || 'Failed to delete par level');
      }
    } catch (err) {
      setError('Failed to delete par level');
    }
  };

  const resetForm = () => {
    setFormData({
      ingredientId: '',
      parLevel: '',
      reorderPoint: '',
      unit: '',
      notes: ''
    });
    setShowForm(false);
    setEditingParLevel(null);
  };

  const getStatusColor = (parLevel: ParLevel) => {
    // This would be calculated based on current stock levels
    // For now, we'll use a mock calculation
    const currentStock = Math.random() * parLevel.par_level * 2; // Mock current stock
    
    if (currentStock <= parLevel.reorder_point) {
      return 'text-red-400 bg-red-400/10';
    } else if (currentStock <= parLevel.par_level) {
      return 'text-yellow-400 bg-yellow-400/10';
    } else {
      return 'text-green-400 bg-green-400/10';
    }
  };

  const getStatusText = (parLevel: ParLevel) => {
    const currentStock = Math.random() * parLevel.par_level * 2; // Mock current stock
    
    if (currentStock <= parLevel.reorder_point) {
      return 'Reorder Now';
    } else if (currentStock <= parLevel.par_level) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="space-y-4 mt-6">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📦 {t('parLevels.title', 'Par Level Management')}</h1>
            <p className="text-gray-400">{t('parLevels.subtitle', 'Set minimum stock levels for automatic reordering')}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
          >
            + {t('parLevels.addParLevel', 'Add Par Level')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Par Levels List */}
        <div className="space-y-4">
          {parLevels.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('parLevels.noParLevels', 'No Par Levels Set')}</h3>
              <p className="text-gray-400 mb-6">{t('parLevels.noParLevelsDesc', 'Set par levels to automate your inventory management')}</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-2xl hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {t('parLevels.addFirstParLevel', 'Add Your First Par Level')}
              </button>
            </div>
          ) : (
            parLevels.map((parLevel) => (
              <div
                key={parLevel.id}
                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6 hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-xl flex items-center justify-center">
                        <span className="text-lg">📦</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{parLevel.ingredients.name}</h3>
                        <p className="text-sm text-gray-400">{parLevel.ingredients.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('parLevels.parLevel', 'Par Level')}</p>
                        <p className="text-white font-semibold">{parLevel.par_level} {parLevel.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('parLevels.reorderPoint', 'Reorder Point')}</p>
                        <p className="text-white font-semibold">{parLevel.reorder_point} {parLevel.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('parLevels.status', 'Status')}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(parLevel)}`}>
                          {getStatusText(parLevel)}
                        </span>
                      </div>
                    </div>
                    
                    {parLevel.notes && (
                      <p className="text-sm text-gray-300">{parLevel.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(parLevel)}
                      className="p-2 text-[#29E7CD] hover:bg-[#29E7CD]/10 rounded-xl transition-colors"
                       title={String(t('parLevels.edit', 'Edit'))}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(parLevel.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                       title={String(t('parLevels.delete', 'Delete'))}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-3xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingParLevel ? t('parLevels.editParLevel', 'Edit Par Level') : t('parLevels.addParLevel', 'Add Par Level')}
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
                {!editingParLevel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('parLevels.ingredient', 'Ingredient')}
                    </label>
                    <select
                      value={formData.ingredientId}
                      onChange={(e) => setFormData({ ...formData, ingredientId: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    >
                      <option value="">{t('parLevels.selectIngredient', 'Select an ingredient')}</option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('parLevels.parLevel', 'Par Level')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.parLevel}
                    onChange={(e) => setFormData({ ...formData, parLevel: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    placeholder="e.g., 50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('parLevels.reorderPoint', 'Reorder Point')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    placeholder="e.g., 25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('parLevels.unit', 'Unit')}
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    placeholder="e.g., kg, pieces, liters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('parLevels.notes', 'Notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    rows={3}
                     placeholder={String(t('parLevels.notesPlaceholder', 'Optional notes about this par level'))}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#2a2a2a]/80 transition-colors"
                  >
                    {t('parLevels.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    {editingParLevel ? t('parLevels.update', 'Update') : t('parLevels.create', 'Create')}
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
