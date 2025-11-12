'use client';

import React, { useState, useEffect } from 'react';
import AnimatedBackground from './AnimatedBackground';

/**
 * Safe wrapper for AnimatedBackground that only renders on client
 * and prevents SSR errors
 */
export default function SafeAnimatedBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server - wait for client hydration
  if (!isClient) {
    return null;
  }

  return <AnimatedBackground />;
}
