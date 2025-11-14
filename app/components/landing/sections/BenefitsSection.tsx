import { useTranslation } from '../../../../lib/useTranslation';

export function BenefitsSection() {
  const { t } = useTranslation();

  return (
    <section id="benefits" className="py-20">
      <h3 className="mb-12 text-center text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
        {t('benefits.title', 'What PrepFlow Helps You Achieve')}
      </h3>
      <div className="grid gap-8 desktop:grid-cols-2 large-desktop:grid-cols-3">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h4 className="mb-3 text-fluid-lg font-semibold text-[#29E7CD]">
            {t('benefits.profit.title', 'Increase Profit Margins')}
          </h4>
          <p className="text-gray-300">
            {t(
              'benefits.profit.description',
              'Identify and eliminate profit leaks with accurate cost calculations.',
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h4 className="mb-3 text-fluid-lg font-semibold text-[#3B82F6]">
            {t('benefits.time.title', 'Save Time')}
          </h4>
          <p className="text-gray-300">
            {t(
              'benefits.time.description',
              'Automate calculations and reduce manual work by hours every week.',
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h4 className="mb-3 text-fluid-lg font-semibold text-[#D925C7]">
            {t('benefits.confidence.title', 'Price with Confidence')}
          </h4>
          <p className="text-gray-300">
            {t(
              'benefits.confidence.description',
              'Make data-driven pricing decisions that maximize profitability.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
