'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleTagManagerProps {
  gtmId: string;
  ga4MeasurementId?: string;
}

function GoogleTagManagerInner({ gtmId, ga4MeasurementId }: GoogleTagManagerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  // Initialize data layer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];

      // Initialize data layer with page info
      if (!hasInitialized.current) {
        window.dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js',
          page_title: document.title,
          page_location: window.location.href,
          page_path: pathname,
        });

        hasInitialized.current = true;
        console.log('✅ GTM Data Layer initialized');
      }
    }
  }, [pathname]);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer && hasInitialized.current) {
      // Push page view to data layer
      window.dataLayer.push({
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
        page_referrer: document.referrer,
        timestamp: Date.now(),
      });

      console.log('📊 GTM Page View tracked:', pathname);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
        onLoad={() => {
          console.log('📥 Google Tag Manager loaded');

          // Initialize gtag function for backward compatibility
          if (typeof window !== 'undefined' && !window.gtag) {
            window.gtag = function () {
              window.dataLayer.push(arguments);
            };
            console.log('🔧 gtag function initialized for GTM compatibility');
          }
        }}
        onError={() => {
          console.error('❌ Failed to load Google Tag Manager');
        }}
      />
    </>
  );
}

export default function GoogleTagManager({ gtmId, ga4MeasurementId }: GoogleTagManagerProps) {
  return (
    <Suspense fallback={null}>
      <GoogleTagManagerInner gtmId={gtmId} ga4MeasurementId={ga4MeasurementId} />
    </Suspense>
  );
}

// Helper function to push events to GTM data layer
export function pushToDataLayer(data: any) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
    console.log('📤 Data pushed to GTM:', data);
  }
}

// Helper function to track custom events
export function trackGTMEvent(eventName: string, parameters: Record<string, any> = {}) {
  pushToDataLayer({
    event: eventName,
    ...parameters,
    timestamp: Date.now(),
  });
}

// Helper function to track conversions
export function trackGTMConversion(
  conversionType: string,
  value?: number,
  parameters: Record<string, any> = {},
) {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: conversionType,
    value: value,
    ...parameters,
    timestamp: Date.now(),
  });
}

// Helper function to track user engagement
export function trackGTMEngagement(engagementType: string, parameters: Record<string, any> = {}) {
  pushToDataLayer({
    event: 'engagement',
    engagement_type: engagementType,
    ...parameters,
    timestamp: Date.now(),
  });
}
