'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import React, { useEffect, useState } from 'react';

interface Metric {
  label: string;
  value?: number;
  suffix?: string;
  displayText?: string;
  description: string;
  colorClass: string;
}

const metrics: Metric[] = [
  {
    label: 'Lightning Fast',
    displayText: 'Seconds',
    description: 'From hours of Excel to seconds of accurate calculations',
    colorClass: 'text-landing-primary',
  },
  {
    label: 'More Accurate',
    displayText: 'Always',
    description: 'No formula errors. No guesswork. Just accurate costs.',
    colorClass: 'text-landing-accent',
  },
  {
    label: 'Manual Logging',
    displayText: 'Anytime',
    description: 'Log temperatures anytime with dashboard alerts for violations',
    colorClass: 'text-landing-secondary',
  },
  {
    label: 'QLD Compliant',
    value: 100,
    suffix: '%',
    description: 'QLD standards applied automatically. No manual configuration needed.',
    colorClass: 'text-landing-primary',
  },
];

const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  suffix,
  colorClass,
}: {
  value: number;
  suffix: string;
  colorClass: string;
}) {
  const [count, setCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '50px',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isIntersecting || !isMounted) return;

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
  }, [isIntersecting, value, isMounted]);

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold ${colorClass}`}
      >
        {isMounted ? count : 0}
        {suffix}
      </div>
    </div>
  );
});

function Performance() {
  const getGlowColor = (colorClass: string): 'cyan' | 'magenta' | 'blue' => {
    if (colorClass.includes('primary')) return 'cyan';
    if (colorClass.includes('accent')) return 'magenta';
    return 'blue';
  };

  return (
    <section className="tablet:py-20 relative bg-transparent py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header - MacBook Pro Style */}
        <ScrollReveal variant="fade-up" className="mb-20 text-center">
          <h2 className="text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl font-light tracking-tight text-white">
            Performance
          </h2>
          <p className="text-fluid-xl tablet:text-fluid-2xl mt-6 text-gray-400">
            Happily ever faster.
          </p>
        </ScrollReveal>

        {/* Metrics Grid - MacBook Pro Style */}
        <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid gap-12">
          {metrics.map((metric, index) => (
            <ScrollReveal key={metric.label} variant="fade-up" delay={index * 0.1}>
              <GlowCard glowColor={getGlowColor(metric.colorClass)} className="p-10 text-center">
                {/* Value display – text or animated counter */}
                {metric.displayText ? (
                  <div
                    className={`text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold ${metric.colorClass}`}
                  >
                    {metric.displayText}
                  </div>
                ) : (
                  metric.value != null &&
                  metric.suffix != null && (
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.suffix}
                      colorClass={metric.colorClass}
                    />
                  )
                )}

                {/* Label */}
                <h3 className="text-fluid-2xl mt-6 font-light text-white">{metric.label}</h3>

                {/* Description */}
                <p className="text-fluid-base mt-3 leading-relaxed text-gray-400">
                  {metric.description}
                </p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Performance);
