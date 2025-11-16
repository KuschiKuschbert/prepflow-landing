'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useState } from 'react';
import { PrepListForm } from './components/PrepListForm';
import { PrepListCard } from './components/PrepListCard';
import { GenerateFromMenuModal } from './components/GenerateFromMenuModal';
import { PrepListPreview } from './components/PrepListPreview';
import { usePrepListsQuery } from './hooks/usePrepListsQuery';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import type {
  KitchenSection,
  Ingredient,
  PrepList,
  PrepListFormData,
  GeneratedPrepListData,
} from './types';
import { ListChecks, ChefHat } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { getCachedData, cacheData } from '@/lib/cache/data-cache';

export default function PrepListsPage() {
  const { t } = useTranslation();
  // Initialize with cached data for instant display
  const [prepLists, setPrepLists] = useState<PrepList[]>(() => getCachedData('prep_lists') || []);
  const [kitchenSections, setKitchenSections] = useState<KitchenSection[]>(
    () => getCachedData('kitchen_sections') || [],
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    () => getCachedData('prep_lists_ingredients') || [],
  );
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedPrepListData | null>(null);
  const [editingPrepList, setEditingPrepList] = useState<PrepList | null>(null);
  const [formData, setFormData] = useState<PrepListFormData>({
    kitchenSectionId: '',
    name: '',
    notes: '',
    items: [],
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const userId = 'user-123';
  const {
    data: prepListsData,
    isLoading: listsLoading,
    refetch: refetchPrepLists,
  } = usePrepListsQuery(page, pageSize, userId);

  // Fetch kitchen sections on mount (needed for display)
  useEffect(() => {
    const fetchKitchenSections = async () => {
      // Check cache first
      const cached = getCachedData('kitchen_sections');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setKitchenSections(cached);
        return; // Use cached data, skip API call
      }

      try {
        const response = await fetch(`/api/kitchen-sections?userId=${userId}`);
        const result = await response.json();

        if (result.success) {
          setKitchenSections(result.data);
          cacheData('kitchen_sections', result.data);
        }
      } catch (err) {
        console.error('Failed to fetch kitchen sections:', err);
      }
    };

    fetchKitchenSections();
  }, []);

  // Lazy load ingredients when form, generate modal, or preview is opened
  useEffect(() => {
    if (!showForm && !showGenerateModal && !showPreview) return; // Don't fetch until needed

    const fetchIngredients = async () => {
      // Check cache first
      const cached = getCachedData('prep_lists_ingredients');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setIngredients(cached);
        return; // Use cached data, skip API call
      }

      try {
        // Only fetch first 50 ingredients for form dropdown
        const response = await fetch(`/api/ingredients?page=1&pageSize=50`);
        const result = await response.json();

        if (result.success) {
          const items = result.data?.items || result.data || [];
          const ingredientsArray = Array.isArray(items) ? items : [];
          setIngredients(ingredientsArray);
          cacheData('prep_lists_ingredients', ingredientsArray);
        }
      } catch (err) {
        console.error('Failed to fetch ingredients:', err);
      }
    };

    fetchIngredients();
  }, [showForm, showGenerateModal, showPreview]);

  useEffect(() => {
    if (prepListsData?.items) {
      setPrepLists(prepListsData.items as any);
      cacheData('prep_lists', prepListsData.items);
    }
  }, [prepListsData]);

  // Removed fetchPrepLists - using refetchPrepLists from React Query instead

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
            items: formData.items.filter(item => item.ingredientId && item.quantity),
          }
        : {
            userId,
            kitchenSectionId: formData.kitchenSectionId,
            name: formData.name,
            notes: formData.notes,
            items: formData.items.filter(item => item.ingredientId && item.quantity),
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await refetchPrepLists();
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
        notes: item.notes || '',
      })),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prep list?')) return;

    try {
      const response = await fetch(`/api/prep-lists?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await refetchPrepLists();
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
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();

      if (result.success) {
        await refetchPrepLists();
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
      items: [...formData.items, { ingredientId: '', quantity: '', unit: '', notes: '' }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
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
      items: [],
    });
    setShowForm(false);
    setEditingPrepList(null);
  };

  const handleGenerateFromMenu = (data: GeneratedPrepListData) => {
    setGeneratedData(data);
    setShowPreview(true);
    setShowGenerateModal(false);
  };

  const handleSaveBatchPrepLists = async (
    prepLists: Array<{ sectionId: string | null; name: string; items: any[] }>,
  ) => {
    try {
      setError(null);
      const response = await fetch('/api/prep-lists/batch-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prepLists, userId }),
      });

      const result = await response.json();

      if (result.success) {
        await refetchPrepLists();
        setShowPreview(false);
        setGeneratedData(null);
        setError(null);
      } else {
        setError(result.message || 'Failed to save prep lists');
      }
    } catch (err) {
      setError('Failed to save prep lists');
      console.error('Error saving batch prep lists:', err);
    }
  };

  if (loading || listsLoading) {
    return <PageSkeleton />;
  }

  const total = prepListsData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <ResponsivePageContainer>
      <div className="min-h-screen bg-transparent py-8 text-white">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
              <Icon icon={ListChecks} size="lg" aria-hidden={true} />
              {t('prepLists.title', 'Prep Lists')}
            </h1>
            <p className="text-gray-400">
              {t('prepLists.subtitle', 'Create and manage kitchen prep lists by section')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-[#29E7CD]/10 px-6 py-3 font-semibold text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20"
            >
              <Icon icon={ChefHat} size="md" aria-hidden={true} />
              {t('prepLists.generateFromMenu', 'Generate from Menu')}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              + {t('prepLists.createPrepList', 'Create Prep List')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Prep Lists */}
        <div className="space-y-4">
          {prepLists.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
                <Icon icon={ListChecks} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t('prepLists.noPrepLists', 'No Prep Lists')}
              </h3>
              <p className="mb-6 text-gray-400">
                {t(
                  'prepLists.noPrepListsDesc',
                  'Create your first prep list to organize kitchen preparation',
                )}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
              >
                {t('prepLists.createFirstPrepList', 'Create Your First Prep List')}
              </button>
            </div>
          ) : (
            <>
              {prepLists.map(prepList => (
                <PrepListCard
                  key={prepList.id}
                  prepList={prepList}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages} ({total} items)
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <PrepListForm
              sections={kitchenSections}
              ingredients={ingredients}
              formData={formData as any}
              setFormData={setFormData as any}
              onSubmit={handleSubmit}
              onClose={resetForm}
              isEditing={!!editingPrepList}
            />
          </div>
        )}

        {/* Generate from Menu Modal */}
        {showGenerateModal && (
          <GenerateFromMenuModal
            onClose={() => setShowGenerateModal(false)}
            onGenerate={handleGenerateFromMenu}
          />
        )}

        {/* Prep List Preview */}
        {showPreview && generatedData && (
          <PrepListPreview
            data={generatedData}
            kitchenSections={kitchenSections}
            ingredients={ingredients}
            onClose={() => {
              setShowPreview(false);
              setGeneratedData(null);
            }}
            onSave={handleSaveBatchPrepLists}
          />
        )}
      </div>
    </ResponsivePageContainer>
  );
}
