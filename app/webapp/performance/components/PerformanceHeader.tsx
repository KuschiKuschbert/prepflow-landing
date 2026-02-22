'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../../components/static/PageHeader';
import type {
  PerformanceAlert,
  PerformanceItem,
  PerformanceMetadata,
} from '@/lib/types/performance';
import { BarChart3, Info, Sparkles } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useAIPerformanceTips } from '@/hooks/useAIPerformanceTips';
import { useCountry } from '@/contexts/CountryContext';
import { PerformanceScoreTooltip } from './PerformanceHeader/PerformanceScoreTooltip';
import { MethodologyTooltip } from './PerformanceHeader/MethodologyTooltip';
import { calculatePopoverPosition } from './PerformanceHeader/helpers/calculatePopoverPosition';
import { fetchPerformanceTips } from './PerformanceHeader/helpers/fetchPerformanceTips';
import { generatePerformanceTips } from '@/lib/performance/generatePerformanceTips';

interface PerformanceHeaderProps {
  performanceScore: number;
  performanceAlerts: PerformanceAlert[];
  performanceItems: PerformanceItem[];
  metadata: PerformanceMetadata | null;
}

export default function PerformanceHeader({
  performanceScore,
  performanceAlerts,
  performanceItems,
  metadata,
}: PerformanceHeaderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMethodologyTooltip, setShowMethodologyTooltip] = useState(false);
  const [tips, setTips] = useState<ReturnType<typeof generatePerformanceTips>>([]);
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const methodologyTooltipRef = useRef<HTMLDivElement>(null);
  const methodologyButtonRef = useRef<HTMLButtonElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const [methodologyTooltipPos, setMethodologyTooltipPos] = useState({ top: 0, left: 0 });
  const { generateTips, isLoading: tipsLoading } = useAIPerformanceTips();
  const { selectedCountry } = useCountry();

  // Prevent hydration mismatch by only rendering score after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchPerformanceTips(performanceScore, performanceItems, selectedCountry, generateTips).then(
      setTips,
    );
  }, [performanceScore, performanceItems, selectedCountry, generateTips]);

  useEffect(() => {
    if (showMethodologyTooltip && methodologyButtonRef.current) {
      setMethodologyTooltipPos(
        calculatePopoverPosition(methodologyButtonRef.current.getBoundingClientRect()),
      );
    }
  }, [showMethodologyTooltip]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        scoreRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !scoreRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
      if (
        methodologyTooltipRef.current &&
        methodologyButtonRef.current &&
        !methodologyTooltipRef.current.contains(event.target as Node) &&
        !methodologyButtonRef.current.contains(event.target as Node)
      ) {
        setShowMethodologyTooltip(false);
      }
    };

    if (showTooltip || showMethodologyTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTooltip, showMethodologyTooltip]);

  // Use 0 for color calculation during SSR to prevent hydration mismatch
  const scoreForColor = mounted ? performanceScore : 0;
  const performanceScoreColor =
    scoreForColor >= 90
      ? 'text-[var(--color-success)]'
      : scoreForColor >= 70
        ? 'text-[var(--color-warning)]'
        : 'text-[var(--color-error)]';

  const metrics = (
    <div className="tablet:flex-row tablet:items-center tablet:gap-4 flex flex-col items-start gap-2">
      <div className="relative text-right" ref={scoreRef}>
        <div className="text-sm text-[var(--foreground-muted)]">Performance Score</div>
        <div
          className={`relative inline-flex cursor-help items-center gap-2 ${performanceScoreColor}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          role="button"
          tabIndex={0}
          aria-label="Performance score with improvement tips"
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowTooltip(!showTooltip);
            }
          }}
        >
          <div className={`text-2xl font-bold`}>{mounted ? performanceScore : 0}/100</div>
          <Icon
            icon={Sparkles}
            size="sm"
            className="text-[var(--primary)] transition-opacity hover:opacity-80"
            aria-hidden
          />
        </div>
        <PerformanceScoreTooltip
          showTooltip={showTooltip}
          tips={tips}
          tipsLoading={tipsLoading}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
      </div>
    </div>
  );

  return (
    <div className="tablet:mb-3 desktop:mb-4 mb-2">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>Performance Analysis</span>
            {metadata && (
              <div className="relative">
                <button
                  ref={methodologyButtonRef}
                  onClick={() => setShowMethodologyTooltip(!showMethodologyTooltip)}
                  className="flex items-center justify-center rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                  aria-label="Show methodology information"
                  onMouseEnter={() => setShowMethodologyTooltip(true)}
                  onMouseLeave={() => setShowMethodologyTooltip(false)}
                >
                  <Icon icon={Info} size="xs" className="text-[var(--primary)]" />
                </button>
                <MethodologyTooltip
                  showMethodologyTooltip={showMethodologyTooltip}
                  methodologyTooltipPos={methodologyTooltipPos}
                  metadata={metadata}
                  onMouseEnter={() => setShowMethodologyTooltip(true)}
                  onMouseLeave={() => setShowMethodologyTooltip(false)}
                />
              </div>
            )}
          </div>
        }
        subtitle="Analyze your menu performance and profitability"
        icon={BarChart3}
        actions={metrics}
      />

      {performanceAlerts.length > 0 && (
        <div className="tablet:mb-2 desktop:mb-3 mb-1.5 flex items-center gap-2 rounded-lg border border-[var(--color-warning)]/20 bg-yellow-900/10 px-3 py-2">
          <svg
            className="h-4 w-4 flex-shrink-0 text-[var(--color-warning)]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <span className="text-xs font-medium text-[var(--color-warning)]">
              {performanceAlerts.length} alert{performanceAlerts.length > 1 ? 's' : ''}
            </span>
            <div className="mt-0.5 text-xs text-yellow-300/80">
              {performanceAlerts.slice(-1)[0]?.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
