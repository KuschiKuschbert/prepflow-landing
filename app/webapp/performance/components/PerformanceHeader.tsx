'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader } from '../../components/static/PageHeader';
import type { PerformanceAlert, PerformanceItem, PerformanceMetadata } from '../types';
import { BarChart3, Info, Sparkles } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useAIPerformanceTips } from '@/hooks/useAIPerformanceTips';
import { generatePerformanceTips } from '../utils/generatePerformanceTips';
import { useCountry } from '@/contexts/CountryContext';

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

  // Fetch AI tips when component mounts or data changes
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const aiTips = await generateTips(performanceScore, performanceItems, selectedCountry);
        if (aiTips.length > 0) {
          setTips(aiTips);
        } else {
          // Fallback to rule-based if AI returns empty
          setTips(generatePerformanceTips(performanceScore, performanceItems));
        }
      } catch (error) {
        // Fallback to rule-based on error
        setTips(generatePerformanceTips(performanceScore, performanceItems));
      }
    };

    fetchTips();
  }, [performanceScore, performanceItems, selectedCountry, generateTips]);

  // Update methodology tooltip position when visible
  useEffect(() => {
    if (showMethodologyTooltip && methodologyButtonRef.current) {
      const rect = methodologyButtonRef.current.getBoundingClientRect();
      setMethodologyTooltipPos({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
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
      ? 'text-green-400'
      : scoreForColor >= 70
        ? 'text-yellow-400'
        : 'text-red-400';

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  const metrics = (
    <div className="tablet:flex-row tablet:items-center tablet:gap-4 flex flex-col items-start gap-2">
      <div className="relative text-right" ref={scoreRef}>
        <div className="text-sm text-gray-400">Performance Score</div>
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
          <Sparkles className="h-4 w-4 text-[#29E7CD] transition-opacity hover:opacity-80" />
        </div>

        {showTooltip && tips.length > 0 && (
          <div
            ref={tooltipRef}
            className="tablet:right-0 absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-xl"
            role="tooltip"
          >
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#29E7CD]" />
              <h4 className="text-sm font-semibold text-white">AI-Enhanced Improvement Tips</h4>
              {tipsLoading && <span className="ml-auto text-xs text-gray-400">Loading...</span>}
            </div>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {tipsLoading && tips.length === 0 ? (
                <div className="text-sm text-gray-400">Generating tips...</div>
              ) : (
                tips.slice(0, 5).map((tip, index) => (
                  <div
                    key={index}
                    className="border-b border-[#2a2a2a] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-xs font-medium ${priorityColors[tip.priority]}`}>
                        {priorityLabels[tip.priority]}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{tip.category}</span>
                    </div>
                    <p className="mb-1 text-sm leading-relaxed text-gray-300">{tip.message}</p>
                    {tip.action && (
                      <p className="text-xs leading-relaxed text-[#29E7CD]">💡 {tip.action}</p>
                    )}
                  </div>
                ))
              )}
            </div>
            {tips.length > 5 && (
              <div className="mt-3 text-xs text-gray-400">
                +{tips.length - 5} more tip{tips.length - 5 > 1 ? 's' : ''} available
              </div>
            )}
            <div className="absolute -top-2 right-4 h-0 w-0 border-4 border-t-transparent border-r-transparent border-b-[#1f1f1f] border-l-transparent" />
          </div>
        )}
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
                  className="flex items-center justify-center rounded-lg p-1 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                  aria-label="Show methodology information"
                  onMouseEnter={() => setShowMethodologyTooltip(true)}
                  onMouseLeave={() => setShowMethodologyTooltip(false)}
                >
                  <Icon icon={Info} size="xs" className="text-[#29E7CD]" />
                </button>
                {showMethodologyTooltip &&
                  typeof window !== 'undefined' &&
                  createPortal(
                    <div
                      ref={methodologyTooltipRef}
                      className="fixed z-[100] w-80 -translate-x-1/2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 text-xs text-gray-300 shadow-lg"
                      style={{
                        top: `${methodologyTooltipPos.top - 320}px`,
                        left: `${methodologyTooltipPos.left}px`,
                      }}
                      onMouseEnter={() => setShowMethodologyTooltip(true)}
                      onMouseLeave={() => setShowMethodologyTooltip(false)}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Icon icon={Info} size="sm" className="text-[#29E7CD]" />
                        <h4 className="text-sm font-semibold text-white">Methodology</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 text-xs text-gray-400">Methodology</div>
                          <div className="text-sm font-semibold text-[#29E7CD]">
                            {metadata.methodology}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="mb-1 text-xs text-gray-400">Avg Profit Margin</div>
                            <div className="text-sm font-semibold text-white">
                              {metadata.averageProfitMargin?.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 text-xs text-gray-400">Avg Popularity</div>
                            <div className="text-sm font-semibold text-white">
                              {metadata.averagePopularity?.toFixed(1)}%
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="mb-1 text-xs text-gray-400">Popularity Threshold</div>
                            <div className="text-sm font-semibold text-[#D925C7]">
                              {metadata.popularityThreshold?.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-[#2a2a2a] pt-3">
                          <div className="space-y-1.5 text-xs text-gray-300">
                            <p>
                              <strong className="text-white">Profit Check:</strong> HIGH if above
                              menu average ({metadata.averageProfitMargin?.toFixed(1)}%), LOW if
                              below
                            </p>
                            <p>
                              <strong className="text-white">Popularity Check:</strong> HIGH if ≥
                              80% of average popularity ({metadata.popularityThreshold?.toFixed(1)}
                              %), LOW if below
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                              The PrepFlow COGS Dynamic methodology automatically adapts thresholds
                              based on your menu&apos;s actual performance, ensuring accurate
                              categorization that reflects your business reality.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-t-[#1f1f1f] border-r-transparent border-b-transparent border-l-transparent" />
                    </div>,
                    document.body,
                  )}
              </div>
            )}
          </div>
        }
        subtitle="Analyze your menu performance and profitability"
        icon={BarChart3}
        actions={metrics}
      />

      {performanceAlerts.length > 0 && (
        <div className="tablet:mb-2 desktop:mb-3 mb-1.5 flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-900/10 px-3 py-2">
          <svg
            className="h-4 w-4 flex-shrink-0 text-yellow-400"
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
            <span className="text-xs font-medium text-yellow-400">
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
