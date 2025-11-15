'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { BookOpen, DollarSign, Rocket, Settings, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    {
      title: 'Add Ingredient',
      description: 'Add new ingredients to your inventory',
      icon: Utensils,
      href: '/webapp/recipes#ingredients',
      color: 'from-[#29E7CD] to-[#D925C7]',
    },
    {
      title: 'Create Recipe',
      description: 'Build new recipes with cost calculation',
      icon: BookOpen,
      href: '/webapp/recipes',
      color: 'from-[#3B82F6] to-[#29E7CD]',
    },
    {
      title: 'View Performance',
      description: 'Analyze menu profitability',
      icon: DollarSign,
      href: '/webapp/performance',
      color: 'from-[#D925C7] to-[#3B82F6]',
    },
    {
      title: 'Setup Database',
      description: 'Initialize your kitchen management system',
      icon: Settings,
      href: '/webapp/setup',
      color: 'from-[#F59E0B] to-[#D925C7]',
    },
  ];

  return (
    <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg lg:mb-8 lg:rounded-3xl lg:p-6">
      <div className="mb-4 lg:mb-6">
        <h2 className="mb-1 flex items-center gap-2 text-fluid-xl font-semibold text-white lg:mb-2 lg:text-fluid-2xl">
          <Icon icon={Rocket} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          Quick Actions
        </h2>
        <p className="text-fluid-sm text-gray-400 lg:text-fluid-base">
          Get started with your kitchen management
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-4">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            href={action.href}
            className="group min-h-[44px] rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg hover:shadow-[#29E7CD]/10 active:scale-[0.98] lg:rounded-2xl lg:p-6"
          >
            <div className="flex flex-col items-center space-y-2 text-center lg:space-y-4">
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br lg:h-16 lg:w-16 lg:rounded-2xl ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon icon={action.icon} size="lg" className="text-white lg:h-8 lg:w-8" aria-hidden={true} />
              </div>

              <div>
                <h3 className="text-fluid-sm font-semibold text-white transition-colors duration-200 group-hover:text-[#29E7CD] lg:text-fluid-lg">
                  {action.title}
                </h3>
                <p className="mt-0.5 text-fluid-xs text-gray-400 lg:text-fluid-sm">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
