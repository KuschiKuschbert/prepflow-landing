'use client';

import { useEffect, useState } from 'react';

export default function GoogleAnalyticsTest() {
  const [isGtagAvailable, setIsGtagAvailable] = useState(false);
  const [testEventSent, setTestEventSent] = useState(false);

  useEffect(() => {
    // Check if gtag is available
    const checkGtag = () => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        setIsGtagAvailable(true);
        console.log('✅ gtag function is available');
      } else {
        console.log('⏳ Waiting for gtag function...');
        setTimeout(checkGtag, 500);
      }
    };

    checkGtag();
  }, []);

  const sendTestEvent = () => {
    if (window.gtag) {
      window.gtag('event', 'test_event', {
        event_category: 'testing',
        event_label: 'ga4_integration_test',
        value: 1,
        custom_parameter_test: 'true',
        custom_parameter_timestamp: Date.now(),
      });

      setTestEventSent(true);
      console.log('🧪 Test event sent to Google Analytics');

      // Also test our analytics service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'analytics_test', {
          event_category: 'testing',
          event_label: 'analytics_service_test',
          value: 1,
        });
        console.log('🧪 Analytics service test event sent');
      }
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-white">
      <h4 className="mb-2 font-semibold">🔍 GA4 Test Panel</h4>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span>gtag Available:</span>
          <span className={isGtagAvailable ? 'text-green-400' : 'text-red-400'}>
            {isGtagAvailable ? '✅' : '❌'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Test Event:</span>
          <span className={testEventSent ? 'text-green-400' : 'text-gray-400'}>
            {testEventSent ? '✅ Sent' : '⏳ Pending'}
          </span>
        </div>

        <button
          onClick={sendTestEvent}
          disabled={!isGtagAvailable}
          className="mt-2 w-full rounded bg-blue-600 px-3 py-1 text-xs transition-colors hover:bg-blue-700 disabled:bg-gray-600"
        >
          Send Test Event
        </button>

        <div className="mt-2 text-xs text-gray-400">Check console for detailed logs</div>
      </div>
    </div>
  );
}
