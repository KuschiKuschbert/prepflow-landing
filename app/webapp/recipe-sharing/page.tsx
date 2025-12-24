'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { logger } from '@/lib/logger';
import { useOnRecipeShared } from '@/lib/personality/hooks';
import { useNotification } from '@/contexts/NotificationContext';
import { EmptyState } from './components/EmptyState';
import { ShareCard } from './components/ShareCard';
import { ShareFormModal } from './components/ShareFormModal';
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
  const { showSuccess, showError } = useNotification();
  const onRecipeShared = useOnRecipeShared();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeShares, setRecipeShares] = useState<RecipeShare[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipeId: '',
    shareType: 'pdf' as 'pdf' | 'link' | 'email',
    recipientEmail: '',
    notes: '',
  });
  const userId = 'user-123';

  useEffect(() => {
    fetchRecipes();
    fetchRecipeShares();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`/api/recipes?userId=${userId}`);
      const result = await response.json();
      if (result.success) setRecipes(result.data);
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
    } catch {
      setError('Failed to fetch recipe shares');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find the recipe for the share
    const recipe = recipes.find(r => r.id === formData.recipeId);
    if (!recipe) {
      showError('Recipe not found');
      return;
    }

    // Store original state for rollback
    const originalShares = [...recipeShares];
    const shareFormData = { ...formData };

    // Create temporary share for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempShare: RecipeShare = {
      id: tempId,
      recipe_id: shareFormData.recipeId,
      share_type: shareFormData.shareType,
      recipient_email:
        shareFormData.shareType === 'email' ? shareFormData.recipientEmail : undefined,
      notes: shareFormData.notes || undefined,
      status: 'pending',
      created_at: new Date().toISOString(),
      recipes: recipe,
    };

    // Optimistically add to UI immediately
    setRecipeShares(prev => [tempShare, ...prev]);
    resetForm();
    setError(null);

    // Trigger personality hook for recipe sharing
    onRecipeShared();

    try {
      const response = await fetch('/api/recipe-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareFormData),
      });
      const result = await response.json();
      if (result.success && result.data) {
        // Replace temp share with real one from server
        setRecipeShares(prev => prev.map(share => (share.id === tempId ? result.data : share)));
        showSuccess('Recipe shared successfully');

        if (shareFormData.shareType === 'pdf' && result.data.pdfContent) {
          downloadPDF(result.data.recipe, result.data.pdfContent);
        }
      } else {
        // Error - revert optimistic update
        setRecipeShares(originalShares);
        showError(result.message || result.error || 'Failed to share recipe');
      }
    } catch (err) {
      // Error - revert optimistic update
      setRecipeShares(originalShares);
      logger.error('Error sharing recipe:', err);
      showError("Couldn't share that recipe, chef. Try again.");
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">
              📤 {t('recipeSharing.title', 'Recipe Sharing')}
            </h1>
            <p className="text-[var(--foreground-muted)]">
              {t('recipeSharing.subtitle', 'Share your recipes as PDFs or links')}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            + {t('recipeSharing.shareRecipe', 'Share Recipe')}
          </button>
        </div>
        {error && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
            <p className="text-[var(--color-error)]">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {recipeShares.length === 0 ? (
            <EmptyState onShareClick={() => setShowForm(true)} />
          ) : (
            recipeShares.map(share => <ShareCard key={share.id} share={share} />)
          )}
        </div>
        <ShareFormModal
          isOpen={showForm}
          recipes={recipes}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onClose={resetForm}
        />
      </div>
    </ResponsivePageContainer>
  );
}
