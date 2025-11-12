'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
        <Thermometer className="h-8 w-8" />
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
