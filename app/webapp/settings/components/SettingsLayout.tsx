'use client';

import { Icon } from '@/components/ui/Icon';
import { User, Shield, Settings, Database, Lock, Code, ChevronRight } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { RegionSelector } from './RegionSelector';

export type SettingsSection = 'profile' | 'security' | 'preferences' | 'data' | 'privacy' | 'advanced';

interface SettingsLayoutProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  children: ReactNode;
}

const sections: Array<{ id: SettingsSection; label: string; icon: typeof User }> = [
  { id: 'profile', label: 'Profile & Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'data', label: 'Data & Backup', icon: Database },
  { id: 'privacy', label: 'Privacy & Legal', icon: Lock },
  { id: 'advanced', label: 'Advanced', icon: Code },
];

/**
 * Settings layout component with sidebar navigation.
 * Provides a responsive sidebar navigation for settings sections.
 *
 * @component
 * @param {SettingsLayoutProps} props - Component props
 * @returns {JSX.Element} Settings layout with sidebar navigation
 */
export function SettingsLayout({ activeSection, onSectionChange, children }: SettingsLayoutProps) {
  // Update URL hash when section changes (after hydration)
  useEffect(() => {
    window.history.replaceState(null, '', `#${activeSection}`);
    // Persist active section in sessionStorage
    sessionStorage.setItem('settings_active_section', activeSection);
  }, [activeSection]);

  const handleSectionClick = (section: SettingsSection) => {
    onSectionChange(section);
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prefetch adjacent sections on hover
  const handleSectionHover = (section: SettingsSection) => {
    // Prefetch the section component
    const sectionMap: Record<SettingsSection, () => Promise<any>> = {
      profile: () => import('./sections/ProfileAccountSection'),
      security: () => import('./sections/SecuritySection'),
      preferences: () => import('./sections/PreferencesSection'),
      data: () => import('./sections/DataBackupSection'),
      privacy: () => import('./sections/PrivacyLegalSection'),
      advanced: () => import('./sections/AdvancedSection'),
    };

    // Prefetch the module (Next.js will handle this efficiently)
    if (sectionMap[section] && section !== activeSection) {
      sectionMap[section]().catch(() => {
        // Silently fail if prefetch fails
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 desktop:p-6">
      <div className="mb-6 flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <div className="flex justify-end desktop:block">
          <RegionSelector />
        </div>
      </div>

      {/* Mobile: Dropdown selector */}
      <div className="mb-6 block desktop:hidden">
        <label htmlFor="settings-section-select" className="mb-2 block text-sm font-medium text-gray-300">
          Section
        </label>
        <select
          id="settings-section-select"
          value={activeSection}
          onChange={e => handleSectionClick(e.target.value as SettingsSection)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
        >
          {sections.map(section => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-6 desktop:flex-row">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden desktop:block desktop:w-64 desktop:flex-shrink-0">
          <nav
            className="sticky space-y-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4"
            style={{ top: 'calc(var(--header-height-desktop) + 1.5rem)' }}
          >
            {sections.map(section => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  onMouseEnter={() => handleSectionHover(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-[#29E7CD]/10 text-[#29E7CD]'
                      : 'text-gray-300 hover:bg-[#2a2a2a]/40 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon icon={section.icon} size="md" aria-hidden={true} />
                  <span className="flex-1 font-medium">{section.label}</span>
                  {isActive && (
                    <Icon icon={ChevronRight} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
