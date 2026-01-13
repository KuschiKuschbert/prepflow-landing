/**
 * Recipe Card Component
 * Displays individual recipe card in grid
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Star,
  Thermometer,
} from 'lucide-react';
import { isRecipeFormatted } from '@/lib/utils/recipe-format-detection';
import { getSourceColor, getRatingColor, formatSourceName, getProxiedImageUrl } from '../utils';

interface ScrapedRecipe {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  description?: string;
  ingredients: Array<{ name: string; original_text: string }>;
  instructions: string[];
  yield?: number;
  yield_unit?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  temperature_celsius?: number;
  temperature_fahrenheit?: number;
  temperature_unit?: 'celsius' | 'fahrenheit';
  category?: string;
  cuisine?: string;
  image_url?: string;
  rating?: number;
  dietary_tags?: string[];
  scraped_at?: string;
  updated_at?: string;
}

interface RecipeCardProps {
  recipe: ScrapedRecipe;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RecipeCard({ recipe, isExpanded, onToggle }: RecipeCardProps) {
  const hasImage = !!recipe.image_url;
  const isFormatted = isRecipeFormatted(recipe);

  return (
    <div
      className={`group flex flex-col rounded-2xl border p-4 transition-all duration-200 hover:shadow-lg ${
        isFormatted
          ? 'border-green-500/20 bg-green-500/5 hover:border-green-500/30'
          : 'border-[var(--border)] bg-[var(--background)] hover:border-[#29E7CD]/50'
      }`}
    >
      {/* Header with Image/Title */}
      <div className="mb-3 flex gap-3">
        {hasImage && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getProxiedImageUrl(recipe.image_url!)}
              alt={recipe.recipe_name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-base font-semibold text-[var(--foreground)]">
            {recipe.recipe_name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getSourceColor(recipe.source)}`}
            >
              {formatSourceName(recipe.source)}
            </span>
            {recipe.rating && (
              <div className="flex items-center gap-1">
                <Icon
                  icon={Star}
                  size="xs"
                  className={getRatingColor(recipe.rating)}
                  aria-hidden={true}
                />
                <span className={`text-xs ${getRatingColor(recipe.rating)}`}>
                  {recipe.rating.toFixed(1)}
                </span>
              </div>
            )}
            {isFormatted && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <Icon icon={CheckCircle2} size="xs" aria-hidden={true} />
                Formatted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {recipe.description && (
        <p className="mb-3 line-clamp-2 text-sm text-[var(--foreground-muted)]">
          {recipe.description}
        </p>
      )}

      {/* Metadata */}
      <div className="mb-3 flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)]">
        {recipe.yield && (
          <span>
            Serves: <span className="font-semibold text-[var(--foreground)]">{recipe.yield}</span>
            {recipe.yield_unit && ` ${recipe.yield_unit}`}
          </span>
        )}
        {recipe.total_time_minutes && (
          <span className="flex items-center gap-1">
            <Icon icon={Clock} size="xs" aria-hidden={true} />
            {recipe.total_time_minutes}m
          </span>
        )}
        {recipe.temperature_celsius && (
          <span className="flex items-center gap-1">
            <Icon icon={Thermometer} size="xs" aria-hidden={true} />
            {recipe.temperature_celsius}°C
          </span>
        )}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mb-3 space-y-3 border-t border-[var(--border)] pt-3">
          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <h4 className="mb-1 text-xs font-semibold text-[var(--foreground-muted)]">
                Ingredients ({recipe.ingredients.length})
              </h4>
              <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
                {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                  <li key={idx}>• {ing.original_text || ing.name}</li>
                ))}
                {recipe.ingredients.length > 5 && (
                  <li className="text-[var(--foreground-muted)]">
                    +{recipe.ingredients.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Instructions Preview */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <h4 className="mb-1 text-xs font-semibold text-[var(--foreground-muted)]">
                Instructions ({recipe.instructions.length} steps)
              </h4>
              <p className="line-clamp-3 text-xs text-[var(--foreground-muted)]">
                {recipe.instructions[0]}
              </p>
            </div>
          )}

          {/* Category/Cuisine */}
          {(recipe.category || recipe.cuisine) && (
            <div className="flex flex-wrap gap-2">
              {recipe.category && (
                <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--foreground-muted)]">
                  {recipe.category}
                </span>
              )}
              {recipe.cuisine && (
                <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--foreground-muted)]">
                  {recipe.cuisine}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-3">
        <a
          href={recipe.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#29E7CD] hover:underline"
        >
          View Original
          <Icon icon={ExternalLink} size="xs" aria-hidden={true} />
        </a>
        <button
          onClick={onToggle}
          className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          aria-label={isExpanded ? 'Collapse recipe details' : 'Expand recipe details'}
        >
          {isExpanded ? (
            <>
              <span>Less</span>
              <Icon icon={ChevronUp} size="xs" aria-hidden={true} />
            </>
          ) : (
            <>
              <span>More</span>
              <Icon icon={ChevronDown} size="xs" aria-hidden={true} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
