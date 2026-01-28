import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { APIRecipe } from '../utils';

export function useSpecialsData() {
  const [inputInternal, setInputInternal] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<APIRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Search Timeout Ref
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Infinite Scroll Hook
  const { ref, inView } = useInView({
      threshold: 0,
      rootMargin: '100px', // Preload before hitting bottom
  });

  const fetchRecipes = async (
      reset: boolean = false,
      currentIngredients: string[] = ingredients,
      searchQuery: string = inputInternal,
      activeTags: string[] = [],
      activeCuisines: string[] = [],
      isReadyToCook: boolean = false
  ) => {

    // Resolve effective offset
    const currentOffset = reset ? 0 : offset;

    // Allow fetching if we have ANY criteria
    const hasCriteria = currentIngredients.length > 0 || searchQuery || activeTags.length > 0 || activeCuisines.length > 0 || true;

    if (!hasCriteria) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    try {
      let url = `/api/ai-specials/search?limit=50&offset=${currentOffset}`;

      const hasExplicitQuery = searchQuery && searchQuery.length > 0;
      const hasFilters = activeTags.length > 0;

      // 1. Build Text Query (q)
      if (hasExplicitQuery || hasFilters) {
          const parts = [];
          if (searchQuery) parts.push(searchQuery);
          if (hasFilters) parts.push(...activeTags);
          if (currentIngredients.length > 0) parts.push(...currentIngredients);

          url += `&q=${encodeURIComponent(parts.join(' '))}`;

      } else if (currentIngredients.length > 0) {
          url += `&ingredients=${encodeURIComponent(currentIngredients.join(','))}`;
      }

      // 2. Add Cuisine Filter
      if (activeCuisines.length > 0) {
          url += `&cuisine=${encodeURIComponent(activeCuisines.join(','))}`;
      }

      // 3. Inventory Logic
      url += `&use_stock=true`;

      if (isReadyToCook) {
        url += `&min_stock_match=100`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.data) {
        // Sort: Prioritize stock match percentage, then ingredient match count
        const sorted = data.data.sort((a: APIRecipe, b: APIRecipe) => {
           const stockA = a.stockMatchPercentage || 0;
           const stockB = b.stockMatchPercentage || 0;

           if (stockA !== stockB) {
               return stockB - stockA; // Higher stock match first
           }

           // Secondary sort: Number of matched search ingredients
           const matchA = a.matchCount || 0;
           const matchB = b.matchCount || 0;
           return matchB - matchA;
        });

        if (reset) {
            setRecipes(sorted);
            setOffset(50); // Next batch starts at 50
        } else {
            // Append unique recipes
            setRecipes((prev: APIRecipe[]) => {
                const map = new Map();
                prev.forEach(r => map.set(r.id, r));
                sorted.forEach((r: APIRecipe) => map.set(r.id, r));
                return Array.from(map.values()) as APIRecipe[];
            });
            setOffset(prev => prev + 50);
        }

        // Simple check for hasMore
        if (sorted.length < 50) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch recipes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = (
      activeTags: string[],
      activeCuisines: string[],
      isReadyToCook: boolean
  ) => {
      fetchRecipes(false, ingredients, inputInternal, activeTags, activeCuisines, isReadyToCook);
  };

  return {
    inputInternal,
    setInputInternal,
    ingredients,
    setIngredients,
    recipes,
    setRecipes,
    loading,
    hasMore,
    fetchRecipes,
    handleLoadMore,
    ref,
    inView,
    searchTimeout
  };
}
