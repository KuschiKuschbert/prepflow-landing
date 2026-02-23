/**
 * Guide navigation component.
 * Provides category filtering, search, and guide listing.
 */

'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  Search,
  BookOpen,
  Workflow,
  BookMarked,
  Rocket,
  FilePen,
  DollarSign,
  Thermometer,
  ClipboardCheck,
  Truck,
  FileText,
  ClipboardList,
  Package2,
  UtensilsCrossed,
  Users,
  Sparkles,
  CalendarDays,
  Settings,
  LayoutPanelLeft,
} from 'lucide-react';
import { getAllGuides, getGuidesByCategory } from '../data/guides';
import type { Guide, GuideCategory, GuideIconName } from '../data/guide-types';

const GUIDE_ICON_MAP: Record<GuideIconName, typeof Rocket> = {
  Rocket,
  FilePen,
  DollarSign,
  Thermometer,
  ClipboardCheck,
  Truck,
  FileText,
  ClipboardList,
  Package2,
  UtensilsCrossed,
  Users,
  Sparkles,
  CalendarDays,
  Settings,
  LayoutPanelLeft,
};

interface GuideNavigationProps {
  onSelectGuide: (guide: Guide) => void;
  selectedGuideId?: string;
  guides?: Guide[]; // Optional: provide custom guides list (for public page)
  getProgress?: (guideId: string) => { currentStepIndex: number; completedAt?: number } | null;
}

export function GuideNavigation({
  onSelectGuide,
  selectedGuideId,
  guides: providedGuides,
  getProgress,
}: GuideNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | 'all'>('all');

  const filteredGuides = useMemo(() => {
    let guides = providedGuides || getAllGuides();

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryGuides = getGuidesByCategory(selectedCategory);
      // If using provided guides, filter them by category
      if (providedGuides) {
        guides = guides.filter(guide => guide.category === selectedCategory);
      } else {
        guides = categoryGuides;
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      guides = guides.filter(
        guide =>
          guide.title.toLowerCase().includes(lowerQuery) ||
          guide.description.toLowerCase().includes(lowerQuery),
      );
    }

    return guides;
  }, [selectedCategory, searchQuery, providedGuides]);

  const categories: Array<{ id: GuideCategory | 'all'; label: string; icon: typeof BookOpen }> = [
    { id: 'all', label: 'All Guides', icon: BookOpen },
    { id: 'onboarding', label: 'Onboarding', icon: BookOpen },
    { id: 'workflow', label: 'Workflows', icon: Workflow },
    { id: 'reference', label: 'Reference', icon: BookMarked },
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Icon
          icon={Search}
          size="sm"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--foreground-muted)]"
          aria-hidden={true}
        />
        <input
          type="search"
          placeholder="Search guides..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3 pr-4 pl-12 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
          aria-label="Search guides"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition-colors ${
              selectedCategory === category.id
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:border-[var(--border)] hover:bg-[var(--muted)]/50'
            }`}
            aria-label={`Filter by ${category.label}`}
            aria-pressed={selectedCategory === category.id}
          >
            <Icon icon={category.icon} size="sm" aria-hidden={true} />
            {category.label}
          </button>
        ))}
      </div>

      {/* Guide list */}
      <div className="space-y-3">
        {filteredGuides.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--foreground-muted)]">
            No guides found. Try a different search or category.
          </div>
        ) : (
          filteredGuides.map(guide => (
            <button
              key={guide.id}
              type="button"
              onClick={() => onSelectGuide(guide)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                selectedGuideId === guide.id
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-lg'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border)] hover:bg-[var(--muted)]/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {guide.iconName && GUIDE_ICON_MAP[guide.iconName] && (
                  <Icon
                    icon={GUIDE_ICON_MAP[guide.iconName]}
                    size="lg"
                    className="shrink-0 text-[var(--primary)]"
                    aria-hidden={true}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--foreground)]">{guide.title}</h3>
                  <p className="mt-1 text-sm text-[var(--foreground-muted)]">{guide.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--foreground-subtle)]">
                    {guide.difficulty && <span className="capitalize">{guide.difficulty}</span>}
                    {guide.estimatedTime && <span>{Math.round(guide.estimatedTime / 60)} min</span>}
                    <span>{guide.steps.length} steps</span>
                    {getProgress &&
                      (() => {
                        const p = getProgress(guide.id);
                        if (p?.completedAt) {
                          return (
                            <span className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-[var(--primary)]">
                              Completed
                            </span>
                          );
                        }
                        if (p && p.currentStepIndex > 0) {
                          return (
                            <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[var(--primary)]">
                              Resume from step {p.currentStepIndex + 1}
                            </span>
                          );
                        }
                        return null;
                      })()}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
