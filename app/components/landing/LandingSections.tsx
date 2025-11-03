/**
 * Landing page sections component
 */

import React from 'react';
import { ProblemOutcomeSection } from './sections/ProblemOutcomeSection';
import { ContributingMarginSection } from './sections/ContributingMarginSection';
import { MyStorySection } from './sections/MyStorySection';
import { FeaturesSection } from './sections/FeaturesSection';
import { GlobalFeaturesSection } from './sections/GlobalFeaturesSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { LeadMagnetSection } from './sections/LeadMagnetSection';
import { PracticeSection } from './sections/PracticeSection';
import { BenefitsSection } from './sections/BenefitsSection';
import { FAQSection } from './sections/FAQSection';
import { TrustSection } from './sections/TrustSection';

interface LandingSectionsProps {
  renderHero: () => React.ReactNode;
  renderPricing: () => React.ReactNode;
}

const LandingSections = React.memo(function LandingSections({
  renderHero,
  renderPricing,
}: LandingSectionsProps) {
  return (
    <>
      {/* Hero Section - A/B Testing Variants with Lazy Loading */}
      {renderHero()}

      <ProblemOutcomeSection />
      <ContributingMarginSection />
      <MyStorySection />
      <FeaturesSection />
      <GlobalFeaturesSection />
      <HowItWorksSection />
      <LeadMagnetSection />

      {/* Pricing Section - A/B Testing Variants with Lazy Loading */}
      {renderPricing()}

      <PracticeSection />
      <BenefitsSection />
      <FAQSection />
      <TrustSection />
    </>
  );
});

export default LandingSections;
