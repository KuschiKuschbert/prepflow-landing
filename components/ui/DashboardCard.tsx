'use client';

import { Icon } from '@/components/ui/Icon';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info';
  };
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'text-[var(--primary)]',
  badge,
  onClick,
  className = '',
  children,
}: DashboardCardProps) {
  const CardWrapper = onClick ? 'button' : 'div';

  const badgeClasses = {
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]',
    warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]',
    error: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]',
    info: 'bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info-border)]',
  };

  return (
    <CardWrapper
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl p-6 glass-surface premium-card-hover group text-left w-full ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Background Concentric Pattern */}
      <div className="concentric-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {value}
              </p>
              {badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClasses[badge.variant || 'success']}`}>
                  {badge.text}
                </span>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-2xl bg-[var(--surface-variant)] transition-all duration-300 group-hover:glow-primary group-hover:scale-110`}>
            <Icon icon={icon} size="md" className={iconColor} aria-hidden={true} />
          </div>
        </div>

        {subtitle && (
          <p className="text-sm text-[var(--foreground-subtle)] mt-auto">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]/30">
            {children}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
