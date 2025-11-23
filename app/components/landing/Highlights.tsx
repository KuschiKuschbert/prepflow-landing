'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Image from 'next/image';
import { Leaf, Bot, Thermometer, BookOpen, BarChart3, LucideIcon } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface Highlight {
  name: string;
  description: string;
  icon: LucideIcon;
  screenshot?: string;
  color: string;
}

const highlights: Highlight[] = [
  {
    name: 'Ingredients Management',
    description: 'Track costs, suppliers, and inventory in real-time',
    icon: Leaf,
    screenshot: '/images/ingredients-management-screenshot.png',
    color: '#29E7CD',
  },
  {
    name: 'AI-Powered Analysis',
    description: 'Smart COGS calculations and menu optimization',
    icon: Bot,
    screenshot: '/images/dashboard-screenshot.png',
    color: '#D925C7',
  },
  {
    name: 'Real-Time Monitoring',
    description: 'Temperature, cleaning, and compliance tracking',
    icon: Thermometer,
    screenshot: '/images/temperature-monitoring-screenshot.png',
    color: '#3B82F6',
  },
  {
    name: 'Recipe Management',
    description: 'Build recipes with live cost calculations',
    icon: BookOpen,
    screenshot: '/images/recipe-book-screenshot.png',
    color: '#29E7CD',
  },
  {
    name: 'Performance Analytics',
    description: "Chef's Kiss, Hidden Gem, Bargain Bucket classification",
    icon: BarChart3,
    screenshot: '/images/performance-analysis-screenshot.png',
    color: '#D925C7',
  },
];

const HighlightCard = React.memo(function HighlightCard({
  highlight,
  index,
}: {
  highlight: Highlight;
  index: number;
}) {
  const { ref, animationStyle } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    delay: index * 50, // 50ms stagger delay
  });

  return (
    <div
      ref={ref}
      style={animationStyle}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#1f1f1f]/50"
    >
      {/* Icon */}
      <div className="mb-4">
        <Icon icon={highlight.icon} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>

      {/* Title */}
      <h3 className="text-fluid-xl mb-2 font-semibold text-white">{highlight.name}</h3>

      {/* Description */}
      <p className="text-fluid-sm text-gray-400">{highlight.description}</p>

      {/* Hover Effect - Screenshot Preview */}
      {highlight.screenshot && (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10">
          <Image
            src={highlight.screenshot}
            alt={highlight.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            loading="lazy"
          />
        </div>
      )}

      {/* Accent Color Indicator */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: highlight.color }}
      />
    </div>
  );
});

function Highlights() {
  return (
    <section className="tablet:py-20 relative bg-transparent py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-fluid-3xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold tracking-tight text-white">
            Get the highlights.
          </h2>
        </div>

        {/* Highlights Grid */}
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 grid gap-8 xl:grid-cols-5">
          {highlights.map((highlight, index) => (
            <HighlightCard key={highlight.name} highlight={highlight} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Highlights);
