import type { ConversionEvent } from '../../types';

interface ClickHandlerContext {
  sessionId: string;
  userId: string | undefined;
  trackConversion: (conversion: ConversionEvent) => void;
}

export function handleTrackerClick(e: MouseEvent, { sessionId, userId, trackConversion }: ClickHandlerContext) {
  const target = e.target as HTMLElement;
  const cta = target.closest('a, button');
  if (cta) {
    const text = cta.textContent?.trim() || '';
    const href = (cta as HTMLAnchorElement).href;

    // Gumroad Purchase
    if (href && href.includes('gumroad.com/l/prepflow')) {
      trackConversion({
        type: 'cta_click',
        element: 'gumroad_purchase',
        page: window.location.pathname,
        timestamp: Date.now(),
        sessionId,
        userId,
        metadata: { href, text, action: 'purchase_start' },
      });
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'AUD',
          value: 29.0,
          items: [
            { item_id: 'prepflow_app', item_name: 'PrepFlow App', price: 29.0, quantity: 1 },
          ],
        });
      }
    }

    // Demo Watch
    if (text.includes('Watch Demo') || text.includes('Demo')) {
      trackConversion({
        type: 'demo_watch',
        element: text,
        page: window.location.pathname,
        timestamp: Date.now(),
        sessionId,
        userId,
        metadata: { href, text, action: 'demo_start' },
      });
    }

    // General CTA
    if (text.includes('Get Started') || text.includes('Start')) {
      trackConversion({
        type: 'cta_click',
        element: text,
        page: window.location.pathname,
        timestamp: Date.now(),
        sessionId,
        userId,
        metadata: { href, text, action: 'cta_click' },
      });
    }
  }
}
