import { useEffect, useState } from 'react';

export interface UseSpecialsFiltersProps {
  onFilterChange: () => void;
}

export function useSpecialsFilters(onFilterChange: () => void) {
  const [readyToCook, setReadyToCook] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const toggleFilterTag = (tag: string) => {
    const newTags = filterTags.includes(tag)
      ? filterTags.filter(t => t !== tag)
      : [...filterTags, tag];

    setFilterTags(newTags);
    // onFilterChange will be handled by the effect or manually called
    // In original code, it called fetchRecipes directly.
    // We'll let the parent handle the fetching based on state changes or expose a refetch trigger
  };

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter(c => c !== cuisine)
      : [...selectedCuisines, cuisine];

    setSelectedCuisines(newCuisines);
  };

  // Effect to trigger fetch when readyToCook changes (debounce is handled in parent or here)
  useEffect(() => {
    // In original code, readyToCook triggered a debounce fetch.
    // We will expose the state and let the main hook handle the effect
    onFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToCook]); // Filters usually trigger re-fetch

  return {
    readyToCook,
    setReadyToCook,
    filterTags,
    setFilterTags,
    selectedCuisines,
    setSelectedCuisines,
    toggleFilterTag,
    toggleCuisine
  };
}
