'use client';

/**
 * Empty state component for prep lists page.
 */

import { ListChecks } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';

interface PrepListsEmptyStateProps {
  onCreateClick: () => void;
}

export function PrepListsEmptyState({ onCreateClick }: PrepListsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
        <Icon icon={ListChecks} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
        {t('prepLists.noPrepLists', 'No Prep Lists')}
      </h3>
      <p className="mb-6 text-[var(--foreground-muted)]">
        {t(
          'prepLists.noPrepListsDesc',
          'Create your first prep list to organize kitchen preparation',
        )}
      </p>
      <button
        onClick={onCreateClick}
        className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
      >
        {t('prepLists.createFirstPrepList', 'Create Your First Prep List')}
      </button>
    </div>
  );
}
