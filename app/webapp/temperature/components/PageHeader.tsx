'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-lg">
          <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            {t('temperature.title', 'Temperature Monitoring')}
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
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
