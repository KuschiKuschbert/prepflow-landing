import { useTranslation } from '../../../../lib/useTranslation';
import { LANDING_TYPOGRAPHY, LANDING_LAYOUT, getSectionClasses } from '@/lib/landing-styles';

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
          <div className={`${LANDING_TYPOGRAPHY['3xl']} mb-2 font-bold text-[#29E7CD]`}>
            {/* LANDING_COLORS.primary */}
            100%
          </div>
          <div className="text-gray-400">{t('trust.compliant', 'QLD Compliant')}</div>
        </div>
        <div className="text-center">
          <div className={`${LANDING_TYPOGRAPHY['3xl']} mb-2 font-bold text-[#3B82F6]`}>
            {/* LANDING_COLORS.secondary */}
            Manual
          </div>
          <div className="text-gray-400">{t('trust.monitoring', 'Temperature Logging')}</div>
        </div>
        <div className="text-center">
          <div className={`${LANDING_TYPOGRAPHY['3xl']} mb-2 font-bold text-[#D925C7]`}>
            {/* LANDING_COLORS.accent */}
            Real-time
          </div>
          <div className="text-gray-400">{t('trust.calculations', 'COGS Calculations')}</div>
        </div>
      </div>
    </section>
  );
}
