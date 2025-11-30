'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { FoodImageDisplay } from './FoodImageDisplay';
import { LoadingSkeleton } from './LoadingSkeleton';

interface FoodImageGeneratorProps {
  entityType: 'recipe' | 'dish';
  entityId: string;
  entityName: string;
  imageUrl?: string | null;
  imageUrlAlternative?: string | null;
  onImagesGenerated?: (primaryUrl: string | null, alternativeUrl: string | null) => void;
  className?: string;
  showDisplay?: boolean; // Whether to show the image display component
  compact?: boolean; // Compact mode for smaller spaces
}

/**
 * FoodImageGenerator Component
 *
 * Triggers food image generation and displays the results.
 * Handles loading states, errors, and rate limiting.
 *
 * @component
 * @param {FoodImageGeneratorProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export function FoodImageGenerator({
  entityType,
  entityId,
  entityName,
  imageUrl,
  imageUrlAlternative,
  onImagesGenerated,
  className = '',
  showDisplay = true,
  compact = false,
}: FoodImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrimary, setGeneratedPrimary] = useState<string | null>(imageUrl || null);
  const [generatedAlternative, setGeneratedAlternative] = useState<string | null>(
    imageUrlAlternative || null,
  );
  const { showSuccess, showError } = useNotification();

  const hasImages = !!(generatedPrimary || generatedAlternative);
  const endpoint = `/api/${entityType === 'recipe' ? 'recipes' : 'dishes'}/${entityId}/generate-image`;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || `Failed to generate images: ${response.statusText}`;
        setError(errorMessage);
        showError(errorMessage);
        return;
      }

      if (data.success) {
        const primary = data.imageUrl || null;
        const alternative = data.imageUrlAlternative || null;

        setGeneratedPrimary(primary);
        setGeneratedAlternative(alternative);
        onImagesGenerated?.(primary, alternative);

        if (data.cached) {
          showSuccess('Images loaded from cache');
        } else {
          showSuccess('Food images generated successfully!');
        }
      } else {
        const errorMessage = data.error || data.message || 'Failed to generate images';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while generating images';
      setError(errorMessage);
      showError(errorMessage);
      logger.error('[FoodImageGenerator] Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (compact) {
    // Compact mode: Just a button, no display
    return (
      <div className={className}>
        {!hasImages && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Generate images for ${entityName}`}
          >
            {isGenerating ? (
              <>
                <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Icon icon={Sparkles} size="sm" aria-hidden={true} />
                <span>Generate Image</span>
              </>
            )}
          </button>
        )}
        {error && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
            <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Display */}
      {showDisplay && (
        <div>
          {isGenerating ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
              <LoadingSkeleton variant="card" className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/60 px-6 py-4 backdrop-blur-sm">
                  <Icon icon={Loader2} size="xl" className="animate-spin text-[#29E7CD]" aria-hidden={true} />
                  <p className="text-sm font-medium text-white">Generating images...</p>
                  <p className="text-xs text-gray-400">This may take up to 10 seconds</p>
                </div>
              </div>
            </div>
          ) : (
            <FoodImageDisplay
              imageUrl={generatedPrimary}
              imageUrlAlternative={generatedAlternative}
              alt={`${entityName} food image`}
              priority={false}
            />
          )}
        </div>
      )}

      {/* Generate Button */}
      {!hasImages && !isGenerating && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Generate images for ${entityName}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon icon={Sparkles} size="md" aria-hidden={true} />
            <span>Generate Food Images</span>
          </div>
        </button>
      )}

      {/* Regenerate Button (if images exist) */}
      {hasImages && !isGenerating && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Regenerate images for ${entityName}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon icon={Sparkles} size="sm" aria-hidden={true} />
            <span>Regenerate Images</span>
          </div>
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircle} size="md" className="mt-0.5 flex-shrink-0 text-red-400" aria-hidden={true} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">Generation Failed</p>
              <p className="mt-1 text-xs text-red-300">{error}</p>
              {error.includes('Rate limit') && (
                <p className="mt-2 text-xs text-red-300/80">
                  Maximum 10 generations per hour. Please try again later.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
