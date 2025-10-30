import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';

// cleaned: Removed performance trackers on request
import GoogleAnalytics from '../components/GoogleAnalytics';
import GoogleTagManager from '../components/GoogleTagManager';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights',
  description:
    'Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support. Start your profit journey now.',
  keywords: [
    'restaurant COGS',
    'menu profitability',
    'contributing margin',
    'gross profit optimization',
    'global hospitality',
    'international restaurants',
    'multi-currency support',
    'restaurant management',
    'menu costing',
    'profit analysis',
    'worldwide restaurant software',
  ],
  authors: [{ name: 'PrepFlow Team' }],
  creator: 'PrepFlow',
  publisher: 'PrepFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.prepflow.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights',
    description:
      'Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support.',
    url: 'https://www.prepflow.org',
    siteName: 'PrepFlow',
    images: [
      {
        url: '/images/dashboard-screenshot.png',
        width: 1200,
        height: 630,
        alt: 'PrepFlow Dashboard showing COGS metrics and profit analysis',
      },
    ],
    locale: 'en', // Changed from 'en_AU' to 'en' for global appeal
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights',
    description:
      'Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support.',
    images: ['/images/dashboard-screenshot.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#29E7CD" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PrepFlow" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      <body className="geist-sans-variable geist-mono-variable antialiased">
        <ErrorBoundary>
          {children}

          <Analytics />

          {/* Analytics and tracking */}
          <GoogleAnalytics measurementId="G-W1D5LQXGJT" />
          <GoogleTagManager gtmId="GTM-WQMV22RD" ga4MeasurementId="G-W1D5LQXGJT" />
        </ErrorBoundary>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration - COMPLETELY DISABLED FOR DEVELOPMENT
              // Unregister any existing service workers in development
              if (window.location.hostname.includes('localhost')) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                    console.log('🗑️ Development: Service Worker unregistered');
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
