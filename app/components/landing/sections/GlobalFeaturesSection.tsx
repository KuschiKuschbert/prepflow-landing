import { useTranslation } from '../../../../lib/useTranslation';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { TextContainer } from '@/components/ui/TextContainer';
import {
  LANDING_COLORS,
  LANDING_COLORS_RGBA,
  LANDING_TYPOGRAPHY,
  LANDING_LAYOUT,
  getSectionClasses,
  getStaggerDelay,
} from '@/lib/landing-styles';

export function GlobalFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="global-features" className={getSectionClasses({ padding: 'medium' })}>
      <div className={LANDING_LAYOUT.container}>
        <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <ScrollReveal variant="fade-up">
              <h2
                className={`${LANDING_TYPOGRAPHY['3xl']} desktop:${LANDING_TYPOGRAPHY['4xl']} mb-6 font-bold tracking-tight text-white`}
              >
                {t('globalFeatures.title', 'Built for Australian Restaurants')}
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.1}>
              <TextContainer variant="wide">
                <p className={`${LANDING_TYPOGRAPHY.lg} text-gray-300`}>
                  {t(
                    'globalFeatures.description',
                    'QLD compliance built-in. GST calculations. Metric or imperial units. Made for Aussie restaurants, cafés, and food trucks.',
                  )}
                </p>
              </TextContainer>
            </ScrollReveal>
            <div className="mt-8 grid gap-6 tablet:gap-8 desktop:gap-10 large-desktop:gap-12 xl:gap-14 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              <ScrollReveal variant="fade-up" delay={getStaggerDelay(0, 0.2)}>
                <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                  <h3
                    className={`${LANDING_TYPOGRAPHY.lg} mb-3 font-semibold`}
                    style={{ color: LANDING_COLORS.secondary }}
                  >
                    {t('globalFeatures.units.title', 'Unit Systems')}
                  </h3>
                  <p className={`${LANDING_TYPOGRAPHY.sm} text-gray-300`}>
                    {t(
                      'globalFeatures.units.description',
                      'Use what you know. We convert automatically.',
                    )}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={getStaggerDelay(1, 0.2)}>
                <div className="rounded-2xl bg-[#1f1f1f]/50 p-6">
                  <h3
                    className={`${LANDING_TYPOGRAPHY.lg} mb-3 font-semibold`}
                    style={{ color: LANDING_COLORS.accent }}
                  >
                    {t('globalFeatures.localization.title', 'Localization')}
                  </h3>
                  <p className={`${LANDING_TYPOGRAPHY.sm} text-gray-300`}>
                    {t(
                      'globalFeatures.localization.description',
                      'QLD food safety standards. GST included.',
                    )}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
