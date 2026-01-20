'use client';

import { Icon } from '@/components/ui/Icon';
import { Bot } from 'lucide-react';

interface AiSpecialsHeaderProps {
  title: string;
  subtitle: string;
  showRecipeScraper: boolean;
  onToggleScraper: () => void;
}

export function AiSpecialsHeader({
  title,
  subtitle,
  showRecipeScraper,
  onToggleScraper,
}: AiSpecialsHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-[var(--foreground)]">
          <Icon icon={Bot} size="lg" aria-hidden={true} />
          {title}
        </h1>
        <p className="text-[var(--foreground-muted)]">{subtitle}</p>
      </div>
      <button
        onClick={onToggleScraper}
        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
      >
        {showRecipeScraper ? 'Hide' : 'Show'} Recipe Database
      </button>
    </div>
  );
}
