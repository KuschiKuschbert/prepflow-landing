'use client';

import { Icon } from '@/components/ui/Icon';
import { LayoutDashboard, Settings, RefreshCw, Link2, History, Webhook } from 'lucide-react';

type SquareSection = 'overview' | 'configuration' | 'sync' | 'mappings' | 'history' | 'webhooks';

interface SquareNavigationProps {
  activeSection: SquareSection;
}

const navigationItems: Array<{
  id: SquareSection;
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
}> = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    href: '#overview',
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: Settings,
    href: '#configuration',
  },
  {
    id: 'sync',
    label: 'Sync',
    icon: RefreshCw,
    href: '#sync',
  },
  {
    id: 'mappings',
    label: 'Mappings',
    icon: Link2,
    href: '#mappings',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    href: '#history',
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    icon: Webhook,
    href: '#webhooks',
  },
];

export function SquareNavigation({ activeSection }: SquareNavigationProps) {
  const handleNavClick = (href: string) => {
    // Use hash navigation instead of router.push for instant switching
    if (typeof window !== 'undefined') {
      // Use history API to avoid React compiler error
      const url = new URL(window.location.href);
      url.hash = href;
      window.history.pushState(null, '', url.toString());
      // Trigger hashchange event for compatibility
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  return (
    <nav className="sticky top-[calc(var(--header-height-desktop)+1rem)] space-y-1">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="mb-4 text-sm font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
          Navigation
        </h3>
        <ul className="space-y-1">
          {navigationItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon icon={item.icon} size="sm" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
