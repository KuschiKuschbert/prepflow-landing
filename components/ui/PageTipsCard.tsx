'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { buildGuideUrl } from '@/lib/page-help/page-help-config';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Package,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import type { PageTipsConfig, SectionIconName } from '@/lib/page-help/page-tips-content';
import type { LucideIcon } from 'lucide-react';

const SECTION_ICON_MAP: Record<SectionIconName, LucideIcon> = {
  BookOpen,
  Package,
  UtensilsCrossed,
};

const DISMISSED_KEY_PREFIX = 'prepflow_tips_dismissed_';
const COLLAPSED_KEY_PREFIX = 'prepflow_tips_collapsed_';

function getDismissedKey(pageKey: string): string {
  return `${DISMISSED_KEY_PREFIX}${pageKey}`;
}

function getCollapsedKey(pageKey: string): string {
  return `${COLLAPSED_KEY_PREFIX}${pageKey}`;
}

function isDismissed(pageKey: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(getDismissedKey(pageKey)) === 'true';
}

function getCollapsed(pageKey: string): boolean {
  if (typeof window === 'undefined') return false; // SSR: start expanded
  const stored = localStorage.getItem(getCollapsedKey(pageKey));
  return stored === 'true'; // First visit = expanded (no key); only collapsed when explicitly stored
}

export interface PageTipsCardProps {
  /** Page tips config (tips, guideId, etc.) */
  config: PageTipsConfig;
  /** Optional max visit count before auto-hiding (default: show until dismissed) */
  maxVisits?: number;
  className?: string;
}

/**
 * Collapsible, dismissible tips card for pages without natural empty states.
 * Stored state in localStorage. PrepFlow voice. On-demand help—never blocks workflow.
 */
export function PageTipsCard({ config, maxVisits, className = '' }: PageTipsCardProps) {
  const [isVisible, setIsVisible] = useState(() => !isDismissed(config.pageKey));
  const [isCollapsed, setIsCollapsed] = useState(() => getCollapsed(config.pageKey));

  useEffect(() => {
    setIsVisible(!isDismissed(config.pageKey));
    setIsCollapsed(getCollapsed(config.pageKey));
  }, [config.pageKey]);

  const handleDismiss = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getDismissedKey(config.pageKey), 'true');
    setIsVisible(false);
  };

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(getCollapsedKey(config.pageKey), String(!next));
    }
  };

  const guideUrl = config.guideId ? buildGuideUrl(config.guideId, config.guideStepIndex) : null;

  if (!isVisible) return null;

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] ${className}`}
      role="region"
      aria-label="Page tips"
    >
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10">
        {/* Header - always visible */}
        <div className="flex items-center justify-between border-b border-[var(--primary)]/20 bg-gradient-to-r from-[var(--primary)]/15 via-[var(--accent)]/10 to-[var(--primary)]/10 px-4 py-3">
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="flex items-center gap-2 text-left text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
            aria-expanded={!isCollapsed}
          >
            <Icon icon={Lightbulb} size="sm" className="text-[var(--primary)]" aria-hidden />
            {config.title ?? 'Quick tips'}
            <Icon
              icon={isCollapsed ? ChevronDown : ChevronUp}
              size="sm"
              className="text-[var(--foreground-muted)]"
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Dismiss tips"
          >
            <Icon icon={X} size="sm" aria-hidden />
          </button>
        </div>

        {/* Body - collapsible */}
        {!isCollapsed && (
          <div className="space-y-3 px-4 py-4">
            {config.sections ? (
              <div className="desktop:grid-cols-3 grid gap-4 text-sm text-[var(--foreground-secondary)]">
                {config.sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="mb-2 flex items-center gap-2 font-medium text-[var(--primary)]">
                      <Icon icon={SECTION_ICON_MAP[section.iconName]} size="sm" aria-hidden />
                      {section.title}
                    </h3>
                    <p>{section.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-inside list-disc space-y-2 text-sm text-[var(--foreground-secondary)] [&_li]:marker:text-[var(--primary)]">
                {(config.tips ?? []).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            )}
            {guideUrl && (
              <Link
                href={guideUrl}
                className="inline-block text-sm font-medium text-[var(--primary)] transition-colors hover:underline"
              >
                Open full guide →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
