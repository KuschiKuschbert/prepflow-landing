'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Menu Builder page - redirects to Recipes page with menu-builder tab.
 * Menu Builder is now integrated as a tab within the Recipes page.
 */
export default function MenuBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Recipes page with menu-builder tab
    router.replace('/webapp/recipes#menu-builder');
  }, [router]);

  return null;
}
