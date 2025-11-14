import OptimizedImage from '../../../../components/OptimizedImage';
import { useTranslation } from '../../../../lib/useTranslation';

export function MyStorySection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-gray-700 py-20">
      <div className="mb-16 text-center">
        <h2 className="mb-6 text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">
          {t('story.title', 'My Story: From Frustration to Solution')}
        </h2>
        <p className="mx-auto max-w-3xl text-fluid-lg text-gray-300">
          {t('story.subtitle', "I've been where you are. Here's how PrepFlow came to be.")}
        </p>
      </div>
      <div className="grid gap-12 desktop:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
            <h3 className="mb-3 text-fluid-xl font-semibold text-[#29E7CD]">
              {t('story.frustration.title', 'The Frustration')}
            </h3>
            <p className="text-gray-300">
              {t(
                'story.frustration.description',
                'Running a restaurant, I was constantly guessing at costs. Spreadsheets were messy, calculations were wrong, and I was losing money without knowing it.',
              )}
            </p>
          </div>
          <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
            <h3 className="mb-3 text-fluid-xl font-semibold text-[#D925C7]">
              {t('story.solution.title', 'The Solution')}
            </h3>
            <p className="text-gray-300">
              {t(
                'story.solution.description',
                "I built PrepFlow to solve these exact problems. It's the tool I wish I had when I was struggling with manual calculations and hidden costs.",
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <OptimizedImage
            src="/images/chef-working.jpg"
            alt="Chef working in kitchen"
            width={500}
            height={400}
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
