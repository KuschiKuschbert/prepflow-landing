'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '../components/static/PageHeader';
import { KitchenTimer } from './components/KitchenTimer';
import { UnitConverter } from './components/UnitConverter';
import { TemperatureConverter } from './components/TemperatureConverter';
import { CookingTimeCalculator } from './components/CookingTimeCalculator';
import { YieldPortionCalculator } from './components/YieldPortionCalculator';
import { VolumeToWeightConverter } from './components/VolumeToWeightConverter';
import { IngredientSubstitutionGuide } from './components/IngredientSubstitutionGuide';

type GadgetTab =
  | 'timer'
  | 'unit'
  | 'temperature'
  | 'cooking-time'
  | 'yield'
  | 'volume-weight'
  | 'substitution';

function GadgetsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<GadgetTab>('timer');

  // Check for tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (
      tabParam &&
      [
        'timer',
        'unit',
        'temperature',
        'cooking-time',
        'yield',
        'volume-weight',
        'substitution',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam as GadgetTab);
    }
  }, [searchParams]);

  const tabs: { id: GadgetTab; label: string; icon: string }[] = [
    { id: 'timer', label: 'Kitchen Timer', icon: '⏱️' },
    { id: 'unit', label: 'Unit Converter', icon: '🔄' },
    { id: 'temperature', label: 'Temperature', icon: '🌡️' },
    { id: 'cooking-time', label: 'Cooking Time', icon: '⏰' },
    { id: 'yield', label: 'Yield/Portion', icon: '📊' },
    { id: 'volume-weight', label: 'Volume to Weight', icon: '⚖️' },
    { id: 'substitution', label: 'Substitutions', icon: '🔄' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white">
      <div className="mx-auto w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <PageHeader
          title="Kitchen Gadgets"
          subtitle="Useful digital tools for your kitchen"
          icon="🔧"
        />

        {/* Tab Navigation */}
        <div className="mb-6 w-full overflow-x-auto">
          <div className="flex w-full space-x-2 border-b border-[#2a2a2a]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
                  activeTab === tab.id
                    ? 'border-[#29E7CD] text-[#29E7CD]'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gadget Content - Full Width */}
        <div className="w-full rounded-2xl bg-[#1f1f1f] p-4 sm:p-6 md:p-8 lg:p-10">
          {activeTab === 'timer' && <KitchenTimer />}
          {activeTab === 'unit' && <UnitConverter />}
          {activeTab === 'temperature' && <TemperatureConverter />}
          {activeTab === 'cooking-time' && <CookingTimeCalculator />}
          {activeTab === 'yield' && <YieldPortionCalculator />}
          {activeTab === 'volume-weight' && <VolumeToWeightConverter />}
          {activeTab === 'substitution' && <IngredientSubstitutionGuide />}
        </div>
      </div>
    </div>
  );
}

export default function GadgetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <PageHeader
              title="Kitchen Gadgets"
              subtitle="Useful digital tools for your kitchen"
              icon="🔧"
            />
            <div className="rounded-2xl bg-[#1f1f1f] p-6 md:p-8">
              <div className="animate-pulse text-center text-gray-400">Loading gadgets...</div>
            </div>
          </div>
        </div>
      }
    >
      <GadgetsContent />
    </Suspense>
  );
}
