'use client';

import { useEffect } from 'react';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';

export function useCOGSLoadingGate(loading: boolean) {
  useEffect(() => {
    if (loading) {
      startLoadingGate('cogs');
    } else {
      stopLoadingGate('cogs');
    }

    return () => {
      stopLoadingGate('cogs');
    };
  }, [loading]);
}
