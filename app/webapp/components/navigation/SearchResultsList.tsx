'use client';

import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { prefetchRoute } from '@/lib/cache/prefetch-config';
import Link from 'next/link';
import React from 'react';

interface SearchResultsListProps {
  filtered: Array<{ href: string; label: string; icon: React.ReactNode; category?: string }>;
  query: string;
  onClose: () => void;
}

export function SearchResultsList({ filtered, query, onClose }: SearchResultsListProps) {
  const { trackNavigation } = useNavigationTracking();

  if (filtered.length === 0) {
    return (
      <div
        className="py-8 text-center text-[var(--foreground-subtle)]"
        role="status"
        aria-live="polite"
      >
        No results found for &quot;{query}&quot;
      </div>
    );
  }

  return (
    <div className="space-y-1" role="listbox" aria-label="Search results">
      {filtered.map(item => (
        <Link
          role="option"
          aria-label={`Go to ${item.label}${item.category ? ` in ${item.category}` : ''}`}
          key={item.href}
          href={item.href}
          onClick={() => {
            trackNavigation(item.href);
            onClose();
          }}
          onMouseEnter={() => prefetchRoute(item.href)}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--muted)]/50 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none"
        >
          <span className="text-[var(--foreground-muted)]">{item.icon}</span>
          <span className="text-[var(--foreground-secondary)]">{item.label}</span>
          <span className="ml-auto text-xs text-[var(--foreground-subtle)]">{item.category}</span>
        </Link>
      ))}
    </div>
  );
}
