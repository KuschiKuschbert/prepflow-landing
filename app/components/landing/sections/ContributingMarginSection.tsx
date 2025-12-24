'use client';

import { useTranslation } from '../../../../lib/useTranslation';
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  LANDING_LAYOUT,
  getSectionClasses,
} from '@/lib/landing-styles';

export function ContributingMarginSection() {
  const { t } = useTranslation();

  return (
    <section id="contributing-margin" className={getSectionClasses({ padding: 'medium' })}>
      <div
        className={`${LANDING_LAYOUT.container} rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm`}
      >
        {/* LANDING_COLORS.primary and LANDING_COLORS.accent */}
        <div className="text-center">
          <h2 className="text-fluid-3xl desktop:text-fluid-4xl mb-6 font-bold tracking-tight">
            {t('contributingMargin.title', 'Know Your Profit Stars')}
          </h2>
          <p className={`${LANDING_TYPOGRAPHY.lg} mx-auto max-w-3xl text-gray-300`}>
            {t(
              'contributingMargin.description',
              "Contributing margin shows which dishes make you money after covering their costs. It's how you spot profit stars and profit drains.",
            )}
          </p>
          <div className="desktop:grid-cols-3 mt-8 grid gap-6">
            <div className={`rounded-2xl bg-[${LANDING_COLORS.muted}]/50 p-6`}>
              <h3 className={`${LANDING_TYPOGRAPHY.xl} mb-3 font-semibold text-[#29E7CD]`}>
                {/* LANDING_COLORS.primary */}
                {t('contributingMargin.benefit1.title', 'Real Costs')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'contributingMargin.benefit1.description',
                  'Ingredients, labor, overhead—everything that goes into each dish.',
                )}
              </p>
            </div>
            <div className={`rounded-2xl bg-[${LANDING_COLORS.muted}]/50 p-6`}>
              <h3 className={`${LANDING_TYPOGRAPHY.xl} mb-3 font-semibold text-[#29E7CD]`}>
                {/* LANDING_COLORS.primary */}
                {t('contributingMargin.benefit2.title', 'Profit Impact')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'contributingMargin.benefit2.description',
                  'See which dishes drive profit and which drain it.',
                )}
              </p>
            </div>
            <div className={`rounded-2xl bg-[${LANDING_COLORS.muted}]/50 p-6`}>
              <h3 className={`${LANDING_TYPOGRAPHY.xl} mb-3 font-semibold text-[#29E7CD]`}>
                {/* LANDING_COLORS.primary */}
                {t('contributingMargin.benefit3.title', 'Smart Decisions')}
              </h3>
              <p className="text-gray-300">
                {t(
                  'contributingMargin.benefit3.description',
                  'Feature the winners, fix the losers, remove the drains.',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
