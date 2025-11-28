'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  description: string;
  color: string;
}

const metrics: Metric[] = [
  {
    label: 'Lightning Fast',
    value: 80,
    suffix: '%',
    description: 'From hours of Excel to seconds of accurate calculations',
    color: '#29E7CD',
  },
  {
    label: 'More Accurate',
    value: 3,
    suffix: 'x',
    description: 'No more formula errors. No more guesswork. Just accurate costs.',
    color: '#D925C7',
  },
  {
    label: 'Manual Logging',
    value: 24,
    suffix: '/7',
    description: 'Log temperatures anytime with dashboard alerts for violations',
    color: '#3B82F6',
  },
  {
    label: 'QLD Compliant',
    value: 100,
    suffix: '%',
    description: 'QLD standards applied automatically. No manual configuration needed.',
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
        className="text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold"
        style={{ color }}
      >
        {isMounted ? count : 0}
        {suffix}
      </div>
    </div>
  );
});

function Performance() {
  const getGlowColor = (color: string): 'cyan' | 'magenta' | 'blue' => {
    if (color === '#29E7CD') return 'cyan';
    if (color === '#D925C7') return 'magenta';
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
        <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid gap-12">
          {metrics.map((metric, index) => (
            <ScrollReveal key={metric.label} variant="fade-up" delay={index * 0.1}>
              <GlowCard glowColor={getGlowColor(metric.color)} className="p-10 text-center">
                {/* Animated Counter */}
                <AnimatedCounter value={metric.value} suffix={metric.suffix} color={metric.color} />

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

        {/* Performance Comparison - MacBook Pro Style */}
        <ScrollReveal variant="fade-up" delay={0.4} className="tablet:p-12 mt-24">
          <GlowCard glowColor="cyan" className="tablet:p-16 p-12">
            <div className="text-center">
              <h3 className="text-fluid-3xl tablet:text-fluid-4xl font-light text-white">
                Stop fighting with Excel at 2 AM
              </h3>
              <p className="text-fluid-lg tablet:text-fluid-xl mt-6 text-gray-400">
                One platform. Real costs. Live calculations. No spreadsheets. No guesswork. No
                broken formulas.
              </p>
            </div>

            {/* Before/After Comparison */}
            <div className="desktop:grid-cols-2 mt-16 grid gap-12">
              <motion.div
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-8"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-fluid-xl mb-6 font-light text-red-400">Before PrepFlow</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>• Excel formulas break</li>
                  <li>• Hours wasted on calculations</li>
                  <li>• Guessing at costs</li>
                  <li>• No real-time updates</li>
                  <li>• Multiple systems to juggle</li>
                </ul>
              </motion.div>

              <motion.div
                className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/10 p-8"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-fluid-xl mb-6 font-light text-[#29E7CD]">With PrepFlow</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>• Calculations happen automatically</li>
                  <li>• See costs and margins instantly</li>
                  <li>• Know which dishes make money</li>
                  <li>• Track compliance in one place</li>
                  <li>• No more juggling systems</li>
                </ul>
              </motion.div>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default React.memo(Performance);
