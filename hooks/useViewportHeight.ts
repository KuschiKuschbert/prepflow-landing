import { useEffect, useState } from 'react';

interface UseViewportHeightOptions {
  headerHeight?: number;
  footerHeight?: number;
  filtersHeight?: number;
  padding?: number;
}

interface ViewportHeightResult {
  viewportHeight: number;
  availableHeight: number;
  chartHeight: number;
  statsAreaHeight: number;
  isMobile: boolean;
}

export function useViewportHeight(options: UseViewportHeightOptions = {}): ViewportHeightResult {
  const {
    headerHeight = 80, // Header with swipe indicator
    footerHeight = 80, // Done button footer
    filtersHeight = 60, // Time filter buttons
    padding = 48, // 24px top + 24px bottom
  } = options;

  const [viewportHeight, setViewportHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      setViewportHeight(height);

      // Detect if it's a touch device (mobile/tablet/iPad)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Detect iPad specifically
      const isIPad =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      // Treat as mobile if:
      // 1. Width < 1024px (standard mobile breakpoint), OR
      // 2. It's a touch device (tablets/iPad), OR
      // 3. It's specifically an iPad
      setIsMobile(width < 1024 || isTouchDevice || isIPad);
    };

    // Set initial values
    updateDimensions();

    // Add event listener
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Calculate available height for content
  // Account for spacing between elements (mb-6 = 24px between chart and logs)
  const spacingBetweenElements = 24;
  const availableHeight = Math.max(
    0,
    viewportHeight - headerHeight - footerHeight - filtersHeight - padding - spacingBetweenElements,
  );

  // Calculate chart height (35-40% of available space for better balance)
  // Mobile: 35% with min 150px, max 250px
  // Desktop: 40% with min 200px, max 300px
  const chartPercentage = isMobile ? 0.35 : 0.4;
  const chartMin = isMobile ? 150 : 200;
  const chartMax = isMobile ? 250 : 300;
  const chartHeight = Math.min(Math.max(availableHeight * chartPercentage, chartMin), chartMax);

  // Calculate stats area height (remaining space after chart)
  // Stats section is approximately 200-300px depending on screen size
  const statsAreaHeight = Math.max(0, availableHeight - chartHeight);

  return {
    viewportHeight,
    availableHeight,
    chartHeight,
    statsAreaHeight,
    isMobile,
  };
}
