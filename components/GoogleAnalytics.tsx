'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Suspense, useCallback, useEffect, useRef } from 'react';

import { logger } from '@/lib/logger';

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

function GoogleAnalyticsInner({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  // Initialize gtag function
  const initializeGtag = useCallback(() => {
    if (typeof window !== 'undefined' && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer.push(arguments as unknown as Record<string, unknown>);
      };

      // Initialize with current date
      window.gtag('js', new Date());

      // Configure with measurement ID
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false, // We'll handle page views manually
      });

      hasInitialized.current = true;
      logger.dev('✅ Google Analytics initialized with ID:', measurementId);
    }
  }, [measurementId]);

  // Track page views
  useEffect(() => {
    if (pathname && window.gtag && hasInitialized.current) {
      // Track page view
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      });

      logger.dev('📊 GA4 Page View tracked:', pathname);
    }
  }, [pathname, searchParams]);

  // Initialize when component mounts
  useEffect(() => {
    // Wait for scripts to load
    let timeoutId: NodeJS.Timeout | null = null;
    const checkGtag = () => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        initializeGtag();
      } else {
        // Retry after a short delay
        timeoutId = setTimeout(checkGtag, 100);
      }
    };

    checkGtag();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [measurementId, initializeGtag]);

  return (
    <>
      {/* Load Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        onLoad={() => {
          logger.dev('📥 Google Analytics script loaded');
          initializeGtag();
        }}
        onError={() => {
          logger.error('❌ Failed to load Google Analytics script');
        }}
      />
      {/* Initialize gtag function */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false,
            });
            // Google Analytics gtag function initialized
          `,
        }}
        onLoad={() => {
          logger.dev('✅ Google Analytics initialization script loaded');
          initializeGtag();
        }}
      />
    </>
  );
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner measurementId={measurementId} />
    </Suspense>
  );
}
