import { useTranslation } from '../../../../lib/useTranslation';

export function ContributingMarginSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20" id="contributing-margin">
      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mb-6 text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
            {t('contributingMargin.title', 'Contributing Margin: Your Profit Engine')}
          </h2>
          <p className="mx-auto max-w-3xl text-fluid-lg text-gray-300">
            {t(
              'contributingMargin.description',
              "Contributing margin is the profit each dish contributes after covering its direct costs. It's the key metric that tells you which dishes are profit stars and which are profit drains.",
            )}
          </p>
          <div className="mt-8 grid gap-6 desktop:grid-cols-3">
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="mb-3 text-fluid-xl font-semibold text-[#29E7CD]">
                {t('contributingMargin.benefit1.title', 'Direct Cost Coverage')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'contributingMargin.benefit1.description',
                  'Covers ingredient costs, labor, and direct overhead for each dish.',
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="mb-3 text-fluid-xl font-semibold text-[#29E7CD]">
                {t('contributingMargin.benefit2.title', 'Profit Contribution')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'contributingMargin.benefit2.description',
                  'Shows how much each dish contributes to overall profitability.',
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
              <h3 className="mb-3 text-fluid-xl font-semibold text-[#29E7CD]">
                {t('contributingMargin.benefit3.title', 'Menu Optimization')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'contributingMargin.benefit3.description',
                  'Helps you optimize your menu for maximum profit potential.',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
