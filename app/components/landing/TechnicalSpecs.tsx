'use client';

import { useState } from 'react';
import { Zap, Rocket, Plug, Laptop, Mail, ChevronDown, LucideIcon } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
      'Ingredients Management',
      'Recipe Builder',
      'COGS Calculator',
      'Performance Analysis',
      'Temperature Monitoring',
      'Cleaning Roster',
      'Compliance Records',
      'Supplier Management',
    ],
  },
  {
    title: 'Capabilities',
    icon: Rocket,
    items: [
      'Real-time cost calculations',
      'AI-powered menu optimization',
      'Compliance tracking (QLD standards)',
      'Multi-currency support',
      'GST calculation (Australian)',
      'Automated unit conversion',
      'CSV import/export',
      'Photo verification for tasks',
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
    items: ['Email support', 'Documentation', 'Help center', 'Community forum'],
  },
];

export default function TechnicalSpecs() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleToggle = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  return (
    <section className="relative bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Technical Specifications
          </h2>
          <p className="mt-4 text-xl text-gray-400">Everything you need to know.</p>
        </div>

        {/* Specs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {specCategories.map((category) => {
            const isExpanded = expandedCategory === category.title;

            return (
              <div
                key={category.title}
                className="rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#1f1f1f]/50"
              >
                {/* Category Header */}
                <button
                  onClick={() => handleToggle(category.title)}
                  className="flex w-full items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <Icon icon={category.icon} size="lg" className="text-[#29E7CD]" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <Icon icon={ChevronDown} size="sm" className={`text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
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
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Ready to get started?</h3>
          <p className="mt-4 text-gray-400">
            PrepFlow works in any modern web browser. No installation required. Start managing your
            kitchen in minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
