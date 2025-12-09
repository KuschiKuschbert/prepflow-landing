'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { logger } from '@/lib/logger';
import { useOnRecipeShared } from '@/lib/personality/hooks';
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
    try {
      const response = await fetch('/api/recipe-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        // Trigger personality hook for recipe sharing
        onRecipeShared();

        await fetchRecipeShares();
        resetForm();
        setError(null);
        if (formData.shareType === 'pdf' && result.data.pdfContent) {
          downloadPDF(result.data.recipe, result.data.pdfContent);
        }
      } else {
        setError(result.message || 'Failed to share recipe');
      }
    } catch {
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
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
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
