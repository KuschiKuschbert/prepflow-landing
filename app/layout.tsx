import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MemberstackProvider from "../components/MemberstackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepFlow – COGS & Menu Profit Tool",
  description: "See true dish costs, GP%, popularity and pricing opportunities in minutes. Built for Australian hospitality (GST-ready).",
  icons: {
    icon: '/favicon.svg',
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
      </body>
    </html>
  );
}
