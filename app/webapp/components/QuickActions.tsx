'use client';

import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

export default function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    {
      title: 'Add Ingredient',
      description: 'Add new ingredients to your inventory',
      icon: '🥘',
      href: '/webapp/ingredients',
      color: 'from-[#29E7CD] to-[#D925C7]',
    },
    {
      title: 'Create Recipe',
      description: 'Build new recipes with cost calculation',
      icon: '📖',
      href: '/webapp/recipes',
      color: 'from-[#3B82F6] to-[#29E7CD]',
    },
    {
      title: 'Calculate COGS',
      description: 'Optimize menu pricing and margins',
      icon: '💰',
      href: '/webapp/cogs',
      color: 'from-[#D925C7] to-[#3B82F6]',
    },
    {
      title: 'Setup Database',
      description: 'Initialize your kitchen management system',
      icon: '⚙️',
      href: '/webapp/setup',
      color: 'from-[#F59E0B] to-[#D925C7]',
    },
  ];

  return (
    <div className="mb-8 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold text-white">🚀 Quick Actions</h2>
        <p className="text-gray-400">Get started with your kitchen management</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg hover:shadow-[#29E7CD]/10"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <div
                className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
              >
                <span className="text-3xl">{action.icon}</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-[#29E7CD]">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-gray-400">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
