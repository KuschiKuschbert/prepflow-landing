'use client';

import { useEffect, useState } from 'react';
import AnimatedBackground from './AnimatedBackground';

interface SafeAnimatedBackgroundProps {
  theme?: string;
}

/**
 * Safe wrapper for AnimatedBackground that only renders on client
 * and prevents SSR errors
 */
export default function SafeAnimatedBackground({ theme = 'dark' }: SafeAnimatedBackgroundProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server - wait for client hydration
  if (!isClient) {
    return null;
  }

  return <AnimatedBackground theme={theme} />;
}
