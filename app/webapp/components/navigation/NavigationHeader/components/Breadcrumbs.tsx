import { LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import Link from 'next/link';

interface BreadcrumbsProps {
  pathname: string;
  navigationItems: Array<{ href: string; label: string }>;
  isActive: (href: string) => boolean;
}

/**
 * Breadcrumbs component for desktop navigation
 */
export function Breadcrumbs({ pathname, navigationItems, isActive }: BreadcrumbsProps) {
  return (
    <div className="desktop:flex hidden items-center space-x-2">
      <Link
        href="/webapp"
        className={`${LANDING_TYPOGRAPHY.sm} text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--primary)]`}
      >
        Dashboard
      </Link>
      {pathname !== '/webapp' && (
        <>
          <span className={`${LANDING_TYPOGRAPHY.sm} text-[var(--foreground-subtle)]`}>/</span>
          <span className={`${LANDING_TYPOGRAPHY.sm} font-medium text-[var(--primary)]`}>
            {navigationItems.find(item => isActive(item.href))?.label || 'Page'}
          </span>
        </>
      )}
    </div>
  );
}
