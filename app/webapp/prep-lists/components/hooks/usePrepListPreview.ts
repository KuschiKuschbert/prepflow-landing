import { useState, useEffect } from 'react';
import type { GeneratedPrepListData, SectionData, KitchenSection } from '../../types';
import { usePrepListHandlers } from './usePrepListHandlers';

interface UsePrepListPreviewProps {
  data: GeneratedPrepListData;
  kitchenSections: KitchenSection[];
  ingredients: Array<{ id: string; name?: string; ingredient_name?: string; unit: string }>;
}

export function usePrepListPreview({
  data,
  kitchenSections,
  ingredients,
}: UsePrepListPreviewProps) {
  const [sections, setSections] = useState<SectionData[]>(data.sections);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSections(data.sections);
  }, [data]);

  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  const {
    handleQuantityChange,
    handleRemoveIngredient,
    handleAddIngredient,
    handleIngredientSelect,
    handleSectionChange,
  } = usePrepListHandlers({
    sections,
    setSections,
    kitchenSections,
    safeIngredients,
  });

  const prepareSaveData = () => {
    return sections
      .filter(section => section.aggregatedIngredients.length > 0)
      .map(section => ({
        sectionId: section.sectionId,
        name: `${data.menuName} - ${section.sectionName}`,
        items: section.aggregatedIngredients
          .filter(item => item.ingredientId && item.totalQuantity > 0)
          .map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.totalQuantity.toString(),
            unit: item.unit,
            notes: '',
          })),
      }))
      .filter(prepList => prepList.items.length > 0);
  };

  return {
    sections,
    saving,
    error,
    setSaving,
    setError,
    handleQuantityChange,
    handleRemoveIngredient,
    handleAddIngredient,
    handleIngredientSelect,
    handleSectionChange,
    prepareSaveData,
  };
}
