'use client';

import { Icon } from '@/components/ui/Icon';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface FinishRecipeButtonProps {
  onFinish: () => void;
  disabled?: boolean;
  hasIngredients?: boolean;
}

const finishMessages = [
  "Recipe's Done, Chef!",
  'Lock It Down!',
  'Seal the Deal!',
  'Recipe Complete!',
  'Nailed It!',
];

export function FinishRecipeButton({
  onFinish,
  disabled = false,
  hasIngredients = false,
}: FinishRecipeButtonProps) {
  const [isFinishing, setIsFinishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Initialize with first message to avoid hydration mismatch
  // Random message will be set in useEffect after mount
  const [message, setMessage] = useState(finishMessages[0]);

  // Set random message after mount (client-only)
  useEffect(() => {
    setMessage(finishMessages[Math.floor(Math.random() * finishMessages.length)]);
  }, []);

  const handleFinish = async () => {
    if (disabled || !hasIngredients) return;

    setIsFinishing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for UX
      onFinish();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsFinishing(false);
      }, 2000);
    } catch (err) {
      logger.error('[FinishRecipeButton.tsx] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      setIsFinishing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="mt-4 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-[var(--color-success)]">
          <Icon icon={CheckCircle2} size="md" aria-hidden={true} />
          <span className="font-semibold">Recipe Finished!</span>
        </div>
        <p className="text-sm text-[var(--foreground-muted)]">Your recipe is saved and ready to use</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <button
        onClick={handleFinish}
        disabled={disabled || !hasIngredients || isFinishing}
        className="w-full rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] px-4 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--accent)]/80 hover:to-[var(--primary)]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-2">
          {isFinishing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Finishing...</span>
            </>
          ) : (
            <>
              <Icon icon={Sparkles} size="sm" aria-hidden={true} />
              <span>{message}</span>
            </>
          )}
        </div>
      </button>
      {!hasIngredients && (
        <p className="mt-2 text-center text-xs text-[var(--foreground-subtle)]">
          Add ingredients to finish your recipe
        </p>
      )}
      <p className="mt-2 text-center text-xs text-[var(--foreground-muted)]">
        Your recipe is auto-saved as you work
      </p>
    </div>
  );
}
