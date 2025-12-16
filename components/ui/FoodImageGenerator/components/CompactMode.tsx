/**
 * Compact mode rendering for FoodImageGenerator.
 */
import { Icon } from '@/components/ui/Icon';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import type { PlatingMethodOption } from '../../PlatingMethodSelectorPopup';
import { PlatingMethodSelectorPopup } from '../../PlatingMethodSelectorPopup';

interface CompactModeProps {
  hasImages: boolean;
  isGenerating: boolean;
  error: string | null;
  showPlatingPopup: boolean;
  setShowPlatingPopup: (show: boolean) => void;
  handleGenerateClick: () => void;
  handleGenerate: (methods: PlatingMethodOption[]) => Promise<void>;
  generateButtonRef: React.RefObject<HTMLButtonElement | null>;
  entityName: string;
}

export function CompactMode({
  hasImages,
  isGenerating,
  error,
  showPlatingPopup,
  setShowPlatingPopup,
  handleGenerateClick,
  handleGenerate,
  generateButtonRef,
  entityName,
}: CompactModeProps) {
  return (
    <>
      {!hasImages && !isGenerating && (
        <>
          <button
            ref={generateButtonRef}
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] via-[var(--tertiary)] to-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--tertiary)]/25 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="flex items-center gap-2 rounded-xl bg-[var(--muted)]/40 px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)]">
          <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
          <span>Generating...</span>
        </div>
      )}
      {error && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-[var(--color-error)]/10 px-3 py-2 text-xs text-[var(--color-error)]">
          <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
          <span>{error}</span>
        </div>
      )}
    </>
  );
}
