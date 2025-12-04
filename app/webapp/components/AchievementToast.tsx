// PrepFlow Personality System - Achievement Toast Component

'use client';

import { useEffect, useState } from 'react';
import { type Achievement } from '@/lib/personality/achievements';
import { usePersonality } from '@/lib/personality/store';
import confetti from 'canvas-confetti';

// Vegetable-themed colors for confetti (reuse from mise-en-place)
const VEGETABLE_COLORS = [
  '#FF6B6B', // Tomato red
  '#4ECDC4', // Cucumber green
  '#FFE66D', // Corn yellow
  '#95E1D3', // Lettuce green
  '#F38181', // Carrot orange
  '#AA96DA', // Eggplant purple
  '#FCBAD3', // Radish pink
  '#FFFFD2', // Onion white/yellow
];

function throwAchievementConfetti() {
  // Multiple bursts for celebration
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
    colors: VEGETABLE_COLORS,
    shapes: ['circle', 'square'],
  });

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 50,
      origin: { x: 0.3, y: 0.5 },
      colors: VEGETABLE_COLORS,
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 50,
      origin: { x: 0.7, y: 0.5 },
      colors: VEGETABLE_COLORS,
    });
  }, 400);
}

export function AchievementToast() {
  const { settings } = usePersonality();
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!settings.enabled) return;

    const handleAchievement = (event: CustomEvent<{ achievement: Achievement }>) => {
      const achievement = event.detail.achievement;
      setCurrentAchievement(achievement);
      setIsVisible(true);

      // Trigger confetti
      throwAchievementConfetti();

      // Auto-hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentAchievement(null);
        }, 300);
      }, 8000);
    };

    window.addEventListener('personality:achievement', handleAchievement as EventListener);

    return () => {
      window.removeEventListener('personality:achievement', handleAchievement as EventListener);
    };
  }, [settings.enabled]);

  if (!currentAchievement || !isVisible) return null;

  return (
    <div
      className="fixed top-20 left-1/2 z-[90] -translate-x-1/2 transform transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '-20px'})`,
      }}
    >
      <div className="mx-auto max-w-md rounded-3xl border-2 border-[#29E7CD]/50 bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] text-4xl">
            {currentAchievement.icon}
          </div>
          <div className="flex-1">
            <div className="mb-1 text-xs font-semibold tracking-wider text-[#29E7CD] uppercase">
              Achievement Unlocked!
            </div>
            <div className="text-xl font-bold text-white">{currentAchievement.name}</div>
            <div className="mt-1 text-sm text-gray-300">{currentAchievement.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
