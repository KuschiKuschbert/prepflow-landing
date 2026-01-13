'use client';

import React, { useRef, useState } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  /**
   * Whether to constrain card width to prevent stretching on large screens
   * @default true - Prevents stretching, maintains optimal card proportions
   */
  constrainWidth?: boolean;
}

/**
 * Converts hex color to rgba, or returns rgba string as-is
 */
function normalizeGlowColor(color: string): string {
  // If it's already rgba or a CSS variable, return as-is
  if (color.startsWith('rgba') || color.startsWith('var')) {
    return color;
  }

  // Handle hex colors - convert to rgba with default opacity
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  // Default fallback
  return 'rgba(41, 231, 205, 0.15)';
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(41, 231, 205, 0.15)', // Default to primary color
  constrainWidth = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const normalizedGlowColor = normalizeGlowColor(glowColor);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 ${
        constrainWidth ? 'mx-auto w-full max-w-[400px]' : 'w-full'
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${normalizedGlowColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};
