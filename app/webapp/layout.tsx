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
import CatchTheDocketOverlay from '@/components/Loading/CatchTheDocketOverlay';
import { SessionTimeoutWarning } from '@/components/webapp/SessionTimeoutWarning';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const [disableArcadeOverlay, setDisableArcadeOverlay] = React.useState(false);

  // Session timeout configuration
  // 4 hours timeout with 15-minute warning (kitchen-optimized)
  const timeoutMs =
    typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS
      ? Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS)
      : 4 * 60 * 60 * 1000; // 4 hours default

  const warningMs =
    typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SESSION_WARNING_MS
      ? Number(process.env.NEXT_PUBLIC_SESSION_WARNING_MS)
      : 15 * 60 * 1000; // 15 minutes default

  const { isWarning, remainingMs, resetTimeout } = useSessionTimeout({
    timeoutMs,
    warningMs,
    onTimeout: () => {
      // Redirect to home page on timeout
      window.location.href = '/';
    },
    enabled: true,
  });

  // Disable arcade overlay when coming from Auth0 or when auth error is present
  React.useEffect(() => {
    try {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const fromAuth =
        typeof window !== 'undefined' ? window.location.pathname.startsWith('/api/auth') : false;
      const hasAuthError = search.includes('auth_error=1');
      const authFlag =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('PF_AUTH_IN_PROGRESS') === '1'
          : false;

      if (fromAuth || hasAuthError || authFlag) {
        setDisableArcadeOverlay(true);
      }

      // Clear the flag after landing on webapp
      if (authFlag) {
        sessionStorage.removeItem('PF_AUTH_IN_PROGRESS');
      }
    } catch (_) {}
  }, []);

  return (
    <NotificationProvider>
      <CountryProvider>
        <GlobalWarningProvider>
          <div className={`${inter.className} min-h-screen bg-transparent text-white`}>
            {/* Modern Navigation */}
            <ErrorBoundary>
              <ModernNavigation />
            </ErrorBoundary>

            {/* Global Warning System */}
            <GlobalWarning />

            {/* Draft Recovery */}
            <DraftRecovery />

            {/* Main Content */}
            <main className="bg-transparent">
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>

            {/* Arcade Loading Overlay (disabled around auth flows) */}
            {!disableArcadeOverlay && (
              <ErrorBoundary>
                <CatchTheDocketOverlay />
              </ErrorBoundary>
            )}

            {/* Session Timeout Warning */}
            <SessionTimeoutWarning
              isVisible={isWarning}
              remainingMs={remainingMs}
              onStayActive={resetTimeout}
            />
          </div>
        </GlobalWarningProvider>
      </CountryProvider>
    </NotificationProvider>
  );
}
