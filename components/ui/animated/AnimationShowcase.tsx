/**
 * Demo Component showcasing all animations
 */

'use client';

import React from 'react';
import { AnimatedDiv, StaggeredContainer } from '../../../lib/animation-stubs';
import { AnimatedCard } from './AnimatedCard';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { AnimatedToast } from './AnimatedToast';

export function AnimationShowcase() {
  const [showToast, setShowToast] = React.useState(false);

  const handleCardClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <AnimatedDiv animation="fadeInDown" className="text-center">
        <h1 className="text-fluid-4xl mb-4 font-bold text-white">🎨 Modern Animation System</h1>
        <p className="text-fluid-lg text-gray-400">
          Subtle, performant animations that enhance user experience
        </p>
      </AnimatedDiv>

      {/* Staggered Cards */}
      <StaggeredContainer className="desktop:grid-cols-2 large-desktop:grid-cols-3 grid grid-cols-1 gap-6">
        <AnimatedCard
          title="Performance Optimized"
          description="All animations use CSS transforms and opacity for 60fps performance"
          icon={<span className="text-fluid-xl text-white">⚡</span>}
          onClick={handleCardClick}
        />
        <AnimatedCard
          title="Accessibility First"
          description="Respects prefers-reduced-motion and includes proper ARIA labels"
          icon={<span className="text-fluid-xl text-white">♿</span>}
          onClick={handleCardClick}
        />
        <AnimatedCard
          title="Modern Design"
          description="Subtle effects that enhance UX without being distracting"
          icon={<span className="text-fluid-xl text-white">✨</span>}
          onClick={handleCardClick}
        />
      </StaggeredContainer>

      {/* Interactive Elements */}
      <div className="flex flex-wrap justify-center gap-4">
        <AnimatedButton variant="primary" onClick={handleCardClick}>
          Primary Action
        </AnimatedButton>
        <AnimatedButton variant="secondary" onClick={handleCardClick}>
          Secondary Action
        </AnimatedButton>
        <AnimatedButton variant="outline" onClick={handleCardClick}>
          Outline Action
        </AnimatedButton>
        <AnimatedButton loading onClick={handleCardClick}>
          Loading State
        </AnimatedButton>
      </div>

      {/* Progress Demo */}
      <div className="mx-auto max-w-md space-y-4">
        <AnimatedProgressBar progress={75} label="Loading Progress" />
        <AnimatedProgressBar progress={45} label="Upload Status" />
      </div>

      {/* Toast Notification */}
      <AnimatedToast
        message="Animation system activated successfully! 🎉"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
