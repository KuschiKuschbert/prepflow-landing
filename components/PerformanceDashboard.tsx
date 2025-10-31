'use client';

import { useState, useEffect } from 'react';
import { usePerformanceOptimization } from './PerformanceOptimizer';
import { PERFORMANCE_BUDGETS, PERFORMANCE_GOALS } from '@/lib/performance-monitor';

interface PerformanceDashboardProps {
  showDetails?: boolean;
  className?: string;
}

export default function PerformanceDashboard({
  showDetails = false,
  className = '',
}: PerformanceDashboardProps) {
  const { metrics, score, grade, isGoodPerformance, isPoorPerformance } =
    usePerformanceOptimization();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show dashboard if performance is poor or in development
    if (isPoorPerformance || process.env.NODE_ENV === 'development') {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsVisible(true);
      }, 0);
    }
  }, [isPoorPerformance]);

  if (!isVisible && !showDetails) {
    return null;
  }

  const formatMetric = (value: number | null, unit: string) => {
    if (value === null) return 'Loading...';
    return `${Math.round(value)}${unit}`;
  };

  const getMetricStatus = (key: keyof typeof metrics, value: number | null) => {
    if (value === null) return 'loading';
    const budget = PERFORMANCE_BUDGETS[key];
    const goal = PERFORMANCE_GOALS[key];

    if (value <= goal) return 'excellent';
    if (value <= budget) return 'good';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-500';
      case 'B':
        return 'text-yellow-500';
      case 'C':
        return 'text-orange-500';
      case 'D':
        return 'text-red-500';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`fixed right-4 bottom-4 z-50 ${className}`}>
      <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Performance</h3>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${getGradeColor(grade)}`}>{grade}</span>
            <span className="text-sm text-gray-500">{score}%</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* LCP */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">LCP</span>
            <span
              className={`font-mono text-xs ${getStatusColor(getMetricStatus('lcp', metrics.lcp))}`}
            >
              {formatMetric(metrics.lcp, 'ms')}
            </span>
          </div>

          {/* FID */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">FID</span>
            <span
              className={`font-mono text-xs ${getStatusColor(getMetricStatus('fid', metrics.fid))}`}
            >
              {formatMetric(metrics.fid, 'ms')}
            </span>
          </div>

          {/* CLS */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">CLS</span>
            <span
              className={`font-mono text-xs ${getStatusColor(getMetricStatus('cls', metrics.cls))}`}
            >
              {formatMetric(metrics.cls, '')}
            </span>
          </div>

          {/* FCP */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">FCP</span>
            <span
              className={`font-mono text-xs ${getStatusColor(getMetricStatus('fcp', metrics.fcp))}`}
            >
              {formatMetric(metrics.fcp, 'ms')}
            </span>
          </div>

          {/* TTFB */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">TTFB</span>
            <span
              className={`font-mono text-xs ${getStatusColor(getMetricStatus('ttfb', metrics.ttfb))}`}
            >
              {formatMetric(metrics.ttfb, 'ms')}
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className="mb-1">
                <strong>Goals:</strong> LCP &lt;1.5s, FID &lt;50ms, CLS &lt;0.05
              </div>
              <div>
                <strong>Budgets:</strong> LCP &lt;2.5s, FID &lt;100ms, CLS &lt;0.1
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
