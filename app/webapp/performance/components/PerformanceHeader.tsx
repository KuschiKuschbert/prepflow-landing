'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../../components/static/PageHeader';
import { PerformanceAlert, PerformanceItem } from '../types';
import { BarChart3, Sparkles } from 'lucide-react';
import { useAIPerformanceTips } from '@/hooks/useAIPerformanceTips';
import { generatePerformanceTips } from '../utils/generatePerformanceTips';
import { useCountry } from '@/contexts/CountryContext';

interface PerformanceHeaderProps {
  performanceScore: number;
  performanceAlerts: PerformanceAlert[];
  performanceItems: PerformanceItem[];
}

export default function PerformanceHeader({
  performanceScore,
  performanceAlerts,
  performanceItems,
}: PerformanceHeaderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tips, setTips] = useState<ReturnType<typeof generatePerformanceTips>>([]);
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
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
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTooltip]);

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
    <div className="tablet:mb-6 desktop:mb-8 mb-4">
      <PageHeader
        title="Performance Analysis"
        subtitle="Analyze your menu performance and profitability"
        icon={BarChart3}
        actions={metrics}
      />

      {performanceAlerts.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-yellow-400">Performance Alerts</span>
          </div>
          <div className="space-y-1">
            {performanceAlerts.slice(-3).map(alert => (
              <div key={alert.id} className="text-sm text-yellow-300">
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
