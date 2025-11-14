import { useTranslation } from '../../../../lib/useTranslation';

export function FAQSection() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="py-20">
      <h3 className="mb-12 text-center text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
        {t('faq.title', 'Frequently Asked Questions')}
      </h3>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h4 className="mb-3 text-fluid-lg font-semibold text-[#29E7CD]">
            {t('faq.question1', 'How accurate are the COGS calculations?')}
          </h4>
          <p className="text-gray-300">
            {t(
              'faq.answer1',
              'PrepFlow uses industry-standard formulas and accounts for waste factors, yield adjustments, and supplier variations to provide highly accurate cost calculations.',
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
          <h4 className="mb-3 text-fluid-lg font-semibold text-[#3B82F6]">
            {t('faq.question2', 'Can I import my existing data?')}
          </h4>
          <p className="text-gray-300">
            {t(
              'faq.answer2',
              'Yes, PrepFlow supports CSV import for ingredients, recipes, and supplier data to help you migrate from existing systems.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
