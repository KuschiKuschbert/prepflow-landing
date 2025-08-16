import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MemberstackProvider from "../components/MemberstackProvider";
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepFlow – COGS & Menu Profit Tool | Transform Restaurant Margins in 24 Hours",
  description: "Your menu is leaking cash. PrepFlow finds every cent with contributing margin analysis, COGS tracking, and profit optimization. Built for Australian hospitality. Start your profit scan now.",
  keywords: [
    "restaurant COGS",
    "menu profitability", 
    "contributing margin",
    "gross profit optimization",
    "Australian hospitality",
    "restaurant management",
    "menu costing",
    "profit analysis"
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
    title: "PrepFlow – COGS & Menu Profit Tool | Transform Restaurant Margins in 24 Hours",
    description: "Your menu is leaking cash. PrepFlow finds every cent with contributing margin analysis, COGS tracking, and profit optimization.",
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
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PrepFlow – COGS & Menu Profit Tool | Transform Restaurant Margins in 24 Hours",
    description: "Your menu is leaking cash. PrepFlow finds every cent with contributing margin analysis, COGS tracking, and profit optimization.",
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
        <MemberstackProvider>
          {children}
        </MemberstackProvider>
        <Analytics />
      </body>
    </html>
  );
}
