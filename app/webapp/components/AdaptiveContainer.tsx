'use client';

import React from 'react';

interface AdaptiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AdaptiveContainer - Full-width container with responsive padding
 * Automatically accounts for sidebar on desktop and works seamlessly on mobile
 * Uses CSS variables for consistent spacing across the app
 */
export function AdaptiveContainer({ children, className = '' }: AdaptiveContainerProps) {
  return <div className={`adaptive-container w-full ${className}`}>{children}</div>;
}
