'use client';

import dynamic from 'next/dynamic';
import { SectionSkeleton } from '../SectionSkeleton';

// Lazy load panels for better performance
const NotificationsPanel = dynamic(
  () => import('../NotificationsPanel').then(mod => ({ default: mod.NotificationsPanel })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const ConnectedAccountsPanel = dynamic(
  () => import('../ConnectedAccountsPanel').then(mod => ({ default: mod.ConnectedAccountsPanel })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const PersonalitySettingsPanel = dynamic(
  () => import('../PersonalitySettingsPanel').then(mod => ({ default: mod.PersonalitySettingsPanel })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

/**
 * Preferences section component.
 * Combines notification settings, connected accounts, and personality settings.
 *
 * @component
 * @returns {JSX.Element} Preferences section
 */
export function PreferencesSection() {
  return (
    <div className="space-y-6">
      <NotificationsPanel />
      <ConnectedAccountsPanel />
      <PersonalitySettingsPanel />
    </div>
  );
}
