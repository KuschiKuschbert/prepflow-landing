import { autoDetectCategory } from '@/lib/ingredients/category-detection';
import { logger } from '@/lib/logger';

interface FormData {
  ingredient_name?: string;
  brand?: string;
  storage_location?: string;
  category?: string;
}

export async function executeCategoryDetection(
  name: string,
  brand: string | undefined,
  storage: string | undefined,
  setFormData: React.Dispatch<React.SetStateAction<Partial<FormData>>>,
  setCategoryState: (cat: string) => void,
) {
  try {
    const { category } = await autoDetectCategory(
      name,
      brand,
      storage,
      true, // use AI
    );

    if (!category) return;

    // Only update if category is still empty (user hasn't manually set it)
    setFormData(prev => {
      if (!prev.category) {
        setCategoryState(category);
        return { ...prev, category };
      }
      return prev;
    });
  } catch (error) {
    logger.error('Error auto-detecting category:', error);
  }
}
