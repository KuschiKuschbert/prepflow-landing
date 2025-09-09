'use client';

import dynamic from 'next/dynamic';

const AdvancedPerformanceTracker = dynamic(
  () => import('./AdvancedPerformanceTracker'),
  { ssr: false }
);

export default function ClientPerformanceTracker() {
  return <AdvancedPerformanceTracker />;
}
