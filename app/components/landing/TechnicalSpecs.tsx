'use client';

import { useState } from 'react';
import { Zap, Rocket, Plug, Laptop, Mail, ChevronDown, LucideIcon } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface SpecCategory {
  title: string;
  items: string[];
  icon: LucideIcon;
}

const specCategories: SpecCategory[] = [
  {
    title: 'Core Features',
    icon: Zap,
    items: [
      'Ingredients & Inventory Management',
      'Recipe Builder & Library',
      'COGS Calculator',
      'Menu Performance Analysis',
      'Temperature Monitoring',
      'Cleaning Task Management',
      'Compliance Records',
      'Supplier Management',
      'Menu Builder',
      'Dish Builder',
      'Par Level Management',
      'Prep Lists & Order Lists',
    ],
  },
  {
    title: 'Capabilities',
    icon: Rocket,
    items: [
      'Real-time cost calculations',
      'Dynamic menu performance analysis',
      'AI-powered specials suggestions',
      'AI allergen detection',
      'Compliance tracking (QLD standards)',
      'GST calculation (Australian)',
      'Automated unit conversion',
      'CSV import/export',
      'Photo verification for tasks',
      'Menu builder with change tracking',
      'Prep lists and order lists',
    ],
  },
  {
    title: 'Integrations',
    icon: Plug,
    items: ['Supabase (Database)', 'Stripe (Payments)', 'Auth0 (Authentication)', 'Resend (Email)'],
  },
  {
    title: 'Requirements',
    icon: Laptop,
    items: ['Modern web browser', 'Internet connection', 'JavaScript enabled'],
  },
  {
    title: 'Support',
    icon: Mail,
    items: ['Email support', 'Documentation'],
  },
];

export default function TechnicalSpecs() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleToggle = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  return (
    <section className="desktop:py-20 relative bg-transparent py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" className="mb-16 text-center">
          <h2 className="text-fluid-4xl desktop:text-fluid-4xl large-desktop:text-fluid-4xl font-bold tracking-tight text-white">
            Technical Specifications
          </h2>
          <p className="text-fluid-xl mt-4 text-gray-400">Everything you need to know.</p>
        </ScrollReveal>

        {/* Specs Grid */}
        <div className="desktop:grid-cols-2 large-desktop:grid-cols-3 grid gap-6">
          {specCategories.map((category, index) => {
            const isExpanded = expandedCategory === category.title;

            return (
              <ScrollReveal
                key={category.title}
                variant="fade-up"
                delay={index * 0.1}
                className="rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#1f1f1f]/50"
              >
                {/* Category Header */}
                <button
                  onClick={() => handleToggle(category.title)}
                  className="flex w-full items-center justify-between text-left focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={category.icon}
                      size="lg"
                      className="text-[#29E7CD]"
                      aria-hidden={true}
                    />
                    <h3 className="text-fluid-lg font-semibold text-white">{category.title}</h3>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <Icon
                    icon={ChevronDown}
                    size="sm"
                    className={`text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden={true}
                  />
                </button>

                {/* Items List */}
                <div
                  className={`mt-4 overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <ul className="space-y-2">
                    {category.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#29E7CD]" />
                        <span className="text-fluid-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Additional Info */}
        <ScrollReveal
          variant="fade-up"
          delay={0.4}
          className="mt-16 rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-8 text-center"
        >
          <h3 className="text-fluid-2xl font-bold text-white">Ready to get started?</h3>
          <p className="mt-4 text-gray-400">
            PrepFlow works in any modern web browser. No installation required. Start managing your
            kitchen in minutes.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
