import { useTranslation } from '../../../../lib/useTranslation';

export function ProblemOutcomeSection() {
  const { t } = useTranslation();

  return (
    <section id="problem-outcome" className="py-20">
      <div className="grid gap-12 desktop:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
            {t('problem.title', 'The Problem: Hidden Profit Killers')}
          </h2>
          <div className="space-y-4 text-fluid-lg text-gray-300">
            <p>
              {t(
                'problem.point1',
                'You think you know your costs, but small changes add up to big losses.',
              )}
            </p>
            <p>
              {t(
                'problem.point2',
                "Without accurate COGS, you're pricing blind and losing money on every dish.",
              )}
            </p>
            <p>{t('problem.point3', 'Manual calculations are error-prone and time-consuming.')}</p>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
            {t('outcome.title', 'The Outcome: Profit Maximization')}
          </h2>
          <div className="space-y-4 text-fluid-lg text-gray-300">
            <p>
              {t(
                'outcome.point1',
                "Know exactly what each dish costs and how much profit you're making.",
              )}
            </p>
            <p>
              {t(
                'outcome.point2',
                'Price confidently with data-driven decisions that maximize margins.',
              )}
            </p>
            <p>
              {t(
                'outcome.point3',
                'Save hours every week with automated calculations and insights.',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
