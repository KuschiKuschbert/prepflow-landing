'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';
import { PageHeader as StaticPageHeader } from '@/app/webapp/components/static/PageHeader';

export function PageHeader() {
  const { t } = useTranslation();

  return (
    <StaticPageHeader
      title={t('temperature.title', 'Temperature Monitoring')}
      subtitle={t(
        'temperature.subtitle',
        'Track fridge, freezer, and food temperatures for food safety compliance',
      )}
      icon={Thermometer}
    />
  );
}
