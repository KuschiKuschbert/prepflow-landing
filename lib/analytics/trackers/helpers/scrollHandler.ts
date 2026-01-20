interface ScrollHandlerContext {
  trackEvent: (action: string, category: string, label?: string) => void;
}

let maxScrollDepth = 0;
const keySections = ['#features', '#demo', '#pricing', '#faq'];

export function handleTrackerScroll({ trackEvent }: ScrollHandlerContext) {
  // Track Scroll Depth
  const scrollDepth = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
  );
  if (scrollDepth > maxScrollDepth) {
    maxScrollDepth = scrollDepth;
    if (maxScrollDepth % 25 === 0) trackEvent('scroll_depth', 'engagement', `${maxScrollDepth}%`);
  }

  // Track Section Visibility
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
}
