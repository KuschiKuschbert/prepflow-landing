import { useTranslation } from '../../../../lib/useTranslation';

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20">
      <h2 className="text-fluid-3xl desktop:text-fluid-4xl mb-12 text-center font-bold tracking-tight">
        {t('howItWorks.title', 'How PrepFlow Works')}
      </h2>
      <div className="desktop:grid-cols-3 grid gap-8">
        <div className="text-center">
          <div className="text-fluid-2xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#29E7CD]/20 font-bold text-[#29E7CD]">
            1
          </div>
          <h3 className="text-fluid-xl mb-3 font-semibold">
            {t('howItWorks.step1.title', 'Add Your Ingredients')}
          </h3>
          <p className="text-gray-300">
            {t(
              'howItWorks.step1.description',
              'Input your ingredient costs, suppliers, and storage information.',
            )}
          </p>
        </div>
        <div className="text-center">
          <div className="text-fluid-2xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20 font-bold text-[#3B82F6]">
            2
          </div>
          <h3 className="text-fluid-xl mb-3 font-semibold">
            {t('howItWorks.step2.title', 'Create Your Recipes')}
          </h3>
          <p className="text-gray-300">
            {t(
              'howItWorks.step2.description',
              'Build recipes with ingredients and quantities. PrepFlow calculates costs automatically.',
            )}
          </p>
        </div>
        <div className="text-center">
          <div className="text-fluid-2xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D925C7]/20 font-bold text-[#D925C7]">
            3
          </div>
          <h3 className="text-fluid-xl mb-3 font-semibold">
            {t('howItWorks.step3.title', 'Optimize Your Pricing')}
          </h3>
          <p className="text-gray-300">
            {t(
              'howItWorks.step3.description',
              'Set target margins and get optimal pricing recommendations.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
