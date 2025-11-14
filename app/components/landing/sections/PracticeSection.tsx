import { useTranslation } from '../../../../lib/useTranslation';

export function PracticeSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works-practice" className="py-20">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mb-6 text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
            {t('practice.title', 'How PrepFlow Works in Practice')}
          </h2>
          <p className="mx-auto max-w-3xl text-fluid-lg text-gray-300">
            {t(
              'practice.description',
              'See how real restaurants use PrepFlow to increase their profit margins and streamline their operations.',
            )}
          </p>
          <div className="mt-8 grid gap-6 desktop:grid-cols-2">
            <div className="rounded-2xl bg-[#2a2a2a]/50 p-6">
              <h3 className="mb-3 text-fluid-xl font-semibold text-[#29E7CD]">
                {t('practice.before.title', 'Before PrepFlow')}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• {t('practice.before.point1', 'Manual calculations prone to errors')}</li>
                <li>• {t('practice.before.point2', 'Time-consuming spreadsheet management')}</li>
                <li>• {t('practice.before.point3', 'Unclear profit margins')}</li>
                <li>• {t('practice.before.point4', 'Difficulty tracking ingredient costs')}</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-[#2a2a2a]/50 p-6">
              <h3 className="mb-3 text-fluid-xl font-semibold text-[#D925C7]">
                {t('practice.after.title', 'After PrepFlow')}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• {t('practice.after.point1', 'Automated, accurate calculations')}</li>
                <li>• {t('practice.after.point2', 'Streamlined workflow management')}</li>
                <li>• {t('practice.after.point3', 'Clear profit margin insights')}</li>
                <li>• {t('practice.after.point4', 'Real-time cost tracking')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
