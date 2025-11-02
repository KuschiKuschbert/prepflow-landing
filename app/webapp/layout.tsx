'use client';

import GlobalWarning from '@/components/GlobalWarning';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { useTranslation } from '@/lib/useTranslation';
import { Inter } from 'next/font/google';
import { CountryProvider } from '../../contexts/CountryContext';
import { GlobalWarningProvider } from '../../contexts/GlobalWarningContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import '../globals.css';
import ModernNavigation from './components/ModernNavigation';
import { DraftRecovery } from './components/DraftRecovery';

const inter = Inter({ subsets: ['latin'] });

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <NotificationProvider>
      <CountryProvider>
        <GlobalWarningProvider>
          <div className={`${inter.className} min-h-screen bg-transparent text-white`}>
            {/* Modern Navigation */}
            <ModernNavigation />

            {/* Global Warning System */}
            <GlobalWarning />

            {/* Draft Recovery */}
            <DraftRecovery />

            {/* Main Content */}
            <main className="bg-transparent">
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>
          </div>
        </GlobalWarningProvider>
      </CountryProvider>
    </NotificationProvider>
  );
}
