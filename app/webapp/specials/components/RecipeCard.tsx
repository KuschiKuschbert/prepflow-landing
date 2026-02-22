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
  stockMatchPercentage?: number;
  missingIngredients?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  searchIngredients: string[];
  onClick?: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  searchIngredients: _searchIngredients,
  onClick,
}: RecipeCardProps) {
  const displayName = recipe.name || recipe.recipe_name || 'Untitled Recipe';

  // Determine styles dynamically based on compatibility
  let borderClass = 'border-[#2a2a2a]';
  const percentage = recipe.stockMatchPercentage || 0;

  if (percentage > 99) {
    borderClass = 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-900/20';
  } else if (percentage >= 75) {
    borderClass = 'border-amber-500/70 hover:border-amber-400';
  } else if (percentage > 0) {
    borderClass = 'border-zinc-700 hover:border-zinc-500';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(recipe)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#1f1f1f] shadow-sm transition-all hover:bg-[#252525] hover:shadow-lg hover:shadow-black/50 ${borderClass}`}
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
          <div className="flex h-full items-center justify-center text-white/70">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-90" />

        {/* Optional: Show matched ingredients count if searched */}
        <div className="absolute top-3 right-3 flex gap-2">
          {percentage > 99 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400 bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white shadow-md shadow-black/30">
              <span className="text-yellow-300">✨</span> Ready to Cook
            </div>
          ) : percentage > 0 ? (
            <div
              className="relative flex items-center overflow-hidden rounded-full border border-white/10 px-3 py-1.5 text-sm font-bold text-white shadow-md shadow-black/30"
              style={{
                background: `linear-gradient(90deg, ${
                  percentage >= 75 ? '#d97706' : '#52525b' // amber-600 or zinc-600
                } ${percentage}%, #18181b ${percentage}%)`, // zinc-900 base
              }}
            >
              <span className="relative z-10 mr-1.5 opacity-90">Inventory:</span>
              <span className="relative z-10">{percentage}%</span>
            </div>
          ) : null}

          {recipe.matchCount !== undefined && recipe.matchCount > 0 && !percentage && (
            <div className="bg-landing-primary rounded-full border border-white/20 px-3 py-1.5 text-sm font-bold text-white shadow-md shadow-black/30">
              {recipe.matchCount} Matches
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <h3 className="group-hover:text-landing-primary line-clamp-2 text-lg leading-tight font-semibold text-white transition-colors duration-200">
          {displayName}
        </h3>

        <div className="text-muted-foreground flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1">
            <span className="i-lucide-clock h-3 w-3" />
            <span>
              {(recipe.meta?.prep_time_minutes || 0) + (recipe.meta?.cook_time_minutes || 0) ||
                '30'}{' '}
              mins
            </span>
          </div>
          {/* Add more meta info here if available */}
        </div>

        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && percentage < 100 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.missingIngredients.slice(0, 3).map((ing, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] leading-tight font-medium text-rose-300"
              >
                {ing}
              </span>
            ))}
            {recipe.missingIngredients.length > 3 && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-rose-400/60">
                +{recipe.missingIngredients.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
