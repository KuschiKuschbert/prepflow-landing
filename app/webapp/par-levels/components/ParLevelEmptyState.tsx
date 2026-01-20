'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { Package2 } from 'lucide-react';

interface ParLevelEmptyStateProps {
  onAdd: () => void;
}

export function ParLevelEmptyState({ onAdd }: ParLevelEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
        <Icon icon={Package2} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
        {t('parLevels.noParLevels', 'No Par Levels Set')}
      </h3>
      <p className="mb-6 text-[var(--foreground-muted)]">
        {t('parLevels.noParLevelsDesc', 'Set par levels to automate your inventory management')}
      </p>
      <button
        onClick={onAdd}
        className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
      >
        {t('parLevels.addFirstParLevel', 'Add Your First Par Level')}
      </button>
    </div>
  );
}
