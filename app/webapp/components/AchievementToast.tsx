// PrepFlow Personality System - Achievement Toast Component

'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
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

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentAchievement(null);
    }, 300);
  };

  if (!currentAchievement || !isVisible) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 fixed top-20 left-1/2 z-[60] -translate-x-1/2 duration-300">
      <div className="rounded-2xl border border-[var(--tertiary)]/30 bg-gradient-to-r from-[var(--tertiary)]/20 via-[var(--accent)]/20 to-[var(--primary)]/20 p-[1px] shadow-xl">
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface-variant)] px-4 py-3">
          {currentAchievement.icon && (
            <span className="text-2xl" aria-hidden="true">
              {currentAchievement.icon}
            </span>
          )}
          <div className="flex-1">
            <div className="mb-0.5 text-xs font-semibold tracking-wider text-[var(--primary)] uppercase">
              Achievement Unlocked!
            </div>
            <div className="font-semibold text-[var(--foreground)]">{currentAchievement.name}</div>
            <div className="text-sm text-[var(--foreground)]/60">{currentAchievement.description}</div>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1 text-[var(--foreground)]/60 transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            aria-label="Dismiss achievement notification"
          >
            <Icon icon={X} size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
