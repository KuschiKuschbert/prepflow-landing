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
    notes: '',
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchParLevels();
    fetchIngredients();
  }, []);

  const fetchParLevels = async () => {
    // Disable loading state to prevent skeleton flashes during API errors
    // setLoading(true);
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
            notes: formData.notes,
          }
        : {
            userId,
            ingredientId: formData.ingredientId,
            parLevel: parseFloat(formData.parLevel),
            reorderPoint: parseFloat(formData.reorderPoint),
            unit: formData.unit,
            notes: formData.notes,
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      notes: parLevel.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this par level?')) return;

    try {
      const response = await fetch(`/api/par-levels?id=${id}`, {
        method: 'DELETE',
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
      notes: '',
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
      <div className="min-h-screen bg-transparent text-white">
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
    <div className="min-h-screen bg-transparent text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              📦 {t('parLevels.title', 'Par Level Management')}
            </h1>
            <p className="text-gray-400">
              {t('parLevels.subtitle', 'Set minimum stock levels for automatic reordering')}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            + {t('parLevels.addParLevel', 'Add Par Level')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Par Levels List */}
        <div className="space-y-4">
          {parLevels.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <span className="text-3xl">📦</span>
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
            parLevels.map(parLevel => (
              <div
                key={parLevel.id}
                className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                        <span className="text-lg">📦</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {parLevel.ingredients.name}
                        </h3>
                        <p className="text-sm text-gray-400">{parLevel.ingredients.category}</p>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          {t('parLevels.parLevel', 'Par Level')}
                        </p>
                        <p className="font-semibold text-white">
                          {parLevel.par_level} {parLevel.unit}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          {t('parLevels.reorderPoint', 'Reorder Point')}
                        </p>
                        <p className="font-semibold text-white">
                          {parLevel.reorder_point} {parLevel.unit}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          {t('parLevels.status', 'Status')}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(parLevel)}`}
                        >
                          {getStatusText(parLevel)}
                        </span>
                      </div>
                    </div>

                    {parLevel.notes && <p className="text-sm text-gray-300">{parLevel.notes}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(parLevel)}
                      className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
                      title={String(t('parLevels.edit', 'Edit'))}
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
                      onClick={() => handleDelete(parLevel.id)}
                      className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-400/10"
                      title={String(t('parLevels.delete', 'Delete'))}
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
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingParLevel
                    ? t('parLevels.editParLevel', 'Edit Par Level')
                    : t('parLevels.addParLevel', 'Add Par Level')}
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
                {!editingParLevel && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('parLevels.ingredient', 'Ingredient')}
                    </label>
                    <select
                      value={formData.ingredientId}
                      onChange={e => setFormData({ ...formData, ingredientId: e.target.value })}
                      className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      required
                    >
                      <option value="">
                        {t('parLevels.selectIngredient', 'Select an ingredient')}
                      </option>
                      {ingredients.map(ingredient => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('parLevels.parLevel', 'Par Level')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.parLevel}
                    onChange={e => setFormData({ ...formData, parLevel: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    placeholder="e.g., 50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('parLevels.reorderPoint', 'Reorder Point')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.reorderPoint}
                    onChange={e => setFormData({ ...formData, reorderPoint: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    placeholder="e.g., 25"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('parLevels.unit', 'Unit')}
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    placeholder="e.g., kg, pieces, liters"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('parLevels.notes', 'Notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    rows={3}
                    placeholder={String(
                      t('parLevels.notesPlaceholder', 'Optional notes about this par level'),
                    )}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
                  >
                    {t('parLevels.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
                  >
                    {editingParLevel
                      ? t('parLevels.update', 'Update')
                      : t('parLevels.create', 'Create')}
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
