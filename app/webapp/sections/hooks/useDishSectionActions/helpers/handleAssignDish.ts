interface HandleAssignDishParams {
  fetchMenuDishes: () => Promise<void>;
  fetchKitchenSections: () => Promise<void>;
  setError: (error: string | null) => void;
}

export async function handleAssignDish(
  dishId: string,
  sectionId: string | null,
  { fetchMenuDishes, fetchKitchenSections, setError }: HandleAssignDishParams,
) {
  try {
    const response = await fetch('/api/assign-dish-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, sectionId }),
    });
    const result = await response.json();
    if (result.success) {
      await fetchMenuDishes();
      await fetchKitchenSections();
    } else {
      setError(result.message || 'Failed to assign dish to section');
    }
  } catch (err) {
    setError('Failed to assign dish to section');
  }
}




