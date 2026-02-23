'use client';

import { usePathname } from 'next/navigation';
import { getPageHelpConfig } from './page-help-config';

/**
 * Hook to get page help config for the current route.
 * Used by PageHeader to automatically show help icon when config exists.
 */
export function usePageHelp() {
  const pathname = usePathname();
  return pathname ? getPageHelpConfig(pathname) : null;
}
