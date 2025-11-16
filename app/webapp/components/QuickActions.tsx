'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { BookOpen, DollarSign, Rocket, Settings, ThermometerSun, Utensils } from 'lucide-react';
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
      title: 'Temperature Log',
      description: 'Log temperature readings for compliance',
      icon: ThermometerSun,
      href: '/webapp/temperature',
      color: 'from-[#F59E0B] to-[#EF4444]',
    },
    {
      title: 'View Performance',
      description: 'Analyze menu profitability',
      icon: DollarSign,
      href: '/webapp/performance',
      color: 'from-[#D925C7] to-[#3B82F6]',
    },
  ];

  return (
    <div className="desktop:mb-8 desktop:rounded-3xl desktop:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="desktop:mb-6 mb-4">
        <h2 className="text-fluid-xl desktop:mb-2 desktop:text-fluid-2xl mb-1 flex items-center gap-2 font-semibold text-white">
          <Icon icon={Rocket} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          Quick Actions
        </h2>
        <p className="text-fluid-sm desktop:text-fluid-base text-gray-400">
          Get started with your kitchen management
        </p>
      </div>

      <div className="tablet:grid-cols-4 tablet:gap-4 desktop:grid-cols-4 grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            href={action.href}
            className="group desktop:rounded-2xl desktop:p-6 min-h-[44px] rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg hover:shadow-[#29E7CD]/10 active:scale-[0.98]"
          >
            <div className="desktop:space-y-4 flex flex-col items-center space-y-2 text-center">
              <div
                className={`desktop:h-16 desktop:w-16 desktop:rounded-2xl h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon
                  icon={action.icon}
                  size="lg"
                  className="desktop:h-8 desktop:w-8 text-white"
                  aria-hidden={true}
                />
              </div>

              <div>
                <h3 className="text-fluid-sm desktop:text-fluid-lg font-semibold text-white transition-colors duration-200 group-hover:text-[#29E7CD]">
                  {action.title}
                </h3>
                <p className="text-fluid-xs desktop:text-fluid-sm mt-0.5 text-gray-400">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
