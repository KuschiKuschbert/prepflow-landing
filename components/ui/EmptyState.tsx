'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { ScrollReveal } from './ScrollReveal';
import { WEBAPP_LANDING_PRESETS, LANDING_TYPOGRAPHY, LANDING_COLORS } from '@/lib/landing-styles';

export interface EmptyStateProps {
  /**
   * Title text for the empty state
   */
  title: string;
  /**
   * Message/description text (can be ReactNode for complex content)
   */
  message: string | ReactNode;
  /**
   * Optional icon to display
   */
  icon?: LucideIcon;
  /**
   * Optional action buttons or custom content
   */
  actions?: ReactNode;
  /**
   * Optional header section with title and actions
   */
  header?: {
    title: string;
    actions?: ReactNode;
  };
  /**
   * Use landing page styling (default: true)
   */
  useLandingStyles?: boolean;
  /**
   * Style variant: 'landing' or 'material'
   */
  variant?: 'landing' | 'material';
  /**
   * Enable scroll reveal animation
   */
  animated?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Universal EmptyState component with landing page styling and Material Design 3 variant
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No items found"
 *   message="Start by adding your first item"
 *   icon={Plus}
 *   actions={<Button onClick={onAdd}>Add Item</Button>}
 *   useLandingStyles={true}
 * />
 * ```
 */
export function EmptyState({
  title,
  message,
  icon,
  actions,
  header,
  useLandingStyles = true,
  variant = 'landing',
  animated = true,
  className = '',
}: EmptyStateProps) {
  // Determine if we should use landing styles
  const useLanding = useLandingStyles && variant === 'landing';

  // Container classes
  const containerClasses = useLanding
    ? WEBAPP_LANDING_PRESETS.emptyState.container
    : 'overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]';

  // Icon classes
  const iconClasses = useLanding
    ? `${WEBAPP_LANDING_PRESETS.emptyState.icon} text-[var(--primary)]`
    : 'mx-auto mb-4 h-16 w-16 text-[var(--foreground-muted)]';

  // Title classes
  const titleClasses = useLanding
    ? WEBAPP_LANDING_PRESETS.emptyState.title
    : 'mb-2 text-xl font-semibold text-[var(--foreground)]';

  // Message classes
  const messageClasses = useLanding ? WEBAPP_LANDING_PRESETS.emptyState.message : 'text-[var(--foreground-muted)]';

  // Content wrapper
  const content = (
    <div className={`${containerClasses} ${className}`}>
      {/* Optional header section */}
      {header && (
        <div className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className={`${LANDING_TYPOGRAPHY.xl} font-semibold text-[var(--button-active-text)]`}>{header.title}</h2>
            {header.actions && <div className="flex items-center gap-2">{header.actions}</div>}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="p-12 text-center">
        {icon && (
          <div className="mb-4 flex justify-center">
            <Icon icon={icon} size="xl" className={iconClasses} aria-hidden={true} />
          </div>
        )}
        <h3 className={titleClasses}>{title}</h3>
        <p className={messageClasses}>{message}</p>
        {actions && (
          <div className={WEBAPP_LANDING_PRESETS.emptyState.actionContainer}>{actions}</div>
        )}
      </div>
    </div>
  );

  // Wrap with ScrollReveal if animated
  if (animated && useLanding) {
    return (
      <ScrollReveal variant="fade-up" delay={0.1} duration={0.4}>
        {content}
      </ScrollReveal>
    );
  }

  return content;
}
