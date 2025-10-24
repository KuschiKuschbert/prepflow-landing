/**
 * Animation Test Page - Local Testing Component
 * Visit /animation-test to see all animations in action
 */

'use client';

import React from 'react';
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedSkeleton,
  AnimatedProgressBar,
  AnimatedToast,
  AnimationShowcase,
} from '@/components/ui/AnimatedComponents';

export default function AnimationTestPage() {
  const [showToast, setShowToast] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          🎨 PrepFlow Animation System Test
        </h1>

        {/* Animation Showcase */}
        <AnimationShowcase />

        {/* Additional Test Components */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard
            title="Performance Test"
            description="Testing intersection observer animations"
            icon={<span className="text-xl text-white">⚡</span>}
            delay={0}
          />
          <AnimatedCard
            title="Accessibility Test"
            description="Testing reduced motion support"
            icon={<span className="text-xl text-white">♿</span>}
            delay={100}
          />
          <AnimatedCard
            title="Design Test"
            description="Testing Material Design 3 compliance"
            icon={<span className="text-xl text-white">✨</span>}
            delay={200}
          />
        </div>

        {/* Button Tests */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <AnimatedButton variant="primary" onClick={() => setShowToast(true)}>
            Show Toast
          </AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => setShowToast(true)}>
            Secondary Action
          </AnimatedButton>
          <AnimatedButton variant="outline" onClick={() => setShowToast(true)}>
            Outline Button
          </AnimatedButton>
        </div>

        {/* Progress Bar Tests */}
        <div className="mx-auto mt-12 max-w-md space-y-4">
          <AnimatedProgressBar progress={75} label="Loading Progress" />
          <AnimatedProgressBar progress={45} label="Upload Status" />
          <AnimatedProgressBar progress={90} label="Build Progress" />
        </div>

        {/* Skeleton Tests */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <AnimatedSkeleton variant="card" />
          <AnimatedSkeleton variant="text" />
          <AnimatedSkeleton variant="circle" />
        </div>

        {/* Toast Notification */}
        <AnimatedToast
          message="Animation system is working perfectly! 🎉"
          type="success"
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}
