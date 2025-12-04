'use client';

import { SetupProgress as SetupProgressType } from '../types';
import { Globe, Thermometer, Carrot, ChefHat, PartyPopper } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface SetupProgressProps {
  setupProgress: SetupProgressType;
}

export default function SetupProgress({ setupProgress }: SetupProgressProps) {
  const steps = [
    { key: 'country', label: 'Country Setup', icon: Globe, number: 1 },
    { key: 'equipment', label: 'Equipment Setup', icon: Thermometer, number: 2 },
    { key: 'ingredients', label: 'Ingredients Setup', icon: Carrot, number: 3 },
    { key: 'recipes', label: 'Recipes Setup', icon: ChefHat, number: 4 },
  ];

  const completedCount = Object.values(setupProgress).filter(Boolean).length;

  return (
    <div className="mb-8 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Setup Progress</h2>
        <div className="text-sm text-gray-400">{completedCount} of 4 completed</div>
      </div>

      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = setupProgress[step.key as keyof SetupProgressType];
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    isCompleted ? 'bg-[#29E7CD]' : 'border border-[#29E7CD]/30 bg-[#2a2a2a]'
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-sm font-bold text-black">✓</span>
                  ) : (
                    <span className="text-sm font-bold text-[#29E7CD]">{step.number}</span>
                  )}
                </div>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    isCompleted ? 'text-[#29E7CD]' : 'text-white'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-px w-8 transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#29E7CD]'
                      : 'bg-[#2a2a2a]'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-[#2a2a2a]">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] transition-all duration-500"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-400">
          {completedCount === 4 ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon={PartyPopper} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
              Setup Complete! Ready to use PrepFlow.
            </span>
          ) : (
            'Complete all steps to finish setup'
          )}
        </p>
      </div>
    </div>
  );
}
