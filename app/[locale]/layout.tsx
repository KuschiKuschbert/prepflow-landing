import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from '../../components/GoogleAnalytics';
import GoogleAnalyticsTest from '../../components/GoogleAnalyticsTest';
import GoogleTagManager from '../../components/GoogleTagManager';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>
        <div className="relative">
          {/* Language Switcher - Fixed Position */}
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          
          {children}
          
          <Analytics />
          <GoogleAnalytics measurementId="G-W1D5LQXGJT" />
          <GoogleTagManager gtmId="GTM-WQMV22RD" ga4MeasurementId="G-W1D5LQXGJT" />
          <GoogleAnalyticsTest />
        </div>
      </body>
    </html>
  );
}