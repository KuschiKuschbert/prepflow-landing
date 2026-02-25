'use client';

import dynamic from 'next/dynamic';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })),
  { ssr: false },
);
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(m => ({ default: m.SpeedInsights })),
  { ssr: false },
);

export default function ClientAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
