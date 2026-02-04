'use client';

/**
 * Script component to ensure service workers are unregistered and caches are cleared in development.
 */
export function DevelopmentServiceWorkerCleanup() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Service Worker Registration - COMPLETELY DISABLED FOR DEVELOPMENT
          // Unregister any existing service workers in development
          if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  registration.unregister().then(function(success) {
                    if (success) {
                      // Service worker unregistered in development
                    }
                  });
                }
              });
              // Also clear all caches
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) {
                    caches.delete(name);
                  }
                  // All caches cleared in development
                });
              }
            }
          }
        `,
      }}
    />
  );
}
