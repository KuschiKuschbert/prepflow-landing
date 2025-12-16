'use client';

import { useEffect, useState } from 'react';
import { HelpSupportPanel } from './components/HelpSupportPanel';
import SettingsNavigation from './components/SettingsNavigation';
import { AdvancedSection } from './components/sections/AdvancedSection';
import { BillingSection } from './components/sections/BillingSection';
import { DataBackupSection } from './components/sections/DataBackupSection';
import { FAQSection } from './components/sections/FAQSection';
import { PreferencesSection } from './components/sections/PreferencesSection';
import { PrivacyLegalSection } from './components/sections/PrivacyLegalSection';
import { ProfileAccountSection } from './components/sections/ProfileAccountSection';
import { QRCodesSection } from './components/sections/QRCodesSection';
import { SecuritySection } from './components/sections/SecuritySection';

type SettingsSection =
  | 'profile'
  | 'billing'
  | 'preferences'
  | 'security'
  | 'privacy'
  | 'help'
  | 'backup'
  | 'qr-codes'
  | 'advanced';

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
        'advanced',
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
      default:
        return <ProfileAccountSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SettingsNavigation />
      <main className="desktop:ml-64 flex-1 overflow-auto">
        <div className="desktop:p-8 p-6">
          {/* Section Content - Render all sections with IDs for hash navigation */}
          {isMounted && (
            <div className="space-y-6">
              <div id="profile">{activeSection === 'profile' && renderSectionContent()}</div>
              <div id="billing">{activeSection === 'billing' && renderSectionContent()}</div>
              <div id="preferences">
                {activeSection === 'preferences' && renderSectionContent()}
              </div>
              <div id="security">{activeSection === 'security' && renderSectionContent()}</div>
              <div id="privacy">{activeSection === 'privacy' && renderSectionContent()}</div>
              <div id="help">{activeSection === 'help' && renderSectionContent()}</div>
              <div id="backup">{activeSection === 'backup' && renderSectionContent()}</div>
              <div id="qr-codes">{activeSection === 'qr-codes' && renderSectionContent()}</div>
              <div id="advanced">{activeSection === 'advanced' && renderSectionContent()}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
