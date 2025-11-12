'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
        <Icon icon={Thermometer} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
        {t('temperature.title', 'Temperature Logs')}
      </h1>
      <p className="text-gray-400">
        {t(
          'temperature.subtitle',
          'Track fridge, freezer, and food temperatures for food safety compliance',
        )}
      </p>
    </div>
  );
}
