'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  DollarSign,
  Leaf,
  ListChecks,
  LucideIcon,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface Highlight {
  name: string;
  description: string;
  icon: LucideIcon;
  screenshot?: string;
  color: string;
}

const highlights: Highlight[] = [
  {
    name: 'Ingredients & Inventory',
    description: 'Track costs, suppliers, stock. Automatic unit conversion included.',
    icon: Leaf,
    screenshot: '/images/ingredients-management-screenshot.png',
    color: '#29E7CD',
  },
  {
    name: 'COGS Calculator',
    description: 'Accurate food costs. Waste factors. Yield adjustments. All automatic.',
    icon: DollarSign,
    screenshot: '/images/dashboard-screenshot.png',
    color: '#D925C7',
  },
  {
    name: 'Functions & Events',
    description:
      'Catering, weddings, private dining—calendar, runsheets, and clients, all in place.',
    icon: CalendarDays,
    screenshot: '/images/functions-events-screenshot.png',
    color: '#FF6B00',
  },
  {
    name: 'Temperature & Compliance',
    description: 'QLD-compliant logging. Dashboard alerts. Full audit trails.',
    icon: Thermometer,
    screenshot: '/images/temperature-monitoring-screenshot.png',
    color: '#3B82F6',
  },
  {
    name: 'Recipe Builder',
    description: 'Build recipes. See costs live. Get pricing recommendations instantly.',
    icon: BookOpen,
    screenshot: '/images/recipe-book-screenshot.png',
    color: '#29E7CD',
  },
  {
    name: 'Menu Performance',
    description: "Chef's Kiss, Hidden Gems, Bargain Buckets—know what makes money.",
    icon: BarChart3,
    screenshot: '/images/performance-analysis-screenshot.png',
    color: '#D925C7',
  },
  {
    name: 'AI Specials',
    description: 'AI-powered specials suggestions. Scrape recipes, get ideas, build your menu.',
    icon: Sparkles,
    screenshot: '/images/performance-analysis-screenshot.png',
    color: '#FF6B00',
  },
  {
    name: 'Prep Lists',
    description: 'Generate kitchen prep lists from your menu. Order lists and par levels included.',
    icon: ListChecks,
    screenshot: '/images/dashboard-screenshot.png',
    color: '#3B82F6',
  },
];

const HighlightCard = React.memo(function HighlightCard({
  highlight,
  index,
}: {
  highlight: Highlight;
  index: number;
}) {
  return (
    <ScrollReveal variant="fade-up" delay={index * 0.1} className="h-full">
      <GlowCard
        glowColor={`rgba(${parseInt(highlight.color.slice(1, 3), 16)}, ${parseInt(highlight.color.slice(3, 5), 16)}, ${parseInt(highlight.color.slice(5, 7), 16)}, 0.1)`}
        className="group relative flex h-full min-h-[240px] cursor-pointer flex-col overflow-hidden p-8"
      >
        <HighlightIcon icon={highlight.icon} />

        {/* Title */}
        <h3 className="text-fluid-xl mb-3 font-light text-white">{highlight.name}</h3>

        {/* Description */}
        <p className="text-fluid-base flex-1 leading-relaxed text-gray-400">
          {highlight.description}
        </p>

        <HighlightImageOverlay highlight={highlight} />
        <HighlightAccent highlight={highlight} />
      </GlowCard>
    </ScrollReveal>
  );
});

function HighlightIcon({ icon }: { icon: LucideIcon }) {
  return (
    <motion.div className="mb-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <Icon icon={icon} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
    </motion.div>
  );
}

function HighlightImageOverlay({ highlight }: { highlight: Highlight }) {
  if (!highlight.screenshot) return null;

  return (
    <motion.div
      className="absolute inset-0 opacity-0"
      whileHover={{ opacity: 0.1 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={highlight.screenshot}
        alt={highlight.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        loading="lazy"
      />
    </motion.div>
  );
}

function HighlightAccent({ highlight }: { highlight: Highlight }) {
  const accentClass =
    highlight.name.includes('Ingredients') || highlight.name.includes('Recipe')
      ? 'bg-[#29E7CD]'
      : highlight.name.includes('COGS') || highlight.name.includes('Menu')
        ? 'bg-[#D925C7]'
        : highlight.name.includes('Functions') || highlight.name.includes('AI Specials')
          ? 'bg-[#FF6B00]'
          : highlight.name.includes('Prep') || highlight.name.includes('Temperature')
            ? 'bg-[#3B82F6]'
            : 'bg-[#3B82F6]';
  return (
    <motion.div
      className={`absolute bottom-0 left-0 h-1 w-full ${accentClass}`}
      whileHover={{ height: '8px' }}
      transition={{ duration: 0.3 }}
    />
  );
}

function Highlights() {
  return (
    <section id="features" className="tablet:pb-32 tablet:pt-40 relative bg-transparent py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header - MacBook Pro Style */}
        <ScrollReveal variant="fade-up" className="mb-20 text-center">
          <h2 className="text-fluid-4xl tablet:text-fluid-5xl desktop:text-fluid-6xl font-light tracking-tight text-white">
            Everything you need.
          </h2>
        </ScrollReveal>

        {/* Highlights Grid - Modern auto-fit pattern for optimal column count */}
        <div className="tablet:gap-10 desktop:gap-12 large-desktop:gap-14 tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-12 xl:gap-16">
          {highlights.map((highlight, index) => (
            <HighlightCard key={highlight.name} highlight={highlight} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Highlights);
