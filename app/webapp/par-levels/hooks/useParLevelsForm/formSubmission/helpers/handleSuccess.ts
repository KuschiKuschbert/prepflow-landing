import { cacheData } from '@/lib/cache/data-cache';
import type { ParLevel } from '../../../../types';

interface HandleSuccessParams {
  result: any;
  tempId: string;
  tempParLevel: ParLevel;
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  showSuccess: (message: string) => void;
  resetForm: () => void;
}

export function handleSuccess({
  result,
  tempId,
  tempParLevel,
  setParLevels,
  showSuccess,
  resetForm,
}: HandleSuccessParams) {
  const serverData = result.data;
  if (!serverData.ingredients && tempParLevel.ingredients)
    serverData.ingredients = tempParLevel.ingredients;
  setParLevels(prevItems => {
    const updated = prevItems.map(item => (item.id === tempId ? serverData : item));
    cacheData('par_levels', updated);
    return updated;
  });
  showSuccess('Par level created successfully');
  resetForm();
}




