'use client';

import { useTranslation } from '@/lib/useTranslation';

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-4xl font-bold text-white">
        🌡️ {t('temperature.title', 'Temperature Logs')}
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
