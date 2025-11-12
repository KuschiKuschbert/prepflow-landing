'use client';

import GlobalWarning from '@/components/GlobalWarning';
import CatchTheDocketOverlay from '@/components/Loading/CatchTheDocketOverlay';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { SessionTimeoutWarning } from '@/components/webapp/SessionTimeoutWarning';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useTranslation } from '@/lib/useTranslation';
import { Inter } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import { CountryProvider } from '../../contexts/CountryContext';
import { GlobalWarningProvider, useGlobalWarning } from '../../contexts/GlobalWarningContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import '../globals.css';
import SafeAnimatedBackground from '../components/landing/SafeAnimatedBackground';
import { DraftRecovery } from './components/DraftRecovery';
import ModernNavigation from './components/ModernNavigation';
import { PersonalityScheduler } from './components/PersonalityScheduler';
import { FloatingActionButton } from './components/navigation/FloatingActionButton';

const inter = Inter({ subsets: ['latin'] });

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  // Initialize as disabled only for auth routes to prevent any initial render
  const [disableArcadeOverlay, setDisableArcadeOverlay] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const path = window.location.pathname;
      return path.startsWith('/api/auth') || path.startsWith('/login') || path.startsWith('/auth');
    } catch {
      return false;
    }
  });

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

  // Disable arcade overlay only when coming from Auth0 or when auth error is present
  useEffect(() => {
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
          <WebAppLayoutContent
            disableArcadeOverlay={disableArcadeOverlay}
            isWarning={isWarning}
            remainingMs={remainingMs}
            resetTimeout={resetTimeout}
          >
            {children}
          </WebAppLayoutContent>
        </GlobalWarningProvider>
      </CountryProvider>
    </NotificationProvider>
  );
}

// Inner component that has access to GlobalWarningContext
function WebAppLayoutContent({
  children,
  disableArcadeOverlay,
  isWarning,
  remainingMs,
  resetTimeout,
}: Readonly<{
  children: React.ReactNode;
  disableArcadeOverlay: boolean;
  isWarning: boolean;
  remainingMs: number | null;
  resetTimeout: () => void;
}>) {
  const { warnings } = useGlobalWarning();
  const hasWarnings = warnings.length > 0;

  // Update CSS variable for warning height when GlobalWarning notifies us
  const handleWarningHeightChange = React.useCallback((height: number) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--warning-height', `${height}px`);
    }
  }, []);

  // Reset warning height when warnings are cleared
  useEffect(() => {
    if (!hasWarnings && typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--warning-height', '0px');
    }
  }, [hasWarnings]);

  return (
    <div className={`${inter.className} min-h-screen bg-transparent text-white`}>
      {/* Pulsating Concentric Circles Background */}
      <SafeAnimatedBackground />

      {/* Modern Navigation */}
      <ErrorBoundary>
        <ModernNavigation />
      </ErrorBoundary>

      {/* Global Warning System */}
      <GlobalWarning onHeightChange={handleWarningHeightChange} />

      {/* Draft Recovery */}
      <DraftRecovery />

      {/* Personality System Scheduler */}
      <PersonalityScheduler />

      {/* Main Content - dynamically adjust padding based on warning visibility */}
      <main className="webapp-main-content bg-transparent pb-20 md:ml-64 md:pb-0">
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

      {/* Floating Action Button (Mobile Only) */}
      <FloatingActionButton />
    </div>
  );
}
