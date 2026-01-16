'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { TextContainer } from '@/components/ui/TextContainer';
import {
    LANDING_LAYOUT,
    LANDING_TYPOGRAPHY,
    getSectionClasses,
} from '@/lib/landing-styles';
import OptimizedImage from '../../../../components/OptimizedImage';
import { useTranslation } from '../../../../lib/useTranslation';

export function MyStorySection() {
  const { t } = useTranslation();

  return (
    <section className={getSectionClasses({ padding: 'medium', border: true })}>
      <div className={LANDING_LAYOUT.container}>
        <ScrollReveal variant="fade-up" className="mb-16 text-center">
          <h2
            className={`${LANDING_TYPOGRAPHY['3xl']} desktop:${LANDING_TYPOGRAPHY['4xl']} mb-6 font-bold tracking-tight text-white`}
          >
            {t('story.title', 'Built by Someone Who Gets It')}
          </h2>
          <TextContainer variant="wide">
            <p className={`${LANDING_TYPOGRAPHY.lg} text-gray-300`}>
              {t('story.subtitle', "I've been where you are. This is the tool I wish I had.")}
            </p>
          </TextContainer>
        </ScrollReveal>
        <div className="desktop:grid-cols-2 tablet:gap-10 desktop:gap-12 large-desktop:gap-14 grid gap-12 xl:gap-16">
          <TextContainer variant="prose" className="space-y-6">
            <ScrollReveal variant="fade-up" delay={0.1}>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className={`${LANDING_TYPOGRAPHY.xl} mb-3 font-semibold text-landing-primary`}>
                  {t('story.frustration.title', 'The Frustration')}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'story.frustration.description',
                    "I was guessing at costs. Excel formulas broke. I lost money and didn't know why. Sound familiar?",
                  )}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.2}>
              <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                <h3 className={`${LANDING_TYPOGRAPHY.xl} mb-3 font-semibold text-landing-accent`}>
                  {t('story.solution.title', 'The Solution')}
                </h3>
                <p className="text-gray-300">
                  {t(
                    'story.solution.description',
                    'So I built PrepFlow. Real costs. Live calculations. No guesswork. The tool I wish I had when I was losing money.',
                  )}
                </p>
              </div>
            </ScrollReveal>
          </TextContainer>
          <ScrollReveal variant="fade-up" delay={0.3}>
            <div className="flex items-center justify-center">
              <OptimizedImage
                src="/images/chef-working.jpg"
                alt="Chef working in kitchen"
                width={500}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
