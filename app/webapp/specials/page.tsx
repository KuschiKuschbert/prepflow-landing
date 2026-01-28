'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Search, Sparkles, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { UnifiedRecipeModal } from '../recipes/components/UnifiedRecipeModal';
import { RecipeIngredientWithDetails, Recipe as UnifiedRecipe } from '../recipes/types';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { RecipeCard } from './components/RecipeCard';
import { RecipeCardSkeleton } from './components/RecipeCardSkeleton';
import { usePhotoUpload } from './hooks/usePhotoUpload';

interface AIIngredient {
  name: string;
  original_text?: string;
  quantity?: number;
  unit?: string;
}

// The API may return recipe_name instead of name
interface APIRecipe {
  id: string;
  name?: string;
  recipe_name?: string;
  image_url: string;
  ingredients: (AIIngredient | string)[];
  instructions?: string[];
  description?: string;
  meta?: {
    prep_time_minutes?: number;
    cook_time_minutes?: number;
  };
  matchCount?: number;
  stockMatchPercentage?: number;
  missingIngredients?: string[];
}

import { convertToStandardUnit } from '@/lib/unit-conversion';

// Ingredient parser with metric conversion - handles structured ingredient objects or strings
function parseIngredient(ing: AIIngredient | string, index: number): RecipeIngredientWithDetails {
    let quantity = 1;
    let unit = 'pc';
    let name = '';

    // Handle string ingredients
    if (typeof ing === 'string') {
        const parsed = parseIngredientString(ing);
        if (parsed) {
            quantity = parsed.quantity;
            unit = parsed.unit;
            name = parsed.name;
        } else {
            // Fallback if parsing failed
            name = ing.trim();
        }
    } else {
        // Handle object ingredients
        name = ing.name || 'Unknown ingredient';

        // If we have quantity and unit from the object, use them
        if (ing.quantity !== undefined && ing.quantity !== null) {
            quantity = ing.quantity;
        }
        if (ing.unit) {
            unit = ing.unit;
        }

        // If quantity is still 1 and unit is 'pc', try parsing original_text
        if (quantity === 1 && unit === 'pc' && ing.original_text) {
            const parsed = parseIngredientString(ing.original_text);
            if (parsed && (parsed.quantity !== 1 || parsed.unit !== 'pc')) {
                quantity = parsed.quantity;
                unit = parsed.unit;
                // Prefer the structured name over parsed name
                // name stays as ing.name
            }
        }
    }

    // Convert to metric using existing library
    const converted = convertToStandardUnit(quantity, unit, name);

    // Generate stable unique ID with index to avoid duplicates
    const id = `ing-${index}-${btoa(encodeURIComponent(name.slice(0, 20))).substring(0, 8)}`;

    return {
        id,
        recipe_id: 'ai-recipe',
        ingredient_id: id,
        ingredient_name: name,
        quantity: converted.value,
        unit: converted.unit,
        cost_per_unit: 0,
        total_cost: 0,
        ingredients: {
            id,
            ingredient_name: name,
            cost_per_unit: 0,
            unit: converted.unit
        }
    };
}

// Helper function to parse ingredient strings like "2 cups flour" or "1/2 lb chicken"
// Now using shared utility
import { parseIngredientString } from '@/lib/recipe-normalization/ingredient-parser';

// Normalize unit abbreviations to standard forms
function normalizeUnit(unit: string): string {
    const lower = unit.toLowerCase().replace(/\.$/, '');
    const unitMap: Record<string, string> = {
        'c': 'cup', 'cups': 'cup',
        'tbsp': 'tbsp', 'tablespoon': 'tbsp', 'tablespoons': 'tbsp',
        'tsp': 'tsp', 'teaspoon': 'tsp', 'teaspoons': 'tsp',
        'lb': 'lb', 'lbs': 'lb', 'pound': 'lb', 'pounds': 'lb',
        'oz': 'oz', 'ounce': 'oz', 'ounces': 'oz',
        'g': 'g', 'gram': 'g', 'grams': 'g',
        'kg': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
        'l': 'L', 'liter': 'L', 'liters': 'L', 'litre': 'L', 'litres': 'L',
        'ml': 'ml', 'milliliter': 'ml', 'milliliters': 'ml',
        'pc': 'pc', 'piece': 'pc', 'pieces': 'pc',
        'whole': 'pc', 'large': 'pc', 'medium': 'pc', 'small': 'pc',
    };
    return unitMap[lower] || lower;
}

function adaptAiToUnified(aiRecipe: APIRecipe): { recipe: UnifiedRecipe, ingredients: RecipeIngredientWithDetails[] } {
    // Debug log to trace data
    // eslint-disable-next-line no-console
    console.log('[Specials] Adapting recipe:', {
        id: aiRecipe.id,
        name: aiRecipe.name,
        recipe_name: aiRecipe.recipe_name,
        ingredientsCount: aiRecipe.ingredients?.length,
        sampleIngredient: aiRecipe.ingredients?.[0]
    });

    const ingredients = (aiRecipe.ingredients || []).map((ing, idx) => {
        const parsed = parseIngredient(ing, idx);

        // Check if this ingredient was flagged as missing by the API
        let originalName = '';
        if (typeof ing === 'string') {
            originalName = ing;
        } else if (typeof ing === 'object' && ing !== null) {
            originalName = ing.name || '';
        }

        if (originalName && aiRecipe.missingIngredients?.includes(originalName)) {
            parsed.is_missing = true;
        }

        return parsed;
    });

    // Format Instructions
    let instructionsStr = '';
    if (Array.isArray(aiRecipe.instructions)) {
        instructionsStr = aiRecipe.instructions.join('\n\n');
    } else if (typeof aiRecipe.instructions === 'string') {
        instructionsStr = aiRecipe.instructions;
    }

    // Create Unified Recipe
    const unified: UnifiedRecipe = {
        id: aiRecipe.id,
        recipe_name: aiRecipe.name || aiRecipe.recipe_name || 'Untitled Recipe',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        yield: 4, // Default assumption for AI recipes
        yield_unit: 'portions',
        image_url: aiRecipe.image_url,
        // Fill required fields
        category: 'Specials',
        description: aiRecipe.description || `Prep: ${aiRecipe.meta?.prep_time_minutes}m | Cook: ${aiRecipe.meta?.cook_time_minutes}m`,
        instructions: instructionsStr,
        notes: `Prep: ${aiRecipe.meta?.prep_time_minutes}m | Cook: ${aiRecipe.meta?.cook_time_minutes}m`
    };

    return { recipe: unified, ingredients };
}

export default function AISpecialsPage() {
  const [inputInternal, setInputInternal] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<APIRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  // useInventory is now implicit (always calculate match %), but filtering is explicit via readyToCook

  // New Filter State
  const [readyToCook, setReadyToCook] = useState(false); // Default to FALSE to show "Best Matches" (Partial)
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  // Pagination State
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Photo Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { submitPhoto, isProcessing, isAuthenticated } = usePhotoUpload();

  // Infinite Scroll Hook
  const { ref, inView } = useInView({
      threshold: 0,
      rootMargin: '100px', // Preload before hitting bottom
  });

  // Trigger load more when in view
  React.useEffect(() => {
      if (inView && hasMore && !loading) {
          handleLoadMore();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasMore, loading]);

  const CUISINES = [
    'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean',
    'American', 'French', 'Middle Eastern', 'Latin American',
    'Korean', 'Japanese', 'Thai', 'Chinese', 'Vegetarian'
  ];

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Refactored Fetch Recipe
  const fetchRecipes = async (
      reset: boolean = false,
      currentIngredients: string[] = ingredients,
      searchQuery: string = inputInternal,
      activeTags: string[] = filterTags,
      activeCuisines: string[] = selectedCuisines,
      isReadyToCook: boolean = readyToCook
  ) => {

    // Resolve effective offset
    const currentOffset = reset ? 0 : offset;

    // Allow fetching if we have ANY criteria (always calculate inventory, so just check readyToCook not useInventory state)
    const hasCriteria = currentIngredients.length > 0 || searchQuery || activeTags.length > 0 || activeCuisines.length > 0 || true; // Always allow fetching now


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
      // Always request stock data to calculate percentages
      url += `&use_stock=true`;

      if (isReadyToCook) {
        // Force strict 100% match
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
            setRecipes(prev => {
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

  // Wrapper for loading more
  const handleLoadMore = () => {
      fetchRecipes(false);
  };

  const toggleFilterTag = (tag: string) => {
      const newTags = filterTags.includes(tag)
        ? filterTags.filter(t => t !== tag)
        : [...filterTags, tag];

      setFilterTags(newTags);
      fetchRecipes(true, ingredients, inputInternal, newTags, selectedCuisines, readyToCook);
  };

  const toggleCuisine = (cuisine: string) => {
      const newCuisines = selectedCuisines.includes(cuisine)
        ? selectedCuisines.filter(c => c !== cuisine)
        : [...selectedCuisines, cuisine];

      setSelectedCuisines(newCuisines);
      fetchRecipes(true, ingredients, inputInternal, filterTags, newCuisines, readyToCook);
  };

  // Effect to refetch when inventory settings change
  React.useEffect(() => {
    // Debounce toggle changes
    const timer = setTimeout(() => {
        fetchRecipes(true, ingredients, inputInternal.length > 3 ? inputInternal : undefined, filterTags, selectedCuisines, readyToCook);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToCook]);

  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: UnifiedRecipe | null, ingredients: RecipeIngredientWithDetails[] }>({ recipe: null, ingredients: [] });

  const activeSearch = (term: string) => {
      // Trigger a smart search immediately
      setInputInternal(term);
      setIngredients([]);
      fetchRecipes(true, [], term); // True = reset
  };

  const addIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      const newIngredients = [...ingredients, trimmed];
      setIngredients(newIngredients);
      setInputInternal('');

      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        fetchRecipes(true, newIngredients);
      }, 500);
    }
  };

  const removeIngredient = (ing: string) => {
    const newIngredients = ingredients.filter(i => i !== ing);
    setIngredients(newIngredients);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchRecipes(true, newIngredients);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const term = inputInternal.trim();
      if (term.length > 0) {
          // Heuristic: If multiple words, assume Natural Language Query -> activeSearch (AI)
          // If single word, assume Tag -> addIngredient
          if (term.includes(' ')) {
              activeSearch(term);
          } else {
              addIngredient(term);
          }
      }
    } else if (e.key === 'Backspace' && inputInternal === '' && ingredients.length > 0) {
        removeIngredient(ingredients[ingredients.length - 1]);
    }
  };

  const handleRecipeClick = (aiRecipe: APIRecipe) => {
      const adapted = adaptAiToUnified(aiRecipe);
      setSelectedRecipe(adapted);
  };

  const handlePhotoSubmit = async (file: File, prompt: string) => {
      const result = await submitPhoto(file, prompt);
      if (result) {
          setIsUploadModalOpen(false);

          // Add unique newly detected ingredients
          const newIngredients = Array.from(new Set([...ingredients, ...(result.ingredients || [])]));
          setIngredients(newIngredients);

          // Trigger fetch immediately with new ingredients (Reset=true)
          fetchRecipes(true, newIngredients, inputInternal, filterTags, selectedCuisines, readyToCook);
      }
  };

  return (
    <div className="webapp-main-content min-h-screen w-full bg-transparent">
      {/* Search Header Section */}
      <div className="mx-auto max-w-7xl pt-8 pb-12 desktop:pt-16 desktop:pb-20">
        <div className="relative text-center">

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 flex justify-center"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f1f1f] border border-[#2a2a2a] shadow-lg shadow-black/40">
                    <Sparkles size={32} className="text-landing-primary" />
                </div>
            </motion.div>

          {/* ... Title ... */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-bold tracking-tight text-white desktop:text-6xl"
          >
            What&apos;s in your kitchen?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
             className="mx-auto mb-10 max-w-2xl text-lg text-white/60"
          >
            Enter ingredients or describe what you want to eat (e.g. &quot;Spicy vegetarian dinner&quot;).
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mb-8 max-w-lg rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-xl shadow-black/10"
          >
             <p className="text-sm text-white/70 italic text-center">
               <span className="not-italic font-semibold text-landing-primary mr-2 block mb-1">⚠️ Chef&apos;s Disclaimer</span>
               &quot;For when your creativity has been 86&apos;d.&quot;<br/>
               <span className="opacity-60 text-xs mt-1 block">These are AI suggestions based on your stock—season to taste!</span>
             </p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
            className="mx-auto flex max-w-3xl flex-wrap items-center rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-2xl shadow-black/20 focus-within:border-landing-primary/50 focus-within:ring-2 focus-within:ring-landing-primary/20 transition-all duration-300"
          >
             <Search className="ml-4 mr-3 h-5 w-5 text-white/40" />

             <div className="flex flex-1 flex-wrap items-center gap-2">
                <AnimatePresence>
                    {ingredients.map(ing => (
                        <motion.span
                          key={ing}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] pl-3 pr-2 py-1.5 text-sm font-medium text-white border border-[#3a3a3a]"
                        >
                            {ing}
                            <button onClick={() => removeIngredient(ing)} className="rounded p-0.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
                 <input
                  value={inputInternal}
                  onChange={(e) => setInputInternal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={ingredients.length === 0 ? "Type ingredients or a phrase..." : "Add more..."}
                  className="min-w-[200px] flex-1 border-none bg-transparent py-3 text-lg text-white placeholder-white/20 focus:outline-none focus:ring-0"
                />
             </div>

             {/* Camera / Upload Button */}
             <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mr-2 rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                title={isAuthenticated ? "Upload photo of ingredients" : "Log in to use kitchen scanner"}
             >
                <Camera size={20} />
             </button>

             {/* AI Search Action Button */}
             {inputInternal.length > 3 && (
                 <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => activeSearch(inputInternal)}
                    className="mr-2 rounded-xl bg-landing-primary/10 px-4 py-2 text-sm font-medium text-landing-primary hover:bg-landing-primary/20 transition-colors flex items-center gap-2"
                 >
                     <Sparkles size={16} />
                     Ask AI
                 </motion.button>
             )}
          </motion.div>
        </div>
      </div>


      <div className="mx-auto max-w-[2560px]">
        {/* Filters Section */}
        <div className="mb-8 px-4 flex flex-col gap-4 items-center">

            {/* Inventory Controls */}
            <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-[#1f1f1f] border border-[#2a2a2a] shadow-lg shadow-black/20">
                <label className="flex items-center cursor-pointer gap-3 select-none">
                    <span className={`text-sm font-medium ${readyToCook ? 'text-landing-primary' : 'text-white/60'}`}>Strict Match (100%)</span>
                    <div className="relative">
                        <input
                        type="checkbox"
                        className="sr-only"
                        checked={readyToCook}
                        onChange={() => setReadyToCook(!readyToCook)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${readyToCook ? 'bg-landing-primary' : 'bg-[#3a3a3a]'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${readyToCook ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                </label>
            </div>

            {/* Cuisine Filters */}
            <div className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex flex-nowrap gap-2 px-2">
                    {CUISINES.map(c => {
                        const isSelected = selectedCuisines.includes(c);
                        return (
                            <button
                                key={c}
                                onClick={() => toggleCuisine(c)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    isSelected
                                    ? 'bg-landing-primary text-white shadow-lg shadow-landing-primary/20 border-landing-primary scale-105'
                                    : 'bg-[#1f1f1f] text-white/70 hover:bg-[#2a2a2a] hover:text-white border border-[#2a2a2a]'
                                }`}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Quick Filters (Proteins/Tags) */}
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {['Chicken', 'Beef', 'Pork', 'Fish', 'Healthy', 'Quick', 'Breakfast'].map(tag => {
                    const isActive = filterTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            onClick={() => toggleFilterTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                isActive
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-transparent text-white/40 hover:text-white border border-transparent hover:border-white/10'
                            }`}
                        >
                            {tag}
                        </button>
                    )
                })}
            </div>

        </div>


        {loading ? (
             <div className="grid grid-cols-1 gap-6 px-4 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 large-desktop:gap-8 xl:grid-cols-5 pb-12">
                {Array.from({ length: 10 }).map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                ))}
             </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 px-4 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 large-desktop:gap-8 xl:grid-cols-5 pb-12">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                searchIngredients={ingredients.length > 0 ? ingredients : [inputInternal]}
                onClick={handleRecipeClick}
              />
            ))}

            {hasMore && (
                 <div ref={ref} className="col-span-full flex justify-center pt-8">
                     {inView && loading && (
                        <div className="flex items-center gap-2 text-white/50 animate-pulse">
                            <div className="h-2 w-2 rounded-full bg-white/50" />
                            <div className="h-2 w-2 rounded-full bg-white/50 animation-delay-200" />
                            <div className="h-2 w-2 rounded-full bg-white/50 animation-delay-400" />
                        </div>
                     )}
                     {!inView && (
                         <button
                            onClick={handleLoadMore}
                            className="text-sm text-white/30 hover:text-white/70 transition-colors"
                         >
                            Load More
                         </button>
                     )}
                 </div>
            )}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 rounded-full bg-white/5 p-4 text-4xl">👨‍🍳</div>
                <p className="text-xl font-medium text-white/60">Our chefs are stumped!</p>
                <p className="mt-2 max-w-sm text-sm text-white/40">We couldn&apos;t find any recipes matching your criteria. Try loosening the &quot;Strict Match&quot; filter or adding more ingredients.</p>
            </div>
        )}
      </div>

      {/* Unified Recipe Modal */}
      <UnifiedRecipeModal
        isOpen={!!selectedRecipe.recipe}
        recipe={selectedRecipe.recipe}
        recipeIngredients={selectedRecipe.ingredients || []}
        aiInstructions={''}
        generatingInstructions={false}
        previewYield={selectedRecipe.recipe?.yield || 4}
        onClose={() => setSelectedRecipe({ recipe: null, ingredients: [] })}

        // Stubs for non-applicable actions
        onEditRecipe={() => {}}
        onShareRecipe={() => {}}
        onPrint={() => {}}
        onDuplicateRecipe={() => {}}
        onDeleteRecipe={() => {}}
        onUpdatePreviewYield={() => {}}
        onRefreshIngredients={async () => {}}

        capitalizeRecipeName={(name: string) => name}
        formatQuantity={(q: number, u: string) => ({ value: q.toFixed(2), unit: u, original: `${q} ${u}` })}
      />

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handlePhotoSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
}
