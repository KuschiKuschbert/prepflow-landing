'use client';

import React from 'react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  if (!title && !subtitle && !actions) return null;

  return (
    <div className="desktop:mb-6 large-desktop:mb-8 desktop:flex-row desktop:items-center desktop:justify-between mb-4 flex flex-col gap-4">
      <div>
        {title && (
          <h2 className="text-fluid-xl desktop:text-fluid-2xl large-desktop:text-fluid-3xl mb-2 font-bold text-[var(--foreground)]">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-fluid-sm desktop:text-fluid-base text-[var(--foreground-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
