'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 shadow-lg">
          <Icon icon={Thermometer} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div className="flex-1">
          <h1 className="tablet:text-4xl mb-2 text-3xl font-bold text-[var(--foreground)]">
            {t('temperature.title', 'Temperature Monitoring')}
          </h1>
          <p className="tablet:text-lg text-base text-[var(--foreground-muted)]">
            {t(
              'temperature.subtitle',
              'Track fridge, freezer, and food temperatures for food safety compliance',
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
