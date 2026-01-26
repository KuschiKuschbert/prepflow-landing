'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface AIIngredient {
  name: string;
  original_text?: string;
  quantity?: number;
  unit?: string;
}

interface Recipe {
  id: string;
  name?: string;
  recipe_name?: string;
  image_url: string;
  ingredients: (AIIngredient | string)[];
  meta?: {
    prep_time_minutes?: number;
    cook_time_minutes?: number;
  };
  matchCount?: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  searchIngredients: string[];
  onClick?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, searchIngredients: _searchIngredients, onClick }: RecipeCardProps) {
  const displayName = recipe.name || recipe.recipe_name || 'Untitled Recipe';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(recipe)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-sm transition-all hover:bg-[#252525] hover:shadow-lg hover:shadow-black/50 cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1a1a]">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-90" />

        {/* Optional: Show matched ingredients count if searched */}
        {recipe.matchCount !== undefined && recipe.matchCount > 0 && (
           <div className="absolute top-3 right-3 rounded-full bg-landing-primary/20 px-2.5 py-1 text-xs font-bold text-landing-primary backdrop-blur-sm border border-landing-primary/30">
              {recipe.matchCount} Matches
           </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white group-hover:text-landing-primary transition-colors duration-200">
          {displayName}
        </h3>

        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1">
             <span className="i-lucide-clock h-3 w-3" />
             <span>{(recipe.meta?.prep_time_minutes || 0) + (recipe.meta?.cook_time_minutes || 0) || '30'} mins</span>
          </div>
          {/* Add more meta info here if available */}
        </div>
      </div>
    </motion.div>
  );
}
