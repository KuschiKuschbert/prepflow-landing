import { useEffect, useState } from 'react';

type ViewMode = 'list' | 'editor' | 'builder';

export function useDishesClientViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    const checkBuilderParam = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const builderParam = urlParams.get('builder');
        if (builderParam === 'true') {
          console.log('[DishesClient] Builder parameter detected, switching to builder mode');
          setViewMode('builder');
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', newUrl);
        }
      }
    };

    checkBuilderParam();
    const timeoutId1 = setTimeout(checkBuilderParam, 50);
    const timeoutId2 = setTimeout(checkBuilderParam, 200);
    const timeoutId3 = setTimeout(checkBuilderParam, 500);

    window.addEventListener('popstate', checkBuilderParam);
    window.addEventListener('hashchange', checkBuilderParam);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('popstate', checkBuilderParam);
      window.removeEventListener('hashchange', checkBuilderParam);
    };
  }, []);

  return { viewMode, setViewMode };
}
