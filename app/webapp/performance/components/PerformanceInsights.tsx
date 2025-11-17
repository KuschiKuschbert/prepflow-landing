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
        return <Icon icon={Lightbulb} size="md" className="text-blue-400" />;
      case 'bargain_bucket':
        return <Icon icon={TrendingUp} size="md" className="text-yellow-400" />;
      case 'burnt_toast':
        return <Icon icon={AlertTriangle} size="md" className="text-red-400" />;
      case 'chefs_kiss':
        return <Icon icon={Award} size="md" className="text-green-400" />;
      default:
        return <Icon icon={Lightbulb} size="md" className="text-gray-400" />;
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

  return (
    <div className="tablet:mb-4 tablet:space-y-2.5 desktop:mb-6 desktop:space-y-3 mb-3 space-y-2">
      <div className="flex items-center gap-2">
        <Icon icon={Lightbulb} size="md" className="text-[#29E7CD]" />
        <h2
          className="text-base font-semibold text-white"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw + 0.5rem, 1rem)' }}
        >
          Performance Insights & Recommendations
        </h2>
      </div>

      <div className="tablet:grid-cols-2 grid grid-cols-1 gap-3">
        {insights.map(insight => (
          <div
            key={insight.id}
            className={`tablet:p-4 desktop:p-5 rounded-xl border p-3 ${getInsightColor(insight.type)}`}
          >
            <div className="mb-3 flex items-start gap-2">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <h3
                  className="mb-1.5 text-sm font-semibold text-white"
                  style={{ fontSize: 'clamp(0.75rem, 1vw + 0.5rem, 0.875rem)' }}
                >
                  {insight.title}
                </h3>
                <p className="text-xs text-gray-300">{insight.message}</p>
              </div>
            </div>

            {insight.potentialImpact && (
              <div className="mb-3 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-2.5">
                <div className="text-xs text-gray-400">{insight.potentialImpact.description}</div>
                <div className="mt-1 text-base font-bold text-[#29E7CD]">
                  {formatCurrency(insight.potentialImpact.value)}
                </div>
              </div>
            )}

            {insight.items.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-gray-400">Affected Items:</div>
                <div className="flex flex-wrap gap-1.5">
                  {insight.items.slice(0, 5).map(item => (
                    <Link
                      key={item.id}
                      href={`/webapp/recipes?dish=${encodeURIComponent(item.name)}`}
                      className="group flex items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:text-[#29E7CD]"
                    >
                      <span>{item.name}</span>
                      <Icon
                        icon={ArrowRight}
                        size="xs"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  ))}
                  {insight.items.length > 5 && (
                    <span className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-2.5 py-1 text-xs text-gray-500">
                      +{insight.items.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
