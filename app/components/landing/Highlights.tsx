'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Image from 'next/image';

interface Highlight {
  name: string;
  description: string;
  icon: string;
  screenshot?: string;
  color: string;
}

const highlights: Highlight[] = [
  {
    name: 'Ingredients Management',
    description: 'Track costs, suppliers, and inventory in real-time',
    icon: '🥬',
    screenshot: '/images/ingredients-management-screenshot.png',
    color: '#29E7CD',
  },
  {
    name: 'AI-Powered Analysis',
    description: 'Smart COGS calculations and menu optimization',
    icon: '🤖',
    screenshot: '/images/dashboard-screenshot.png',
    color: '#D925C7',
  },
  {
    name: 'Real-Time Monitoring',
    description: 'Temperature, cleaning, and compliance tracking',
    icon: '🌡️',
    screenshot: '/images/dashboard-screenshot.png',
    color: '#3B82F6',
  },
  {
    name: 'Recipe Management',
    description: 'Build recipes with live cost calculations',
    icon: '📖',
    screenshot: '/images/cogs-calculator-screenshot.png',
    color: '#29E7CD',
  },
  {
    name: 'Performance Analytics',
    description: "Chef's Kiss, Hidden Gem, Bargain Bucket classification",
    icon: '📊',
    screenshot: '/images/dashboard-screenshot.png',
    color: '#D925C7',
  },
];

export default function Highlights() {
  return (
    <section className="relative bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Get the highlights.
          </h2>
        </div>

        {/* Highlights Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {highlights.map((highlight, index) => {
            const { ref, animationStyle } = useScrollAnimation<HTMLDivElement>({
              threshold: 0.2,
              triggerOnce: true,
              delay: index * 50, // 50ms stagger delay
            });

            return (
              <div
                key={highlight.name}
                ref={ref}
                style={animationStyle}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#1f1f1f]/50"
              >
                {/* Icon */}
                <div className="mb-4 text-5xl">{highlight.icon}</div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-semibold text-white">{highlight.name}</h3>

                {/* Description */}
                <p className="text-sm text-gray-400">{highlight.description}</p>

                {/* Hover Effect - Screenshot Preview */}
                {highlight.screenshot && (
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10">
                    <Image
                      src={highlight.screenshot}
                      alt={highlight.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
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
          })}
        </div>
      </div>
    </section>
  );
}
