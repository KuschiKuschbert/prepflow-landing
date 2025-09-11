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
      color: 'from-[#29E7CD] to-[#D925C7]'
    },
    {
      title: 'Create Recipe',
      description: 'Build new recipes with cost calculation',
      icon: '📖',
      href: '/webapp/recipes',
      color: 'from-[#3B82F6] to-[#29E7CD]'
    },
    {
      title: 'Calculate COGS',
      description: 'Optimize menu pricing and margins',
      icon: '💰',
      href: '/webapp/cogs',
      color: 'from-[#D925C7] to-[#3B82F6]'
    },
    {
      title: 'Setup Database',
      description: 'Initialize your kitchen management system',
      icon: '⚙️',
      href: '/webapp/setup',
      color: 'from-[#F59E0B] to-[#D925C7]'
    }
  ];

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">🚀 Quick Actions</h2>
        <p className="text-gray-400">Get started with your kitchen management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            href={action.href}
            className="group bg-[#2a2a2a]/30 p-6 rounded-2xl border border-[#2a2a2a] hover:border-[#29E7CD]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#29E7CD]/10"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-3xl">{action.icon}</span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#29E7CD] transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
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
