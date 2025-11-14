'use client';

import { ChefHat, UtensilsCrossed, Truck, Coffee } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export default function UseCases() {
  const useCases = [
    {
      title: 'Head Chefs',
      benefit: 'Price new dishes with confidence',
      description:
        'When your supplier raises prices, see the impact instantly. No more guessing if that new special will turn a profit.',
      color: '#29E7CD',
      icon: ChefHat,
    },
    {
      title: 'Restaurant Owners',
      benefit: 'Understand menu profitability',
      description:
        'Know which dishes are making you smile at the bank and which ones are eating your margins.',
      color: '#3B82F6',
      icon: UtensilsCrossed,
    },
    {
      title: 'Food Trucks',
      benefit: 'Track costs on the go',
      description:
        'Mobile-friendly pricing that moves with you. Update costs from anywhere, price with confidence.',
      color: '#D925C7',
      icon: Truck,
    },
    {
      title: 'Cafe Managers',
      benefit: 'Standardize recipes across locations',
      description:
        'Keep consistency across multiple cafes. Same recipe, same cost, same profit margin every time.',
      color: '#29E7CD',
      icon: Coffee,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-fluid-3xl font-bold tracking-tight desktop:text-fluid-4xl">Built for your kitchen</h2>
        <p className="mt-4 text-fluid-lg text-gray-300">
          Whether you're running a food truck or a restaurant, PrepFlow fits your workflow
        </p>
      </div>

      <div className="mt-12 grid gap-6 desktop:grid-cols-2 large-desktop:grid-cols-4">
        {useCases.map(useCase => (
          <div
            key={useCase.title}
            className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6 transition-all hover:border-[#2a2a2a]/60 hover:bg-[#1f1f1f]/70"
          >
            <div className="mb-4">
              <Icon
                icon={useCase.icon}
                size="xl"
                style={{ color: useCase.color }}
                aria-hidden={true}
              />
            </div>
            <h3 className="mb-2 text-fluid-xl font-semibold" style={{ color: useCase.color }}>
              {useCase.title}
            </h3>
            <p className="mb-3 font-medium text-white">{useCase.benefit}</p>
            <p className="text-fluid-sm text-gray-400">{useCase.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
