import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepFlow – COGS & Menu Profit Tool | Clear Menu Numbers in Google Sheets",
  description: "PrepFlow helps you see item-level costs and margins with contributing margin analysis and COGS tracking in a Google Sheet. Built for small food businesses with GST and multi-currency support.",
  keywords: [
    "restaurant COGS",
    "menu profitability", 
    "contributing margin",
    "gross profit optimization",
    "global hospitality",
    "international restaurants",
    "multi-currency support",
    "restaurant management",
    "menu costing",
    "profit analysis",
    "worldwide restaurant software"
  ],
  authors: [{ name: "PrepFlow Team" }],
  creator: "PrepFlow",
  publisher: "PrepFlow",
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
    title: "PrepFlow – COGS & Menu Profit Tool | Clear Menu Numbers in Google Sheets",
    description: "See item-level costs and margins with contributing margin analysis and COGS tracking in a Google Sheet.",
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
    title: "PrepFlow – COGS & Menu Profit Tool | Clear Menu Numbers in Google Sheets",
    description: "See item-level costs and margins with contributing margin analysis and COGS tracking in a Google Sheet.",
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
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Consent Mode v2 (default denied until consent) */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <>
            <Script id="consent-default" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied'
                });
              `}
            </Script>
          </>
        ) : null}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-inline" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
