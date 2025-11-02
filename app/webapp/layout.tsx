'use client';

import GlobalWarning from '@/components/GlobalWarning';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { useTranslation } from '@/lib/useTranslation';
import { Inter } from 'next/font/google';
import { CountryProvider } from '../../contexts/CountryContext';
import { GlobalWarningProvider } from '../../contexts/GlobalWarningContext';
import { UnsavedChangesProvider } from '../../contexts/UnsavedChangesContext';
import '../globals.css';
import ModernNavigation from './components/ModernNavigation';

const inter = Inter({ subsets: ['latin'] });

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <CountryProvider>
      <GlobalWarningProvider>
        <UnsavedChangesProvider>
          <div className={`${inter.className} min-h-screen bg-transparent text-white`}>
            {/* Modern Navigation */}
            <ModernNavigation />

            {/* Global Warning System */}
            <GlobalWarning />

            {/* Main Content */}
            <main className="bg-transparent">
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>
          </div>
        </UnsavedChangesProvider>
      </GlobalWarningProvider>
    </CountryProvider>
  );
}
