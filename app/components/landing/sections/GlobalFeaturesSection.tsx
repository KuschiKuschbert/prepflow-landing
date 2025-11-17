import { useTranslation } from '../../../../lib/useTranslation';

export function GlobalFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="global-features" className="py-20">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-fluid-3xl desktop:text-fluid-4xl mb-6 font-bold tracking-tight">
            {t('globalFeatures.title', 'Built for Global Restaurants')}
          </h2>
          <p className="text-fluid-lg mx-auto max-w-3xl text-gray-300">
            {t(
              'globalFeatures.description',
              'PrepFlow works for restaurants worldwide with support for multiple currencies, measurement systems, and local regulations.',
            )}
          </p>
          <div className="desktop:grid-cols-4 mt-8 grid gap-6">
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="text-fluid-lg mb-3 font-semibold text-[#29E7CD]">
                {t('globalFeatures.currency.title', 'Multi-Currency')}
              </h3>
              <p className="text-fluid-sm text-gray-300">
                {t('globalFeatures.currency.description', 'AUD, USD, EUR, GBP support')}
              </p>
            </div>
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="text-fluid-lg mb-3 font-semibold text-[#3B82F6]">
                {t('globalFeatures.units.title', 'Unit Systems')}
              </h3>
              <p className="text-fluid-sm text-gray-300">
                {t('globalFeatures.units.description', 'Metric & Imperial units')}
              </p>
            </div>
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="text-fluid-lg mb-3 font-semibold text-[#D925C7]">
                {t('globalFeatures.localization.title', 'Localization')}
              </h3>
              <p className="text-fluid-sm text-gray-300">
                {t('globalFeatures.localization.description', 'Local regulations & standards')}
              </p>
            </div>
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="text-fluid-lg mb-3 font-semibold text-[#29E7CD]">
                {t('globalFeatures.support.title', '24/7 Support')}
              </h3>
              <p className="text-fluid-sm text-gray-300">
                {t('globalFeatures.support.description', 'Global customer support')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
