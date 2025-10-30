'use client';

import React from 'react';
import TourModal from './TourModal';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';

export default function Tour() {
  const { trackEngagement } = useEngagementTracking();
  const [open, setOpen] = React.useState(false);
  const steps = React.useMemo(
    () => [
      {
        key: 'ingredients',
        title: 'Ingredients',
        description: 'Add your ingredients with costs and suppliers for accurate COGS.',
      },
      {
        key: 'recipes',
        title: 'Recipes',
        description: 'Build recipes and portions; PrepFlow calculates costs automatically.',
      },
      {
        key: 'cogs',
        title: 'COGS',
        description: 'See dish COGS and contribution margin instantly.',
      },
      {
        key: 'performance',
        title: 'Performance',
        description: 'Identify Chef’s Kiss, Hidden Gem, Bargain Bucket, and Burnt Toast.',
      },
      {
        key: 'temperature',
        title: 'Temperature',
        description: 'Stay compliant with Queensland standards and smart thresholds.',
      },
    ],
    [],
  );
  return (
    <section id="tour" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Take a quick tour</h2>
        <p className="mt-3 text-gray-300">
          See how PrepFlow helps you price with confidence in minutes.
        </p>
        <button
          className="mt-6 rounded-2xl border border-[#2a2a2a] px-6 py-3 font-semibold hover:bg-[#2a2a2a]/40"
          onClick={() => {
            trackEngagement('tour_open');
            setOpen(true);
          }}
        >
          Start tour
        </button>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-5">
        {steps.map(step => (
          <div
            key={step.key}
            className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4 text-left"
          >
            <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
            <p className="text-sm text-gray-300">{step.description}</p>
          </div>
        ))}
      </div>
      <TourModal
        isOpen={open}
        onClose={() => {
          trackEngagement('tour_close');
          setOpen(false);
        }}
        steps={steps}
      />
    </section>
  );
}
