'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChefHat, Search, Sparkles, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { UnifiedRecipeModal } from '../recipes/components/UnifiedRecipeModal';
import { RecipeIngredientWithDetails, Recipe as UnifiedRecipe } from '../recipes/types';
import { RecipeCard } from './components/RecipeCard';

interface AIIngredient {
  name: string;
  original_text?: string;
  quantity?: number;
  unit?: string;
}

interface Recipe {
  id: string;
  name: string;
  image_url: string;
  ingredients: AIIngredient[];
  instructions?: string[];
  description?: string;
  meta: {
    prep_time_minutes: number;
    cook_time_minutes: number;
  };
  matchCount?: number;
}

import { convertToStandardUnit } from '@/lib/unit-conversion';

// Ingredient parser with metric conversion - handles structured ingredient objects
function parseIngredient(ing: AIIngredient): RecipeIngredientWithDetails {
    const name = ing.name || 'Unknown';
    const rawQuantity = ing.quantity ?? 1;
    const rawUnit = ing.unit || 'unit';

    // Convert to metric using existing library
    const converted = convertToStandardUnit(rawQuantity, rawUnit);
    const metricQuantity = converted.value;
    const metricUnit = converted.unit;

    // Generate stable ID from name
    const id = btoa(encodeURIComponent(name)).substring(0, 10);

    return {
        id: id,
        recipe_id: 'ai-recipe',
        ingredient_id: id,
        ingredient_name: name,
        quantity: metricQuantity,
        unit: metricUnit,
        cost_per_unit: 0,
        total_cost: 0,
        ingredients: {
            id: id,
            ingredient_name: name,
            cost_per_unit: 0,
            unit: metricUnit
        }
    };
}

function adaptAiToUnified(aiRecipe: Recipe): { recipe: UnifiedRecipe, ingredients: RecipeIngredientWithDetails[] } {
    const ingredients = aiRecipe.ingredients.map(parseIngredient);

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
        recipe_name: aiRecipe.name,
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);


  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchRecipes = async (currentIngredients: string[], searchQuery?: string) => {
    if (currentIngredients.length === 0 && !searchQuery) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    try {
      let url = '/api/ai-specials/search?limit=50';
      if (searchQuery) {
          url += `&q=${encodeURIComponent(searchQuery)}`;
      } else {
          url += `&ingredients=${encodeURIComponent(currentIngredients.join(','))}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.data) {
        setRecipes(data.data);
      }
    } catch (error) {
  // eslint-disable-next-line no-console
      console.error('Failed to fetch recipes', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: UnifiedRecipe | null, ingredients: RecipeIngredientWithDetails[] }>({ recipe: null, ingredients: [] });

  const activeSearch = (term: string) => {
      // Trigger a smart search immediately
      setInputInternal(term);
      // Clear tags to show we are in prompt mode? Or just use both?
      // Let's clear tags for pure AI mode to avoid confusion
      setIngredients([]);
      fetchRecipes([], term);
  };

   // Removed unused smartMode state

  const addIngredient = (ing: string) => {
    // If strict AI mode or long sentence, maybe treat as query?
    // For now, keep tag behavior unless user explicitly clicks "AI Search" button which we will add.
    const trimmed = ing.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      const newIngredients = [...ingredients, trimmed];
      setIngredients(newIngredients);
      setInputInternal('');

      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        fetchRecipes(newIngredients);
      }, 500);
    }
  };

  const removeIngredient = (ing: string) => {
    const newIngredients = ingredients.filter(i => i !== ing);
    setIngredients(newIngredients);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchRecipes(newIngredients);
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

  const handleRecipeClick = (aiRecipe: Recipe) => {
      const adapted = adaptAiToUnified(aiRecipe);
      setSelectedRecipe(adapted);
  };

  return (
    <div className="webapp-main-content min-h-screen w-full bg-[#0a0a0a]">
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

      {/* Results Grid */}
      <div className="mx-auto max-w-[2560px]">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-24 text-white/30">
                <ChefHat className="mb-4 h-12 w-12 animate-bounce opacity-50" />
                <p>Finding the perfect recipes...</p>
             </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 px-4 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 large-desktop:gap-8 xl:grid-cols-5">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                searchIngredients={ingredients.length > 0 ? ingredients : [inputInternal]}
                onClick={handleRecipeClick}
              />
            ))}
          </div>
        ) : (ingredients.length > 0 || inputInternal.length > 0 && loading) ? (
            <div className="py-24 text-center">
                <p className="text-xl text-white/50">No recipes matched your exact criteria.</p>
                <p className="mt-2 text-sm text-white/30">Try adding common staples or broadening your search.</p>
            </div>
        ) : (
             <div className="py-24 text-center text-white/20">
                Start typing above to explore recipes
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
    </div>
  );
}
