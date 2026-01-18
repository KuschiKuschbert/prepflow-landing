import type { ConversionEvent } from '../types';

export function trackUserInteractions(
  sessionId: string,
  userId: string | undefined,
  trackEvent: (action: string, category: string, label?: string) => void,
  trackConversion: (conversion: ConversionEvent) => void,
): void {
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const cta = target.closest('a, button');
    if (cta) {
      const text = cta.textContent?.trim() || '';
      const href = (cta as HTMLAnchorElement).href;
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
  });
  let maxScrollDepth = 0;
  const keySections = ['#features', '#demo', '#pricing', '#faq'];
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
    );
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      if (maxScrollDepth % 25 === 0) trackEvent('scroll_depth', 'engagement', `${maxScrollDepth}%`);
    }
    keySections.forEach(sectionId => {
      const section = document.querySelector(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && !section.hasAttribute('data-tracked')) {
          section.setAttribute('data-tracked', 'true');
          const sectionName = sectionId.replace('#', '');
          trackEvent('section_view', 'engagement', sectionName);
          if (typeof window !== 'undefined' && window.gtag) {
            if (sectionName === 'pricing') {
              window.gtag('event', 'view_item_list', {
                item_list_id: 'pricing_section',
                item_list_name: 'Pricing Options',
              });
            } else if (sectionName === 'demo') {
              window.gtag('event', 'view_item', {
                item_id: 'demo_video',
                item_name: 'PrepFlow Demo Video',
              });
            }
          }
        }
      }
    });
  });
}
