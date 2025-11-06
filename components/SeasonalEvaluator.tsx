// PrepFlow Personality System - Seasonal Evaluator (sets data-seasonal on <html>)

'use client';

import { useEffect } from 'react';
import { checkSeasonalMatch } from '@/lib/personality/utils';

export function SeasonalEvaluator() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const effect = checkSeasonalMatch();
    if (effect) {
      document.documentElement.setAttribute('data-seasonal', effect);
    } else {
      document.documentElement.removeAttribute('data-seasonal');
    }
  }, []);

  return null;
}
