'use client';

import { SetupProgress as SetupProgressType } from '../types';

interface SetupProgressProps {
  setupProgress: SetupProgressType;
}

export default function SetupProgress({ setupProgress }: SetupProgressProps) {
  const steps = [
    { key: 'country', label: 'Country Setup', icon: '🌍', number: 1 },
    { key: 'equipment', label: 'Equipment Setup', icon: '🌡️', number: 2 },
    { key: 'ingredients', label: 'Ingredients Setup', icon: '🥕', number: 3 },
    { key: 'recipes', label: 'Recipes Setup', icon: '🍲', number: 4 },
  ];

  const completedCount = Object.values(setupProgress).filter(Boolean).length;

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Setup Progress</h2>
        <div className="text-sm text-gray-400">
          {completedCount} of 4 completed
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = setupProgress[step.key as keyof SetupProgressType];
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCompleted ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a] border border-[#29E7CD]/30'
                }`}>
                  {isCompleted ? (
                    <span className="text-black font-bold text-sm">✓</span>
                  ) : (
                    <span className="text-[#29E7CD] font-bold text-sm">{step.number}</span>
                  )}
                </div>
                <span className={`font-medium transition-colors duration-200 ${
                  isCompleted ? 'text-[#29E7CD]' : 'text-white'
                }`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`w-8 h-px transition-colors duration-200 ${
                  isCompleted ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-[#2a2a2a] rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2 text-center">
          {completedCount === 4 ? '🎉 Setup Complete! Ready to use PrepFlow.' : 'Complete all steps to finish setup'}
        </p>
      </div>
    </div>
  );
}
