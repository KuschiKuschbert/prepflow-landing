import { useTranslation } from '../../../../lib/useTranslation';

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-20">
      <div className="grid gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-3 text-fluid-xl font-semibold text-[#29E7CD]">
            {t('features.cogs.title', 'Accurate COGS Calculation')}
          </h3>
          <p className="text-gray-300">
            {t(
              'features.cogs.description',
              'Calculate exact cost of goods sold for every dish with ingredient costs, waste factors, and yield adjustments.',
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-3 text-fluid-xl font-semibold text-[#3B82F6]">
            {t('features.pricing.title', 'Smart Pricing Tool')}
          </h3>
          <p className="text-gray-300">
            {t(
              'features.pricing.description',
              'Set optimal prices based on target profit margins and market positioning.',
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h3 className="mb-3 text-fluid-xl font-semibold text-[#D925C7]">
            {t('features.insights.title', 'Profit Insights')}
          </h3>
          <p className="text-gray-300">
            {t(
              'features.insights.description',
              'Get actionable insights on which dishes are profit stars and which need attention.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
