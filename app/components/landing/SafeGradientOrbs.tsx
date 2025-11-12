'use client';

import React, { useState, useEffect } from 'react';
import GradientOrbs from './GradientOrbs';

/**
 * Safe wrapper for GradientOrbs that only renders on client
 * and prevents SSR errors
 */
export default function SafeGradientOrbs() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server - wait for client hydration
  if (!isClient) {
    return null;
  }

  return <GradientOrbs />;
}
