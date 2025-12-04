/**
 * Guide navigation component.
 * Provides category filtering, search, and guide listing.
 */

'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Search, BookOpen, Workflow, BookMarked } from 'lucide-react';
import { getAllGuides, getGuidesByCategory } from '../data/guides';
import type { Guide, GuideCategory } from '../data/guide-types';

interface GuideNavigationProps {
  onSelectGuide: (guide: Guide) => void;
  selectedGuideId?: string;
  guides?: Guide[]; // Optional: provide custom guides list (for public page)
}

export function GuideNavigation({
  onSelectGuide,
  selectedGuideId,
  guides: providedGuides,
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
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          aria-hidden={true}
        />
        <input
          type="search"
          placeholder="Search guides..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] py-3 pr-4 pl-12 text-white placeholder:text-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
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
                ? 'border-[#29E7CD] bg-[#29E7CD]/10 text-[#29E7CD]'
                : 'border-[#2a2a2a] bg-[#1f1f1f] text-gray-300 hover:border-[#2a2a2a] hover:bg-[#2a2a2a]/50'
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
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center text-gray-400">
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
                  ? 'border-[#29E7CD] bg-[#29E7CD]/10 shadow-lg'
                  : 'border-[#2a2a2a] bg-[#1f1f1f] hover:border-[#2a2a2a] hover:bg-[#2a2a2a]/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {guide.icon && (
                  <span className="text-2xl" aria-hidden={true}>
                    {guide.icon}
                  </span>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{guide.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{guide.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    {guide.difficulty && <span className="capitalize">{guide.difficulty}</span>}
                    {guide.estimatedTime && <span>{Math.round(guide.estimatedTime / 60)} min</span>}
                    <span>{guide.steps.length} steps</span>
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
