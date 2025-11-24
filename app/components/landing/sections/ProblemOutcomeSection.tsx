import { useTranslation } from '../../../../lib/useTranslation';
import { LANDING_TYPOGRAPHY, LANDING_LAYOUT, getSectionClasses } from '@/lib/landing-styles';

export function ProblemOutcomeSection() {
  const { t } = useTranslation();

  return (
    <section id="problem-outcome" className={getSectionClasses({ padding: 'medium' })}>
      <div className={`${LANDING_LAYOUT.container} desktop:grid-cols-2 grid gap-12`}>
        <div className="space-y-6">
          <h2 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
            {t('problem.title', 'The Problem')}
          </h2>
          <div className={`${LANDING_TYPOGRAPHY.lg} space-y-4 text-gray-300`}>
            <p>
              {t(
                'problem.point1',
                "You think you know your costs. You don't. Small changes add up to big losses.",
              )}
            </p>
            <p>
              {t(
                'problem.point2',
                "Without accurate COGS, you're pricing blind. Every dish is a guess.",
              )}
            </p>
            <p>{t('problem.point3', 'Excel at 2 AM. Broken formulas. Hours wasted.')}</p>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
            {t('outcome.title', 'The Solution')}
          </h2>
          <div className={`${LANDING_TYPOGRAPHY.lg} space-y-4 text-gray-300`}>
            <p>
              {t(
                'outcome.point1',
                'Know exactly what each dish costs. See profit margins in real-time.',
              )}
            </p>
            <p>{t('outcome.point2', 'Price with confidence. Hit your margins every time.')}</p>
            <p>
              {t(
                'outcome.point3',
                'Stop wasting hours on calculations. Focus on your food instead.',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
