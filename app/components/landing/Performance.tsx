'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  description: string;
  color: string;
}

const metrics: Metric[] = [
  {
    label: 'Faster than Excel',
    value: 80,
    suffix: '%',
    description: 'Calculate COGS and analyze menu performance in seconds, not hours',
    color: '#29E7CD',
  },
  {
    label: 'More Accurate Pricing',
    value: 3,
    suffix: 'x',
    description: 'AI-powered calculations eliminate human error in cost analysis',
    color: '#D925C7',
  },
  {
    label: 'Monitoring Uptime',
    value: 24,
    suffix: '/7',
    description: 'Real-time temperature and compliance monitoring around the clock',
    color: '#3B82F6',
  },
  {
    label: 'Queensland Compliant',
    value: 100,
    suffix: '%',
    description: 'Automatically applies QLD food safety standards to all equipment',
    color: '#29E7CD',
  },
];

const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  suffix,
  color,
}: {
  value: number;
  suffix: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newValue = Math.min(Math.round(stepValue * currentStep), value);
      setCount(newValue);

      if (currentStep >= steps) {
        clearInterval(interval);
        setCount(value);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isIntersecting, value]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold"
        style={{ color }}
      >
        {count}
        {suffix}
      </div>
    </div>
  );
});

function Performance() {
  return (
    <section className="tablet:py-20 relative bg-transparent py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold tracking-tight text-white">
            Performance
          </h2>
          <p className="text-fluid-xl mt-4 text-gray-400">Happily ever faster.</p>
        </div>

        {/* Metrics Grid */}
        <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid gap-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#1f1f1f]/50"
            >
              {/* Animated Counter */}
              <AnimatedCounter value={metric.value} suffix={metric.suffix} color={metric.color} />

              {/* Label */}
              <h3 className="text-fluid-xl mt-4 font-semibold text-white">{metric.label}</h3>

              {/* Description */}
              <p className="text-fluid-sm mt-2 text-gray-400">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Performance Comparison */}
        <div className="tablet:p-12 mt-16 rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-8">
          <div className="text-center">
            <h3 className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-white">
              Stop fighting with Excel at 2 AM
            </h3>
            <p className="text-fluid-lg mt-4 text-gray-400">
              PrepFlow calculates COGS, analyzes menu performance, and tracks compliance—all in one
              place. No more spreadsheets, no more guesswork, no more late-night formula errors.
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="desktop:grid-cols-2 mt-12 grid gap-8">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
              <h4 className="text-fluid-xl mb-4 font-semibold text-red-400">Before PrepFlow</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Manual Excel calculations</li>
                <li>• Hours of data entry</li>
                <li>• Error-prone formulas</li>
                <li>• No real-time updates</li>
                <li>• Compliance tracking in separate systems</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/10 p-6">
              <h4 className="text-fluid-xl mb-4 font-semibold text-[#29E7CD]">With PrepFlow</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Automatic COGS calculations</li>
                <li>• Real-time inventory tracking</li>
                <li>• AI-powered menu optimization</li>
                <li>• Live compliance monitoring</li>
                <li>• Everything in one platform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Performance);
