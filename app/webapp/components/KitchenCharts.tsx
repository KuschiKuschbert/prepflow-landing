'use client';

import { logger } from '@/lib/logger';
import dynamic from 'next/dynamic';
import { Component, ErrorInfo, ReactNode } from 'react';
import { useKitchenChartsData } from './hooks/useKitchenChartsData';

import { useInView } from 'react-intersection-observer';

// Error boundary component for chart loading errors
class ChartErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('KitchenCharts chunk loading error:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Silently fail - charts are non-critical
      return null;
    }

    return this.props.children;
  }
}

// Lazy load Recharts to reduce initial bundle size
const KitchenChartsContent = dynamic(() => import('./KitchenChartsLazy'), {
  ssr: false,
  loading: () => null, // Don't show loading, charts are non-critical
});

export default function KitchenCharts() {
  const { performanceData, temperatureChecks, loading } = useKitchenChartsData();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px', // Start loading 200px before items come into view
  });

  if (loading) {
    return null; // Don't show skeleton, charts are non-critical
  }

  return (
    <div ref={ref} className="min-h-[300px]">
      {inView && (
        <ChartErrorBoundary>
          <KitchenChartsContent
            performanceData={performanceData}
            temperatureChecks={temperatureChecks}
          />
        </ChartErrorBoundary>
      )}
    </div>
  );
}
