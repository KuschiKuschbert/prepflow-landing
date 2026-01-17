'use client';

import { Icon } from '@/components/ui/Icon';
import { BarChart3, ChefHat, Clock } from 'lucide-react';

export default function Comparison() {
  const comparisons = [
    {
      title: 'vs Spreadsheets',
      benefit: 'No formula errors, automatic updates',
      description:
        'Stop fighting with Excel at 2 AM. PrepFlow calculates everything automatically and updates in real-time.',
      colorClass: 'text-landing-primary',
      icon: BarChart3,
    },
    {
      title: 'vs Manual Methods',
      benefit: 'Save hours every week',
      description: 'From hours of calculations to minutes. Focus on cooking, not spreadsheets.',
      colorClass: 'text-landing-secondary',
      icon: Clock,
    },
    {
      title: 'vs Generic Tools',
      benefit: 'Built for kitchens, not offices',
      description:
        'Designed specifically for restaurant workflows. QLD-compliant temperature monitoring, kitchen-focused features.',
      colorClass: 'text-landing-accent',
      icon: ChefHat,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-fluid-3xl desktop:text-fluid-4xl font-bold tracking-tight">
          Why PrepFlow?
        </h2>
        <p className="text-fluid-lg mt-4 text-gray-300">Built for kitchens, not spreadsheets</p>
      </div>

      <div className="desktop:grid-cols-3 mt-12 grid gap-6">
        {comparisons.map(comparison => (
          <div
            key={comparison.title}
            className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6 transition-all hover:border-[#2a2a2a]/60 hover:bg-[#1f1f1f]/70"
          >
            <div className="mb-4">
              <Icon
                icon={comparison.icon}
                size="xl"
                className={comparison.colorClass}
                aria-hidden={true}
              />
            </div>
            <h3 className={`text-fluid-xl mb-2 font-semibold ${comparison.colorClass}`}>
              {comparison.title}
            </h3>
            <p className="mb-3 font-medium text-white">{comparison.benefit}</p>
            <p className="text-fluid-sm text-gray-400">{comparison.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
