'use client';

import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { WEBAPP_LANDING_PRESETS } from '@/lib/landing-styles';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string;
  icon?: LucideIcon; // Use LucideIcon instead of emoji string
  showLogo?: boolean;
  backButton?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  useLandingStyles?: boolean; // Enable landing page style enhancements
}

export function PageHeader({
  title,
  subtitle,
  icon,
  showLogo = false,
  backButton = false,
  onBack,
  actions,
  children,
  useLandingStyles = false,
}: PageHeaderProps) {
  // Determine title classes based on useLandingStyles prop
  const titleClasses = useLandingStyles
    ? `${WEBAPP_LANDING_PRESETS.header.title} flex items-center gap-2`
    : 'text-fluid-xl tablet:text-fluid-2xl flex items-center gap-2 font-bold text-[var(--foreground)]';

  // Determine subtitle classes based on useLandingStyles prop
  const subtitleClasses = useLandingStyles
    ? `${WEBAPP_LANDING_PRESETS.header.subtitle} truncate`
    : 'text-fluid-base truncate text-[var(--foreground-muted)]';

  // Icon color uses theme-aware primary color
  const iconColor = 'text-[var(--primary)]';

  // Container component - wrap with ScrollReveal if landing styles enabled
  const Container = useLandingStyles ? ScrollReveal : 'div';
  const containerProps = useLandingStyles
    ? { variant: 'fade-up' as const, delay: 0, duration: 0.3 }
    : {};

  return (
    <Container {...containerProps}>
      <div className="tablet:mb-6 desktop:mb-8 mb-4">
        <div className="tablet:mb-3 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4 desktop:mb-4 desktop:gap-6 mb-2 flex flex-col gap-2">
          <div className="tablet:gap-3 desktop:gap-4 flex items-center gap-2">
            {backButton && onBack && (
              <button
                onClick={onBack}
                className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                aria-label="Go back"
              >
                <Icon icon={ArrowLeft} size="md" />
              </button>
            )}
            {showLogo && !backButton && (
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="/images/prepflow-logo.png"
                  alt="PrepFlow Logo"
                  fill
                  sizes="40px"
                  className="rounded-lg object-contain"
                  priority
                />
              </div>
            )}
            <h1 className={titleClasses}>
              {icon && <Icon icon={icon} size="lg" className={iconColor} aria-hidden={true} />}
              {title}
            </h1>
          </div>
          {actions && (
            <div className="tablet:justify-end flex items-center justify-start">{actions}</div>
          )}
        </div>
        {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
        {children}
      </div>
    </Container>
  );
}
