'use client';

import { usePerformanceInsights } from '../hooks/usePerformanceInsights';
import { PerformanceItem } from '../types';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

interface PerformanceInsightsProps {
  performanceItems: PerformanceItem[];
  performanceScore?: number;
}

export default function PerformanceInsights({
  performanceItems,
  performanceScore,
}: PerformanceInsightsProps) {
  const { insights, hasInsights, isLoadingAI } = usePerformanceInsights(
    performanceItems,
    performanceScore,
  );

  if (!hasInsights) {
    return null;
  }

  // Show all insights - display in responsive grid
  const displayedInsights = insights;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'hidden_gem':
        return <Icon icon={Lightbulb} size="sm" className="text-blue-400" />;
      case 'bargain_bucket':
        return <Icon icon={TrendingUp} size="sm" className="text-yellow-400" />;
      case 'burnt_toast':
        return <Icon icon={AlertTriangle} size="sm" className="text-red-400" />;
      case 'chefs_kiss':
        return <Icon icon={Award} size="sm" className="text-green-400" />;
      default:
        return <Icon icon={Lightbulb} size="sm" className="text-gray-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'hidden_gem':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'bargain_bucket':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'burnt_toast':
        return 'border-red-500/30 bg-red-500/10';
      case 'chefs_kiss':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  // Fixed grid layout to prevent flickering from layout shifts
  // Always use consistent responsive grid regardless of insight count
  const getGridColsClass = () => {
    // Responsive grid: 1 col mobile, 2 cols tablet, 4 cols desktop
    // This prevents layout shifts when insights change
    return 'tablet:grid-cols-2 desktop:grid-cols-4';
  };

  return (
    <div className="tablet:mb-3 tablet:space-y-2 desktop:mb-4 desktop:space-y-2.5 mb-2 space-y-1.5 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2">
      {/* Header */}
      <div className="tablet:p-2 desktop:p-3 p-1.5">
        <div className="tablet:mb-1.5 mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon icon={Lightbulb} size="sm" className="text-[#29E7CD]" />
            <h2 className="text-xs font-semibold text-white">
              Performance Insights & Recommendations
            </h2>
          </div>
        </div>
      </div>

      {/* Insights Grid - Responsive, shows all insights */}
      <div className="tablet:p-2 desktop:p-3 border-t border-[#2a2a2a] bg-[#2a2a2a]/30 p-1.5">
        <div className={`grid grid-cols-1 gap-1.5 ${getGridColsClass()}`}>
          {displayedInsights.map(insight => (
            <div
              key={insight.id}
              className={`tablet:p-2 desktop:p-2 rounded-lg border p-1.5 ${getInsightColor(insight.type)}`}
            >
              <div className="mb-1.5 flex items-start gap-1">
                {getInsightIcon(insight.type)}
                <div className="min-w-0 flex-1">
                  <h3 className="mb-0.5 text-xs leading-tight font-semibold text-white">
                    {insight.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-tight text-gray-300">
                    {insight.message}
                  </p>
                </div>
              </div>

              {insight.potentialImpact && (
                <div className="mb-1.5 rounded border border-[#2a2a2a] bg-[#1f1f1f] p-1.5">
                  <div className="text-xs leading-tight text-gray-400">
                    {insight.potentialImpact.description}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-[#29E7CD]">
                    {formatCurrency(insight.potentialImpact.value)}
                  </div>
                </div>
              )}

              {insight.items.length > 0 && (
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-gray-400">Items:</div>
                  <div className="flex flex-wrap gap-1">
                    {insight.items.slice(0, 3).map(item => (
                      <Link
                        key={item.id}
                        href={`/webapp/recipes?dish=${encodeURIComponent(item.name)}`}
                        className="group flex items-center gap-0.5 rounded border border-[#2a2a2a] bg-[#1f1f1f] px-1 py-0.5 text-xs text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:text-[#29E7CD]"
                      >
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                    {insight.items.length > 3 && (
                      <span className="rounded border border-[#2a2a2a] bg-[#1f1f1f] px-1 py-0.5 text-xs text-gray-500">
                        +{insight.items.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
