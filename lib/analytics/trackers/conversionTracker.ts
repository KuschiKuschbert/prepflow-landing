import type { ConversionEvent } from '../types';

export function trackConversions(
  sessionId: string,
  userId: string | undefined,
  trackConversion: (conversion: ConversionEvent) => void,
): void {
  const demoVideo = document.querySelector('iframe[src*="youtube"]');
  if (demoVideo) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackConversion({
            type: 'demo_watch',
            element: 'demo_section',
            page: window.location.pathname,
            timestamp: Date.now(),
            sessionId,
            userId,
            metadata: { section: 'demo' },
          });
          observer.disconnect();
        }
      });
    });
    observer.observe(demoVideo);
  }
}
