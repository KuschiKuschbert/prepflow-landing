import type { SectionData, KitchenSection } from '../../../types';

interface UsePrepListHandlersProps {
  sections: SectionData[];
  setSections: (sections: SectionData[]) => void;
  kitchenSections: KitchenSection[];
  safeIngredients: Array<{ id: string; name?: string; ingredient_name?: string; unit: string }>;
}

export function usePrepListHandlers({
  sections,
  setSections,
  kitchenSections,
  safeIngredients,
}: UsePrepListHandlersProps) {
  const handleQuantityChange = (
    sectionIndex: number,
    ingredientIndex: number,
    newQuantity: number,
  ) => {
    const updatedSections = [...sections];
    const ingredient = updatedSections[sectionIndex].aggregatedIngredients[ingredientIndex];
    if (ingredient && newQuantity >= 0) {
      ingredient.totalQuantity = newQuantity;
      setSections(updatedSections);
    }
  };

  const handleRemoveIngredient = (sectionIndex: number, ingredientIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].aggregatedIngredients.splice(ingredientIndex, 1);
    setSections(updatedSections);
  };

  const handleAddIngredient = (sectionIndex: number, ingredientId?: string) => {
    const updatedSections = [...sections];
    const ingredient = safeIngredients.find(ing => ing.id === ingredientId);
    if (ingredient || !ingredientId) {
      const ingredientName = ingredient?.name || ingredient?.ingredient_name || '';
      updatedSections[sectionIndex].aggregatedIngredients.push({
        ingredientId: ingredientId || '',
        name: ingredientName,
        totalQuantity: 0,
        unit: ingredient?.unit || '',
        sources: [],
      });
      setSections(updatedSections);
    }
  };

  const handleIngredientSelect = (
    sectionIndex: number,
    ingredientIndex: number,
    ingredientId: string,
  ) => {
    const updatedSections = [...sections];
    const ingredient = safeIngredients.find(ing => ing.id === ingredientId);
    if (ingredient) {
      const ingredientName = ingredient.name || ingredient.ingredient_name || '';
      updatedSections[sectionIndex].aggregatedIngredients[ingredientIndex] = {
        ...updatedSections[sectionIndex].aggregatedIngredients[ingredientIndex],
        ingredientId: ingredient.id,
        name: ingredientName,
        unit: ingredient.unit,
      };
      setSections(updatedSections);
    }
  };

  const handleSectionChange = (sectionIndex: number, newSectionId: string | null) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    const newSectionName =
      newSectionId === null
        ? 'Uncategorized'
        : kitchenSections.find(s => s.id === newSectionId)?.name || 'Unknown';

    section.sectionId = newSectionId;
    section.sectionName = newSectionName;
    setSections(updatedSections);
  };

  return {
    handleQuantityChange,
    handleRemoveIngredient,
    handleAddIngredient,
    handleIngredientSelect,
    handleSectionChange,
  };
}
