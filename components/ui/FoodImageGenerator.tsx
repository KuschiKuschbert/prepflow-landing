'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { FoodImageDisplay } from './FoodImageDisplay';
import { LoadingSkeleton } from './LoadingSkeleton';
import { PlatingMethodSelectorPopup, type PlatingMethodOption } from './PlatingMethodSelectorPopup';
import { handleGenerateHelper } from './FoodImageGenerator/helpers/handleGenerate';
import { CompactMode } from './FoodImageGenerator/components/CompactMode';

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
    try {
      await handleGenerateHelper(
        endpoint,
        selectedMethods,
        setIsGenerating,
        setError,
        showError,
        showSuccess,
        setGeneratedClassic,
        setGeneratedModern,
        setGeneratedRustic,
        setGeneratedMinimalist,
        setGeneratedPlatingMethods,
        generatedClassic,
        generatedModern,
        generatedRustic,
        generatedMinimalist,
        onImagesGenerated,
      );
    } catch (error) {
      logger.error('[FoodImageGenerator] Error generating images:', {
        error: error instanceof Error ? error.message : String(error),
        entityType,
        entityId,
      });
      // Error is handled by handleGenerateHelper via setError and showError
    }
  };

  if (compact) {
    return (
      <div className={className}>
        <CompactMode
          hasImages={hasImages}
          isGenerating={isGenerating}
          error={error}
          showPlatingPopup={showPlatingPopup}
          setShowPlatingPopup={setShowPlatingPopup}
          handleGenerateClick={handleGenerateClick}
          handleGenerate={handleGenerate}
          generateButtonRef={generateButtonRef}
          entityName={entityName}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Display */}
      {showDisplay && (
        <div>
          {isGenerating ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <LoadingSkeleton variant="card" className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/60 px-6 py-4 backdrop-blur-sm">
                  <Icon
                    icon={Loader2}
                    size="xl"
                    className="animate-spin text-[var(--primary)]"
                    aria-hidden={true}
                  />
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    Generating images...
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    This may take up to 10 seconds
                  </p>
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
            className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--tertiary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-[var(--tertiary)]/25 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="rounded-xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
          <div className="flex items-start gap-3">
            <Icon
              icon={AlertCircle}
              size="md"
              className="mt-0.5 flex-shrink-0 text-[var(--color-error)]"
              aria-hidden={true}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-error)]">Generation Failed</p>
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
