'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';

import { logger } from '@/lib/logger';
interface Recipe {
  id: string;
  recipe_name: string;
  description?: string;
  instructions?: string;
  notes?: string;
  created_at: string;
}

interface RecipeShare {
  id: string;
  recipe_id: string;
  share_type: 'pdf' | 'link' | 'email';
  recipient_email?: string;
  notes?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  created_at: string;
  recipes: Recipe;
}

export default function RecipeSharingPage() {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeShares, setRecipeShares] = useState<RecipeShare[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipeId: '',
    shareType: 'pdf' as 'pdf' | 'link' | 'email',
    recipientEmail: '',
    notes: '',
  });

  // Mock user ID for now
  const userId = 'user-123';

  useEffect(() => {
    fetchRecipes();
    fetchRecipeShares();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`/api/recipes?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setRecipes(result.data);
      }
    } catch (err) {
      logger.error('Failed to fetch recipes:', err);
    }
  };

  const fetchRecipeShares = async () => {
    try {
      const response = await fetch(`/api/recipe-share?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        setRecipeShares(result.data);
      } else {
        setError(result.message || 'Failed to fetch recipe shares');
      }
    } catch (err) {
      setError('Failed to fetch recipe shares');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/recipe-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchRecipeShares();
        resetForm();
        setError(null);

        // If PDF generation, trigger download
        if (formData.shareType === 'pdf' && result.data.pdfContent) {
          downloadPDF(result.data.recipe, result.data.pdfContent);
        }
      } else {
        setError(result.message || 'Failed to share recipe');
      }
    } catch (err) {
      setError('Failed to share recipe');
    }
  };

  const downloadPDF = (recipe: Recipe, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${recipe.recipe_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetForm = () => {
    setFormData({
      recipeId: '',
      shareType: 'pdf',
      recipientEmail: '',
      notes: '',
    });
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'sent':
        return 'text-blue-400 bg-blue-400/10';
      case 'delivered':
        return 'text-green-400 bg-green-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getShareTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'link':
        return '🔗';
      case 'email':
        return '📧';
      default:
        return '📤';
    }
  };

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              📤 {t('recipeSharing.title', 'Recipe Sharing')}
            </h1>
            <p className="text-gray-400">
              {t('recipeSharing.subtitle', 'Share your recipes as PDFs or links')}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            + {t('recipeSharing.shareRecipe', 'Share Recipe')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Recipe Shares */}
        <div className="space-y-4">
          {recipeShares.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t('recipeSharing.noShares', 'No Recipe Shares')}
              </h3>
              <p className="mb-6 text-gray-400">
                {t('recipeSharing.noSharesDesc', 'Share your recipes with others as PDFs or links')}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
              >
                {t('recipeSharing.shareFirstRecipe', 'Share Your First Recipe')}
              </button>
            </div>
          ) : (
            recipeShares.map(share => (
              <div
                key={share.id}
                className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                        <span className="text-lg">{getShareTypeIcon(share.share_type)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {share.recipes.recipe_name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {share.share_type.toUpperCase()} •{' '}
                          {share.recipient_email || 'No recipient'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center space-x-4">
                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          {t('recipeSharing.status', 'Status')}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(share.status)}`}
                        >
                          {share.status.charAt(0).toUpperCase() + share.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          {t('recipeSharing.shared', 'Shared')}
                        </p>
                        <p className="font-semibold text-white">
                          {new Date(share.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {share.notes && <p className="text-sm text-gray-300">{share.notes}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Share Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {t('recipeSharing.shareRecipe', 'Share Recipe')}
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
                    {t('recipeSharing.selectRecipe', 'Select Recipe')}
                  </label>
                  <select
                    value={formData.recipeId}
                    onChange={e => setFormData({ ...formData, recipeId: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    required
                  >
                    <option value="">
                      {t('recipeSharing.chooseRecipe', 'Choose a recipe to share')}
                    </option>
                    {recipes.map(recipe => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.recipe_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('recipeSharing.shareType', 'Share Type')}
                  </label>
                  <select
                    value={formData.shareType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        shareType: e.target.value as 'pdf' | 'link' | 'email',
                      })
                    }
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    required
                  >
                    <option value="pdf">📄 PDF Download</option>
                    <option value="link">🔗 Shareable Link</option>
                    <option value="email">📧 Email Recipe</option>
                  </select>
                </div>

                {formData.shareType === 'email' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('recipeSharing.recipientEmail', 'Recipient Email')}
                    </label>
                    <input
                      type="email"
                      value={formData.recipientEmail}
                      onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
                      className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="recipient@example.com"
                      required={formData.shareType === 'email'}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('recipeSharing.notes', 'Notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    rows={3}
                    placeholder={String(
                      t(
                        'recipeSharing.notesPlaceholder',
                        'Optional message to include with the shared recipe',
                      ),
                    )}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
                  >
                    {t('recipeSharing.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
                  >
                    {t('recipeSharing.share', 'Share')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ResponsivePageContainer>
  );
}
