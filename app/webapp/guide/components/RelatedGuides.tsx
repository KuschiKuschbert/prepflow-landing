/**
 * Related guides component.
 * Shows contextual guide suggestions in the guide viewer.
 */

'use client';

import { getRelatedGuides } from '../data/guides';
import type { Guide } from '../data/guide-types';

interface RelatedGuidesProps {
  currentGuideId: string;
  onSelectGuide: (guide: Guide) => void;
}

export function RelatedGuides({ currentGuideId, onSelectGuide }: RelatedGuidesProps) {
  const related = getRelatedGuides(currentGuideId);
  if (related.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wider text-[var(--foreground-subtle)] uppercase">
        Related guides
      </h3>
      <ul className="space-y-2">
        {related.map(guide => (
          <li key={guide.id}>
            <button
              type="button"
              onClick={() => onSelectGuide(guide)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/50"
            >
              <span className="font-medium text-[var(--foreground)]">{guide.title}</span>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--foreground-muted)]">
                {guide.description}
              </p>
              <span className="mt-2 text-xs text-[var(--primary)]">Open guide →</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
