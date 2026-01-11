/**
 * Utility functions for RecipeListSection
 */

export const SOURCES = [
  { value: '', label: 'All Sources' },
  { value: 'allrecipes', label: 'AllRecipes' },
  { value: 'food-network', label: 'Food Network' },
  { value: 'epicurious', label: 'Epicurious' },
  { value: 'bon-appetit', label: 'Bon Appétit' },
  { value: 'tasty', label: 'Tasty' },
  { value: 'serious-eats', label: 'Serious Eats' },
  { value: 'food52', label: 'Food52' },
  { value: 'simply-recipes', label: 'Simply Recipes' },
  { value: 'smitten-kitchen', label: 'Smitten Kitchen' },
  { value: 'the-kitchn', label: 'The Kitchn' },
  { value: 'delish', label: 'Delish' },
] as const;

export const FORMAT_FILTERS = [
  { value: 'all', label: 'All Recipes' },
  { value: 'formatted', label: 'Formatted' },
  { value: 'unformatted', label: 'Unformatted' },
] as const;

export const getSourceColor = (source: string): string => {
  const colors: Record<string, string> = {
    allrecipes: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'food-network': 'bg-red-500/20 text-red-300 border-red-500/30',
    epicurious: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'bon-appetit': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    tasty: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'serious-eats': 'bg-green-500/20 text-green-300 border-green-500/30',
    food52: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'simply-recipes': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'smitten-kitchen': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'the-kitchn': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    delish: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };
  return colors[source] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export const getRatingColor = (rating?: number): string => {
  if (!rating) return 'text-gray-400';
  if (rating >= 4.5) return 'text-green-400';
  if (rating >= 4.0) return 'text-yellow-400';
  return 'text-gray-400';
};

export const formatSourceName = (source: string): string => {
  return source.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getProxiedImageUrl = (imageUrl: string): string => {
  try {
    const url = new URL(imageUrl);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    }
  } catch {
    // If URL parsing fails, assume it's a relative URL and return as-is
  }
  return imageUrl;
};
