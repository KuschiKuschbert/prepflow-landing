'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { PerformanceItem } from '../types';

interface PerformanceChartsProps {
  performanceItems: PerformanceItem[];
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

// Lazy load Recharts to reduce initial bundle size
const PerformanceChartsContent = dynamic(() => import('./PerformanceChartsLazy'), {
  ssr: false,
  loading: () => (
    <div className="mb-8 space-y-6">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="h-72 w-full animate-pulse bg-[#2a2a2a]" />
      </div>
    </div>
  ),
});

export default function PerformanceCharts({ performanceItems, dateRange }: PerformanceChartsProps) {
  const [isMobile, setIsMobile] = useState(false);

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
    <PerformanceChartsContent
      performanceItems={performanceItems}
      dateRange={dateRange}
      isMobile={isMobile}
    />
  );
}
