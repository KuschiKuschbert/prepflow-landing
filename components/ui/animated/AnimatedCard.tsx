/**
 * Animated Card Component - Showcase of Modern Animation System
 * Demonstrates subtle, attractive animations that enhance UX
 */

'use client';

import React from 'react';
import { AnimatedDiv, FloatingElement } from '../../../lib/animation-stubs';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  title,
  description,
  icon,
  delay = 0,
  className = '',
  onClick,
}: AnimatedCardProps) {
  return (
    <AnimatedDiv
      animation="fadeInUp"
      delay={delay}
      className={`group relative cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/10 ${className} `}
      onClick={onClick}
    >
      {/* Floating Icon */}
      <FloatingElement intensity={1}>
        <div className="group-hover:animate-glow mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
          {icon}
        </div>
      </FloatingElement>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-fluid-lg font-semibold text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--primary)]">
          {title}
        </h3>
        <p className="text-fluid-sm leading-relaxed text-[var(--foreground-muted)]">{description}</p>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </AnimatedDiv>
  );
}
