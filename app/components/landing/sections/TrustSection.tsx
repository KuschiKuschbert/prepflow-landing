'use client';

import { LANDING_LAYOUT, LANDING_TYPOGRAPHY, getSectionClasses } from '@/lib/landing-styles';
import { useTranslation } from '../../../../lib/useTranslation';

export function TrustSection() {
  const { t } = useTranslation();

  return (
    <section className={`border-t border-gray-700 ${getSectionClasses({ padding: 'small' })}`}>
      <div className={`${LANDING_LAYOUT.container} mb-8 text-center`}>
        <h3 className={`${LANDING_TYPOGRAPHY['2xl']} mb-4 font-bold tracking-tight`}>
          {t('trust.title', 'Built for Australian Restaurants')}
        </h3>
        <p className="text-gray-400">
          {t(
            'trust.subtitle',
            'Designed specifically for Australian restaurants, cafés, and food trucks with Queensland compliance standards.',
          )}
        </p>
      </div>
      <div className={`${LANDING_LAYOUT.container} desktop:grid-cols-3 grid gap-8`}>
        <div className="text-center">
          <div className={`${LANDING_TYPOGRAPHY['3xl']} mb-2 font-bold text-landing-primary`}>
            100%
          </div>
          <div className="text-gray-400">{t('trust.compliant', 'QLD Compliant')}</div>
        </div>
        <div className="text-center">
          <div className={`${LANDING_TYPOGRAPHY['3xl']} mb-2 font-bold text-landing-secondary`}>
            Manual
          </div>
          <div className="text-gray-400">{t('trust.monitoring', 'Temperature Logging')}</div>
        </div>
        <div className="text-center">
          <div className={`${LANDING_TYPOGRAPHY['3xl']} mb-2 font-bold text-landing-accent`}>
            Real-time
          </div>
          <div className="text-gray-400">{t('trust.calculations', 'COGS Calculations')}</div>
        </div>
      </div>
    </section>
  );
}
