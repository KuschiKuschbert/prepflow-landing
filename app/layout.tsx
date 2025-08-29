import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from '../components/GoogleAnalytics';
import GoogleAnalyticsTest from '../components/GoogleAnalyticsTest';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights in 24 Hours",
  description: "Your menu is leaking cash. PrepFlow finds every cent with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support. Start your profit scan now.",
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
    title: "PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights in 24 Hours",
    description: "Your menu is leaking cash. PrepFlow finds every cent with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support.",
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
    title: "PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights in 24 Hours",
    description: "Your menu is leaking cash. PrepFlow finds every cent with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <GoogleAnalytics measurementId="G-W1D5LQXGJT" />
        <GoogleAnalyticsTest />
      </body>
    </html>
  );
}
