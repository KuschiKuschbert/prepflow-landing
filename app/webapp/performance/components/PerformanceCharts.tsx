'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  PerformanceHistoryItem,
  PerformanceItem,
  WeatherByDateRecord,
} from '@/lib/types/performance';

interface PerformanceChartsProps {
  performanceItems: PerformanceItem[];
  performanceHistory: PerformanceHistoryItem[];
  weatherByDate?: Record<string, WeatherByDateRecord>;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onCategoryFilter?: (className: string) => void;
}

// Lazy load Recharts to reduce initial bundle size
// Only load when component is visible in viewport
const PerformanceChartsContent = dynamic(() => import('./PerformanceChartsLazy'), {
  ssr: false,
  loading: () => (
    <div className="mb-8 space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="h-72 w-full animate-pulse bg-[var(--muted)]" />
      </div>
    </div>
  ),
});

export default function PerformanceCharts({
  performanceItems,
  performanceHistory,
  weatherByDate,
  dateRange,
  onCategoryFilter,
}: PerformanceChartsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before entering viewport
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (performanceItems.length === 0) {
    return null;
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {isIntersecting && (
        <PerformanceChartsContent
          performanceItems={performanceItems}
          performanceHistory={performanceHistory}
          weatherByDate={weatherByDate}
          dateRange={dateRange}
          isMobile={isMobile}
          onCategoryFilter={onCategoryFilter}
        />
      )}
      {!isIntersecting && (
        <div className="mb-8 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="h-72 w-full animate-pulse bg-[var(--muted)]" />
          </div>
        </div>
      )}
    </div>
  );
}
