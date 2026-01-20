import type { ConversionEvent } from '../types';
import { handleTrackerClick } from './helpers/clickHandler';
import { handleTrackerScroll } from './helpers/scrollHandler';

export function trackUserInteractions(
  sessionId: string,
  userId: string | undefined,
  trackEvent: (action: string, category: string, label?: string) => void,
  trackConversion: (conversion: ConversionEvent) => void,
): void {
  document.addEventListener('click', e =>
    handleTrackerClick(e, { sessionId, userId, trackConversion })
  );

  window.addEventListener('scroll', () =>
    handleTrackerScroll({ trackEvent })
  );
}
