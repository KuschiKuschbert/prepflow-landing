import { logger } from '@/lib/logger';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { APIRecipe } from '../utils';
import { buildSearchUrl, sortSearchResults } from './useSpecialsData/helpers';

export function useSpecialsData() {
  const [inputInternal, setInputInternal] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<APIRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px' });

  const fetchRecipes = async (
    reset: boolean = false,
    currentIngredients: string[] = ingredients,
    searchQuery: string = inputInternal,
    activeTags: string[] = [],
    activeCuisines: string[] = [],
    isReadyToCook: boolean = false,
  ) => {
    const currentOffset = reset ? 0 : offset;
    const hasCriteria =
      currentIngredients.length > 0 ||
      searchQuery ||
      activeTags.length > 0 ||
      activeCuisines.length > 0 ||
      true;
    if (!hasCriteria) {
      setRecipes([]);
      return;
    }
    setLoading(true);
    try {
      const url = buildSearchUrl(
        currentOffset,
        currentIngredients,
        searchQuery,
        activeTags,
        activeCuisines,
        isReadyToCook,
      );
      const res = await fetch(url);
      const data = await res.json();
      if (data.data) {
        const sorted = sortSearchResults(data.data);
        if (reset) {
          setRecipes(sorted);
          setOffset(50);
        } else {
          setRecipes((prev: APIRecipe[]) => {
            const map = new Map();
            prev.forEach(r => map.set(r.id, r));
            sorted.forEach((r: APIRecipe) => map.set(r.id, r));
            return Array.from(map.values()) as APIRecipe[];
          });
          setOffset(prev => prev + 50);
        }
        setHasMore(sorted.length >= 50);
      }
    } catch (error) {
      logger.error('Failed to fetch recipes', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = (
    activeTags: string[],
    activeCuisines: string[],
    isReadyToCook: boolean,
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
    searchTimeout,
  };
}
