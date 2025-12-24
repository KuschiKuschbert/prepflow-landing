'use client';

import { memo, useEffect, useRef } from 'react';

interface NavigationChipsProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  getCategoryLabel: (category: string) => string;
}

/**
 * Horizontal scrolling category chips for navigation filtering.
 * Spotify-inspired design with Cyber Carrot styling.
 *
 * @component
 */
export const NavigationChips = memo(function NavigationChips({
  categories,
  activeCategory,
  onCategoryChange,
  getCategoryLabel,
}: NavigationChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active chip when it changes
  useEffect(() => {
    if (activeCategory && scrollRef.current) {
      const activeChip = scrollRef.current.querySelector(`[data-category="${activeCategory}"]`);
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <div className="relative mb-4">
      {/* Fade edges for scroll indication */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-6 bg-gradient-to-r from-[var(--surface)] to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-6 bg-gradient-to-l from-[var(--surface)] to-transparent" />

      {/* Scrollable chip container */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-2"
        role="tablist"
        aria-label="Navigation categories"
      >
        {/* "All" chip */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeCategory === null
              ? 'bg-gradient-to-r from-[var(--primary)] to-[#3B82F6] text-[var(--button-active-text)] shadow-[var(--primary)]/25 shadow-lg'
              : 'border border-[var(--border)] bg-[var(--muted)]/50 text-[var(--button-active-text)]/80 hover:border-[var(--primary)]/30 hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]'
          }`}
          style={{ transitionTimingFunction: 'var(--easing-standard)' }}
          role="tab"
          aria-selected={activeCategory === null}
          data-category="all"
        >
          All
        </button>

        {/* Category chips */}
        {categories.map(category => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--primary)] to-[#3B82F6] text-[var(--button-active-text)] shadow-[var(--primary)]/25 shadow-lg'
                  : 'border border-[var(--border)] bg-[var(--muted)]/50 text-[var(--button-active-text)]/80 hover:border-[var(--primary)]/30 hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]'
              }`}
              style={{ transitionTimingFunction: 'var(--easing-standard)' }}
              role="tab"
              aria-selected={isActive}
              data-category={category}
            >
              {getCategoryLabel(category)}
            </button>
          );
        })}
      </div>
    </div>
  );
});
