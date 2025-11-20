'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';

export function TemperatureLogsLoadingState() {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
        <Icon
          icon={Thermometer}
          size="xl"
          className="animate-pulse text-[#29E7CD]"
          aria-hidden={true}
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        {t('temperature.loading', 'Loading temperature logs...')}
      </h3>
      <p className="text-gray-400">
        {t('temperature.loadingDesc', 'Please wait while we fetch your temperature data')}
      </p>
    </div>
  );
}
