import { useTranslation } from '../../../../lib/useTranslation';
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  LANDING_LAYOUT,
  getSectionClasses,
} from '@/lib/landing-styles';

export function FAQSection() {
  const { t } = useTranslation();

  return (
    <section id="faq" className={getSectionClasses({ padding: 'medium' })}>
      <h3 className="text-fluid-3xl desktop:text-fluid-4xl mb-12 text-center font-bold tracking-tight">
        {t('faq.title', 'Frequently Asked Questions')}
      </h3>
      <div className={`${LANDING_LAYOUT.containerNarrow} space-y-6`}>
        <div
          className={`rounded-2xl border border-[${LANDING_COLORS.border}] bg-[${LANDING_COLORS.muted}]/50 p-6`}
        >
          <h4 className={`${LANDING_TYPOGRAPHY.lg} mb-3 font-semibold text-[#29E7CD]`}>
            {/* LANDING_COLORS.primary */}
            {t('faq.question1', 'How accurate are the COGS calculations?')}
          </h4>
          <p className="text-gray-300">
            {t(
              'faq.answer1',
              'Industry-standard formulas with waste factors, yield adjustments, and supplier variations. Updates live as you build—no manual recalculations needed.',
            )}
          </p>
        </div>
        <div
          className={`rounded-2xl border border-[${LANDING_COLORS.border}] bg-[${LANDING_COLORS.muted}]/50 p-6`}
        >
          <h4 className={`${LANDING_TYPOGRAPHY.lg} mb-3 font-semibold text-[#3B82F6]`}>
            {/* LANDING_COLORS.secondary */}
            {t('faq.question2', 'Can I import my existing data?')}
          </h4>
          <p className="text-gray-300">
            {t(
              'faq.answer2',
              'Yes. Import ingredients, recipes, and suppliers via CSV. We handle unit conversions and data cleanup automatically.',
            )}
          </p>
        </div>
        <div
          className={`rounded-2xl border border-[${LANDING_COLORS.border}] bg-[${LANDING_COLORS.muted}]/50 p-6`}
        >
          <h4 className={`${LANDING_TYPOGRAPHY.lg} mb-3 font-semibold text-[#D925C7]`}>
            {/* LANDING_COLORS.accent */}
            {t('faq.question3', 'Does it work offline?')}
          </h4>
          <p className="text-gray-300">
            {t(
              'faq.answer3',
              'PrepFlow is a web-based application that requires an internet connection. Your data is securely stored in the cloud and accessible from any device.',
            )}
          </p>
        </div>
        <div
          className={`rounded-2xl border border-[${LANDING_COLORS.border}] bg-[${LANDING_COLORS.muted}]/50 p-6`}
        >
          <h4 className={`${LANDING_TYPOGRAPHY.lg} mb-3 font-semibold text-[#29E7CD]`}>
            {/* LANDING_COLORS.primary */}
            {t('faq.question4', 'Is my data secure?')}
          </h4>
          <p className="text-gray-300">
            {t(
              'faq.answer4',
              'Yes. Encrypted storage, Auth0 authentication, regular backups. Your data stays private and secure.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
