'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import SettingsNavigation from './components/SettingsNavigation';

// Dynamic imports for settings sections to reduce initial bundle size
const ProfileAccountSection = dynamic(
  () =>
    import('./components/sections/ProfileAccountSection').then(mod => mod.ProfileAccountSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const BillingSection = dynamic(
  () => import('./components/sections/BillingSection').then(mod => mod.BillingSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const PreferencesSection = dynamic(
  () => import('./components/sections/PreferencesSection').then(mod => mod.PreferencesSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const SecuritySection = dynamic(
  () => import('./components/sections/SecuritySection').then(mod => mod.SecuritySection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const PrivacyLegalSection = dynamic(
  () =>
    import('./components/sections/PrivacyLegalSection').then(mod => mod.PrivacyLegalSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const ExportSection = dynamic(
  () => import('./components/sections/ExportSection').then(mod => mod.ExportSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const DataBackupSection = dynamic(
  () => import('./components/sections/DataBackupSection').then(mod => mod.DataBackupSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const QRCodesSection = dynamic(
  () => import('./components/sections/QRCodesSection').then(mod => mod.QRCodesSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const AdvancedSection = dynamic(
  () => import('./components/sections/AdvancedSection').then(mod => mod.AdvancedSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

const FeatureFlagsSection = dynamic(
  () =>
    import('./components/sections/FeatureFlagsSection').then(mod => mod.FeatureFlagsSection),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

// Help section components need to be imported individually if managed inside the page
// or wrapped in a separate component file if possible.
// Since HelpSupportPanel and FAQSection are small, we can dynamic import them or keep them if they are small.
// Let's dynamic import them to be consistent.
const HelpSupportPanel = dynamic(
  () => import('./components/HelpSupportPanel').then(mod => mod.HelpSupportPanel),
  { ssr: false },
);

const FAQSection = dynamic(
  () => import('./components/sections/FAQSection').then(mod => mod.FAQSection),
  { ssr: false },
);

type SettingsSection =
  | 'profile'
  | 'billing'
  | 'preferences'
  | 'security'
  | 'privacy'
  | 'help'
  | 'backup'
  | 'qr-codes'
  | 'exports'
  | 'advanced'
  | 'feature-flags';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from URL hash on client mount and sync with hash changes
  useEffect(() => {
    setIsMounted(true);

    const updateSectionFromHash = () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash.slice(1);
      const validSections: SettingsSection[] = [
        'profile',
        'billing',
        'preferences',
        'security',
        'privacy',
        'help',
        'backup',
        'qr-codes',
        'exports',
        'advanced',
        'feature-flags',
      ];

      if (validSections.includes(hash as SettingsSection)) {
        setActiveSection(hash as SettingsSection);
        // Scroll to section after a brief delay to ensure it's rendered
        setTimeout(() => {
          const element = document.querySelector(`#${hash}`);
          if (element) {
            // Account for header height when scrolling
            const headerHeight = window.innerWidth >= 1025 ? 64 : 56;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20; // 20px extra padding

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }, 300); // Increased delay to ensure section is rendered
      } else if (!hash) {
        setActiveSection('profile');
        // Set default hash
        if (typeof window !== 'undefined') {
          window.location.hash = '#profile';
        }
      }
    };

    // Set initial section from hash on mount
    updateSectionFromHash();

    // Sync with URL hash changes (e.g., browser back/forward)
    const handleHashChange = () => {
      updateSectionFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileAccountSection />;
      case 'billing':
        return <BillingSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'security':
        return <SecuritySection />;
      case 'privacy':
        return <PrivacyLegalSection />;
      case 'exports':
        return <ExportSection />;
      case 'help':
        return (
          <div className="space-y-6">
            <HelpSupportPanel />
            <FAQSection />
          </div>
        );
      case 'backup':
        return <DataBackupSection />;
      case 'qr-codes':
        return <QRCodesSection />;
      case 'advanced':
        return <AdvancedSection />;
      case 'feature-flags':
        return <FeatureFlagsSection />;
      default:
        return <ProfileAccountSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SettingsNavigation />
      <main className="desktop:ml-64 flex-1 overflow-auto">
        <div className="desktop:p-8 large-desktop:max-w-[1400px] mx-auto max-w-[1400px] p-6 xl:max-w-[1400px] 2xl:max-w-[1600px]">
          {/* Section Content - Render all sections with IDs for hash navigation */}
          {isMounted && (
            <div className="space-y-8">
              <div id="profile">{activeSection === 'profile' && renderSectionContent()}</div>
              <div id="billing">{activeSection === 'billing' && renderSectionContent()}</div>
              <div id="preferences">
                {activeSection === 'preferences' && renderSectionContent()}
              </div>
              <div id="security">{activeSection === 'security' && renderSectionContent()}</div>
              <div id="privacy">{activeSection === 'privacy' && renderSectionContent()}</div>
              <div id="exports">{activeSection === 'exports' && renderSectionContent()}</div>
              <div id="help">{activeSection === 'help' && renderSectionContent()}</div>
              <div id="backup">{activeSection === 'backup' && renderSectionContent()}</div>
              <div id="qr-codes">{activeSection === 'qr-codes' && renderSectionContent()}</div>
              <div id="advanced">{activeSection === 'advanced' && renderSectionContent()}</div>
              <div id="feature-flags">
                {activeSection === 'feature-flags' && renderSectionContent()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
