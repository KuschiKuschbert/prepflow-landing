import Link from 'next/link';
import { LANDING_TYPOGRAPHY } from '@/lib/landing-styles';

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
        className={`${LANDING_TYPOGRAPHY.sm} text-gray-400 transition-colors duration-200 hover:text-[#29E7CD]`}
      >
        Dashboard
      </Link>
      {pathname !== '/webapp' && (
        <>
          <span className={`${LANDING_TYPOGRAPHY.sm} text-gray-500`}>/</span>
          <span className={`${LANDING_TYPOGRAPHY.sm} font-medium text-[#29E7CD]`}>
            {navigationItems.find(item => isActive(item.href))?.label || 'Page'}
          </span>
        </>
      )}
    </div>
  );
}
