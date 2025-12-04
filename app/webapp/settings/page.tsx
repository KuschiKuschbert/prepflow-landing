'use client';

import { prefetchApis } from '@/lib/cache/data-cache';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { SectionSkeleton } from './components/SectionSkeleton';
import { SettingsLayout, SettingsSection } from './components/SettingsLayout';

// Lazy load all section components for code splitting
const ProfileAccountSection = dynamic(
  () =>
    import('./components/sections/ProfileAccountSection').then(mod => ({
      default: mod.ProfileAccountSection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const SecuritySection = dynamic(
  () =>
    import('./components/sections/SecuritySection').then(mod => ({
      default: mod.SecuritySection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const PreferencesSection = dynamic(
  () =>
    import('./components/sections/PreferencesSection').then(mod => ({
      default: mod.PreferencesSection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const DataBackupSection = dynamic(
  () =>
    import('./components/sections/DataBackupSection').then(mod => ({
      default: mod.DataBackupSection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const PrivacyLegalSection = dynamic(
  () =>
    import('./components/sections/PrivacyLegalSection').then(mod => ({
      default: mod.PrivacyLegalSection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const AdvancedSection = dynamic(
  () =>
    import('./components/sections/AdvancedSection').then(mod => ({
      default: mod.AdvancedSection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const FAQSection = dynamic(
  () =>
    import('./components/sections/FAQSection').then(mod => ({
      default: mod.FAQSection,
    })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

export default function SettingsPage() {
  // Always start with 'profile' for SSR consistency, then sync on client
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Prefetch all settings API endpoints on mount
  useEffect(() => {
    prefetchApis([
      '/api/user/profile',
      '/api/user/notifications',
      '/api/user/sessions',
      '/api/user/login-history',
      '/api/user/data-usage',
      '/api/user/activity?limit=5',
      '/api/backup/settings',
      '/api/backup/list',
    ]);
  }, []);

  // Sync with URL hash or sessionStorage after hydration
  useEffect(() => {
    // Check URL hash first
    const hash = window.location.hash.slice(1);
    if (
      hash &&
      ['profile', 'security', 'preferences', 'data', 'privacy', 'advanced', 'faq'].includes(hash)
    ) {
      setActiveSection(hash as SettingsSection);
      return;
    }

    // Check sessionStorage
    const stored = sessionStorage.getItem('settings_active_section');
    if (
      stored &&
      ['profile', 'security', 'preferences', 'data', 'privacy', 'advanced', 'faq'].includes(stored)
    ) {
      setActiveSection(stored as SettingsSection);
    }
  }, []);

  // Memoize section rendering to ensure stable component instances
  const renderSection = useMemo(() => {
    switch (activeSection) {
      case 'profile':
        return <ProfileAccountSection key="profile-section" />;
      case 'security':
        return <SecuritySection key="security-section" />;
      case 'preferences':
        return <PreferencesSection key="preferences-section" />;
      case 'data':
        return <DataBackupSection key="data-section" />;
      case 'privacy':
        return <PrivacyLegalSection key="privacy-section" />;
      case 'advanced':
        return <AdvancedSection key="advanced-section" />;
      case 'faq':
        return <FAQSection key="faq-section" />;
      default:
        return <ProfileAccountSection key="profile-section-default" />;
    }
  }, [activeSection]);

  return (
    <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection}
    </SettingsLayout>
  );
}
