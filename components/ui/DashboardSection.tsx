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
    <section className={`desktop:mb-8 large-desktop:mb-10 mb-6 xl:mb-12 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="desktop:mb-6 large-desktop:mb-8 desktop:flex-row desktop:items-center desktop:justify-between mb-4 flex flex-col gap-4">
          <div>
            {title && (
              <h2 className="text-fluid-xl desktop:text-fluid-2xl large-desktop:text-fluid-3xl mb-2 font-bold text-[var(--foreground)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-fluid-sm desktop:text-fluid-base text-[var(--foreground-muted)]">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
