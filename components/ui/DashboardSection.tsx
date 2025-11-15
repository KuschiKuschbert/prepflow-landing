'use client';

import React from 'react';

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
    <section className={`mb-6 lg:mb-8 xl:mb-10 large-desktop:mb-12 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="mb-4 lg:mb-6 xl:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-fluid-xl lg:text-fluid-2xl xl:text-fluid-3xl font-bold text-white mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-fluid-sm lg:text-fluid-base text-gray-400">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
