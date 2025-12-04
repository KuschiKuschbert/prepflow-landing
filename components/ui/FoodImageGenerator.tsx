'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { FoodImageDisplay } from './FoodImageDisplay';
import { LoadingSkeleton } from './LoadingSkeleton';
import { PlatingMethodSelectorPopup, type PlatingMethodOption } from './PlatingMethodSelectorPopup';

interface FoodImageGeneratorProps {
  entityType: 'recipe' | 'dish';
  entityId: string;
  entityName: string;
  imageUrl?: string | null; // Classic/primary
  imageUrlAlternative?: string | null; // Rustic
  imageUrlModern?: string | null; // Modern
  imageUrlMinimalist?: string | null; // Minimalist
  onImagesGenerated?: (images: {
    classic: string | null;
    modern: string | null;
    rustic: string | null;
    minimalist: string | null;
  }) => void;
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
  imageUrlModern,
  imageUrlMinimalist,
  onImagesGenerated,
  className = '',
  showDisplay = true,
  compact = false,
}: FoodImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlatingPopup, setShowPlatingPopup] = useState(false);
  const [generatedClassic, setGeneratedClassic] = useState<string | null>(imageUrl || null);
  const [generatedRustic, setGeneratedRustic] = useState<string | null>(
    imageUrlAlternative || null,
  );
  const [generatedModern, setGeneratedModern] = useState<string | null>(imageUrlModern || null);
  const [generatedMinimalist, setGeneratedMinimalist] = useState<string | null>(
    imageUrlMinimalist || null,
  );
  const [generatedPlatingMethods, setGeneratedPlatingMethods] = useState<
    Record<string, string | null>
  >({});
  const { showSuccess, showError } = useNotification();
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  const hasImages = !!(
    generatedClassic ||
    generatedRustic ||
    generatedModern ||
    generatedMinimalist
  );
  const endpoint = `/api/${entityType === 'recipe' ? 'recipes' : 'dishes'}/${entityId}/generate-image`;

  const handleGenerateClick = () => {
    setShowPlatingPopup(true);
  };

  const handleGenerate = async (selectedMethods: PlatingMethodOption[]) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platingMethods: selectedMethods,
        }),
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
        // Handle new format with multiple plating methods
        // Only update methods that were actually regenerated (preserve existing ones)

        // Calculate new values for regenerated methods
        const updatedClassic = selectedMethods.includes('classic')
          ? data.classic || data.imageUrl || null
          : generatedClassic;
        const updatedModern = selectedMethods.includes('landscape')
          ? data.modern || null
          : generatedModern;
        const updatedRustic = selectedMethods.includes('stacking')
          ? data.rustic || data.imageUrlAlternative || null
          : generatedRustic;
        const updatedMinimalist = selectedMethods.includes('deconstructed')
          ? data.minimalist || null
          : generatedMinimalist;

        // Update state only for regenerated methods
        if (selectedMethods.includes('classic')) {
          setGeneratedClassic(updatedClassic);
        }
        if (selectedMethods.includes('landscape')) {
          setGeneratedModern(updatedModern);
        }
        if (selectedMethods.includes('stacking')) {
          setGeneratedRustic(updatedRustic);
        }
        if (selectedMethods.includes('deconstructed')) {
          setGeneratedMinimalist(updatedMinimalist);
        }

        // Merge new plating methods with existing ones (preserve existing, replace only regenerated)
        setGeneratedPlatingMethods(prev => {
          const updated = { ...prev };
          // Extract new plating methods (landscape, stacking, deconstructed) from response
          const newMethods = ['landscape', 'stacking', 'deconstructed'] as const;
          for (const method of newMethods) {
            if (selectedMethods.includes(method)) {
              // Only update if this method was selected for regeneration
              updated[method] = data[method] || null;
            }
            // Otherwise, preserve existing value (don't touch it)
          }
          return updated;
        });

        // Call callback with all current values (new for regenerated, existing for others)
        onImagesGenerated?.({
          classic: updatedClassic,
          modern: updatedModern,
          rustic: updatedRustic,
          minimalist: updatedMinimalist,
        });

        onImagesGenerated?.({
          classic: updatedClassic,
          modern: updatedModern,
          rustic: updatedRustic,
          minimalist: updatedMinimalist,
        });

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
        {!hasImages && !isGenerating && (
          <>
            <button
              ref={generateButtonRef}
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6B00]/25 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Generate images for ${entityName}`}
            >
              <Icon icon={Sparkles} size="sm" aria-hidden={true} />
              <span>Generate Image</span>
            </button>
            <PlatingMethodSelectorPopup
              isOpen={showPlatingPopup}
              onClose={() => setShowPlatingPopup(false)}
              onGenerate={handleGenerate}
              triggerRef={generateButtonRef as unknown as React.RefObject<HTMLElement>}
            />
          </>
        )}
        {hasImages && !isGenerating && (
          <>
            <button
              ref={generateButtonRef}
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Regenerate images for ${entityName}`}
            >
              <Icon icon={Sparkles} size="xs" aria-hidden={true} />
              <span>Regenerate</span>
            </button>
            <PlatingMethodSelectorPopup
              isOpen={showPlatingPopup}
              onClose={() => setShowPlatingPopup(false)}
              onGenerate={handleGenerate}
              triggerRef={generateButtonRef as unknown as React.RefObject<HTMLElement>}
            />
          </>
        )}
        {isGenerating && (
          <div className="flex items-center gap-2 rounded-xl bg-[#2a2a2a]/40 px-4 py-2 text-sm font-medium text-gray-300">
            <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
            <span>Generating...</span>
          </div>
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
                  <Icon
                    icon={Loader2}
                    size="xl"
                    className="animate-spin text-[#29E7CD]"
                    aria-hidden={true}
                  />
                  <p className="text-sm font-medium text-white">Generating images...</p>
                  <p className="text-xs text-gray-400">This may take up to 10 seconds</p>
                </div>
              </div>
            </div>
          ) : (
            <FoodImageDisplay
              imageUrl={generatedClassic}
              imageUrlAlternative={generatedRustic}
              imageUrlModern={generatedModern}
              imageUrlMinimalist={generatedMinimalist}
              platingMethodsImages={generatedPlatingMethods}
              alt={`${entityName} food image`}
              priority={false}
              showSelector={true}
            />
          )}
        </div>
      )}

      {/* Generate Button */}
      {!hasImages && !isGenerating && (
        <>
          <button
            ref={generateButtonRef}
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B00]/25 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Generate images for ${entityName}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon icon={Sparkles} size="md" aria-hidden={true} />
              <span>Generate Food Images</span>
            </div>
          </button>
          <PlatingMethodSelectorPopup
            isOpen={showPlatingPopup}
            onClose={() => setShowPlatingPopup(false)}
            onGenerate={handleGenerate}
            triggerRef={generateButtonRef as unknown as React.RefObject<HTMLElement>}
          />
        </>
      )}

      {/* Regenerate Button (if images exist) */}
      {hasImages && !isGenerating && (
        <>
          <button
            ref={generateButtonRef}
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Regenerate images for ${entityName}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon icon={Sparkles} size="sm" aria-hidden={true} />
              <span>Regenerate Images</span>
            </div>
          </button>
          <PlatingMethodSelectorPopup
            isOpen={showPlatingPopup}
            onClose={() => setShowPlatingPopup(false)}
            onGenerate={handleGenerate}
            triggerRef={generateButtonRef as unknown as React.RefObject<HTMLElement>}
          />
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <Icon
              icon={AlertCircle}
              size="md"
              className="mt-0.5 flex-shrink-0 text-red-400"
              aria-hidden={true}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">Generation Failed</p>
              <p className="mt-1 text-xs text-red-300">{error}</p>
              {error.includes('Rate limit') && (
                <p className="mt-2 text-xs text-red-300/80">
                  You&apos;ve hit the limit - 10 generations per hour. Give it a breather and come
                  back in a bit.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
