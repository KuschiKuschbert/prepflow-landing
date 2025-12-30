/**
 * Handle batch prep list creation with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { PrepList, GeneratedPrepListData } from '../../types';

interface HandleSaveBatchPrepListsParams {
  prepListsToCreate: Array<{ sectionId: string | null; name: string; items: any[] }>;
  userId: string;
  currentPrepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  setError: (error: string | null) => void;
  setShowPreview: (show: boolean) => void;
  setGeneratedData: (data: GeneratedPrepListData | null) => void;
  generatedData: GeneratedPrepListData | null;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleSaveBatchPrepLists({
  prepListsToCreate,
  userId,
  currentPrepLists,
  setPrepLists,
  setError,
  setShowPreview,
  setGeneratedData,
  generatedData,
  showSuccess,
  showError,
}: HandleSaveBatchPrepListsParams): Promise<void> {
  // Store original state for rollback
  const originalPrepLists = [...currentPrepLists];

  // Create temporary prep lists for optimistic update
  const tempPrepLists: PrepList[] = prepListsToCreate.map(
    (prepList, index) =>
      ({
        id: `temp-${Date.now()}-${index}`,
        name: prepList.name,
        kitchen_section_id: prepList.sectionId || '',
        notes: undefined,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        kitchen_sections: {
          id: prepList.sectionId || '',
          name: '',
          color: '',
        },
        prep_list_items: [],
      }) as PrepList,
  );

  // Optimistically add to UI immediately
  setPrepLists(prev => [...prev, ...tempPrepLists]);
  setError(null);
  setShowPreview(false);
  setGeneratedData(null);

  try {
    const response = await fetch('/api/prep-lists/batch-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prepLists: prepListsToCreate, userId }),
    });

    const result = await response.json();

    if (result.success && result.prepLists) {
      // Replace temp prep lists with real ones from server
      setPrepLists(prev =>
        prev.map(list => {
          const tempIndex = tempPrepLists.findIndex(temp => temp.id === list.id);
          return tempIndex !== -1 && result.prepLists[tempIndex]
            ? result.prepLists[tempIndex]
            : list;
        }),
      );
      showSuccess(
        `Successfully created ${result.prepLists.length} prep list${result.prepLists.length > 1 ? 's' : ''}`,
      );
    } else {
      // Rollback on error
      setPrepLists(originalPrepLists);
      setShowPreview(true);
      setGeneratedData(generatedData);
      const errorMsg = result.message || 'Failed to save prep lists';
      setError(errorMsg);
      showError(errorMsg);
    }
  } catch (err) {
    // Rollback on error
    setPrepLists(originalPrepLists);
    setShowPreview(true);
    setGeneratedData(generatedData);
    logger.error('Error saving batch prep lists:', err);
    const errorMsg = 'Failed to save prep lists. Please check your connection and try again.';
    setError(errorMsg);
    showError(errorMsg);
  }
}
