'use client';

import { Icon } from '@/components/ui/Icon';
import { FileText, Loader2, Play, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Recipe } from '../types';
import { CookingFocusMode } from './CookingFocusMode';

interface RecipePreviewInstructionsProps {
  recipe: Recipe;
  aiInstructions: string;
  generatingInstructions: boolean;
}

export function RecipePreviewInstructions({
  recipe,
  aiInstructions,
  generatingInstructions,
}: RecipePreviewInstructionsProps) {
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const hasManualInstructions = !!recipe.instructions;
  const hasAiInstructions = !!aiInstructions || generatingInstructions;

  // Determine active instructions for focus mode
  const activeInstructions = hasAiInstructions ? aiInstructions : recipe.instructions || '';

  if (!hasManualInstructions && !hasAiInstructions) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-8 text-center">
        <Icon
          icon={FileText}
          size="lg"
          className="mx-auto mb-3 text-[var(--foreground-subtle)]"
          aria-hidden={true}
        />
        <h3 className="mb-1 font-medium text-[var(--foreground)]">No instructions yet</h3>
        <p className="text-sm text-[var(--foreground-muted)]">
          Edit the recipe to add manual instructions or generate them with AI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Instructions */}
      <CookingFocusMode
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        title={recipe.recipe_name || 'Cooking Mode'}
        instructions={activeInstructions}
      />

      {hasAiInstructions && (
        <div className="overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/5">
          <div className="flex items-center justify-between border-b border-violet-500/20 bg-violet-500/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <Icon icon={Wand2} size="sm" className="text-violet-400" aria-hidden={true} />
              <h3 className="font-medium text-violet-200">AI Method</h3>
            </div>
            {!generatingInstructions && (
              <button
                onClick={() => setIsFocusModeOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-200 transition-colors hover:bg-violet-500/30"
              >
                <Icon icon={Play} size="sm" />
                Start Cooking
              </button>
            )}
          </div>
          <div className="p-4">
            {generatingInstructions ? (
              <div className="flex items-center justify-center py-6">
                <Icon
                  icon={Loader2}
                  size="md"
                  className="mr-3 animate-spin text-violet-400"
                  aria-hidden={true}
                />
                <span className="text-sm text-violet-300">Generating chef&apos;s method...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[var(--foreground-secondary)]">
                <p className="whitespace-pre-wrap">{aiInstructions}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Instructions */}
      {hasManualInstructions && !hasAiInstructions && (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Icon
                icon={FileText}
                size="sm"
                className="text-[var(--foreground-muted)]"
                aria-hidden={true}
              />
              <h3 className="font-medium text-[var(--foreground)]">Manual Instructions</h3>
            </div>
            <button
              onClick={() => setIsFocusModeOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
            >
              <Icon icon={Play} size="sm" />
              Start Cooking
            </button>
          </div>
          <div className="p-4">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[var(--foreground-secondary)]">
              <p className="whitespace-pre-wrap">{recipe.instructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
