/**
 * Performance score tooltip component.
 */
'use client';

import { useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';
import { generatePerformanceTips } from '@/lib/performance/generatePerformanceTips';
import type { PerformanceTip } from '@/lib/performance/generatePerformanceTips/tipCategories';

interface PerformanceScoreTooltipProps {
  showTooltip: boolean;
  tips: ReturnType<typeof generatePerformanceTips>;
  tipsLoading: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function PerformanceScoreTooltip({
  showTooltip,
  tips,
  tipsLoading,
  onMouseEnter,
  onMouseLeave,
}: PerformanceScoreTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const priorityColors = {
    high: 'text-[var(--color-error)]',
    medium: 'text-[var(--color-warning)]',
    low: 'text-[var(--color-success)]',
  };
  const priorityLabels = { high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' };

  if (!showTooltip || tips.length === 0) return null;

  return (
    <div
      ref={tooltipRef}
      className="tablet:right-0 absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl"
      role="tooltip"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Sparkles} size="sm" className="text-[var(--primary)]" aria-hidden />
        <h4 className="text-sm font-semibold text-[var(--foreground)]">
          AI-Enhanced Improvement Tips
        </h4>
        {tipsLoading && (
          <span className="ml-auto text-xs text-[var(--foreground-muted)]">Loading...</span>
        )}
      </div>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {tipsLoading && tips.length === 0 ? (
          <div className="text-sm text-[var(--foreground-muted)]">Generating tips...</div>
        ) : (
          tips.slice(0, 5).map((tip: PerformanceTip, index: number) => (
            <div
              key={index}
              className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className={`text-xs font-medium ${priorityColors[tip.priority]}`}>
                  {priorityLabels[tip.priority]}
                </span>
                <span className="text-xs text-[var(--foreground-subtle)]">•</span>
                <span className="text-xs text-[var(--foreground-muted)]">{tip.category}</span>
              </div>
              <p className="mb-1 text-sm leading-relaxed text-[var(--foreground-secondary)]">
                {tip.message}
              </p>
              {tip.action && (
                <p className="text-xs leading-relaxed text-[var(--primary)]">💡 {tip.action}</p>
              )}
            </div>
          ))
        )}
      </div>
      {tips.length > 5 && (
        <div className="mt-3 text-xs text-[var(--foreground-muted)]">
          +{tips.length - 5} more tip{tips.length - 5 > 1 ? 's' : ''} available
        </div>
      )}
      <div className="absolute -top-2 right-4 h-0 w-0 border-4 border-t-transparent border-r-transparent border-b-[var(--surface)] border-l-transparent" />
    </div>
  );
}
