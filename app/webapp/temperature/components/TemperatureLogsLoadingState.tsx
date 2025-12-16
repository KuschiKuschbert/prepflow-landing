'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';

export function TemperatureLogsLoadingState() {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
        <Icon
          icon={Thermometer}
          size="xl"
          className="animate-pulse text-[var(--primary)]"
          aria-hidden={true}
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
        {t('temperature.loading', 'Loading temperature logs...')}
      </h3>
      <p className="text-[var(--foreground-muted)]">
        {t('temperature.loadingDesc', 'Please wait while we fetch your temperature data')}
      </p>
    </div>
  );
}
