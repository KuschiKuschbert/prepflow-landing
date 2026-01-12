'use client';

import React from 'react';

import { DashboardHeader } from './DashboardHeader';

interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * DashboardSection - Standardized section wrapper for dashboard areas
 * Uses fluid typography for titles and consistent spacing
 */
export function DashboardSection({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: DashboardSectionProps) {
  return (
    <section className={`desktop:mb-8 large-desktop:mb-10 mb-6 xl:mb-12 ${className}`}>
      <DashboardHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </section>
  );
}
