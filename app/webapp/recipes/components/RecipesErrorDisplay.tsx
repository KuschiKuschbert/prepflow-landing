'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { RecipeError, RecipeErrorType } from '../types/errors';

interface RecipesErrorDisplayProps {
  error: string | null;
  recipeError?: RecipeError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function RecipesErrorDisplay({
  error,
  recipeError,
  onRetry,
  onDismiss,
}: RecipesErrorDisplayProps) {
  if (!error && !recipeError) return null;

  const displayError: RecipeError = recipeError || {
    type: RecipeErrorType.UNKNOWN,
    message: error || 'An error occurred',
    recoverable: false,
    originalError: undefined,
  };

  const getErrorStyles = () => {
    switch (displayError.type) {
      case 'NETWORK':
        return 'border-[var(--color-warning)]/20 bg-[var(--color-warning)]/10 text-[var(--color-warning)]';
      case 'VALIDATION':
        return 'border-orange-500/20 bg-orange-500/10 text-orange-400';
      case 'SERVER':
        return 'border-[var(--color-error)]/20 bg-[var(--color-error)]/10 text-[var(--color-error)]';
      default:
        return 'border-[var(--color-error)]/20 bg-[var(--color-error)]/10 text-[var(--color-error)]';
    }
  };

  return (
    <div className={`mb-6 rounded-lg border p-4 ${getErrorStyles()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon icon={AlertCircle} size="md" className="mt-0.5 flex-shrink-0" aria-hidden={true} />
          <div className="flex-1">
            <p className="font-medium">{displayError.message}</p>
            {displayError.originalError && process.env.NODE_ENV === 'development' && (
              <p className="mt-1 text-xs opacity-75">{displayError.originalError.message}</p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0 text-current opacity-75 transition-opacity hover:opacity-100"
            aria-label="Dismiss error"
          >
            <Icon icon={X} size="sm" aria-hidden={true} />
          </button>
        )}
      </div>
      {displayError.recoverable && onRetry && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-lg bg-current/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-current/30"
          >
            <Icon icon={RefreshCw} size="sm" aria-hidden={true} />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
