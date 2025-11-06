// PrepFlow Personality System - Mise en Place Easter Egg Hook

'use client';

import { useEffect, useRef } from 'react';
import { usePersonality } from '@/lib/personality/store';
import confetti from 'canvas-confetti';

const MISE_EN_PLACE_TRIGGER = 'mise en place';

// Vegetable-themed colors for confetti
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

/**
 * Throw vegetable-themed confetti
 */
const throwVegetableConfetti = () => {
  // Multiple bursts for more impact
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: VEGETABLE_COLORS,
    shapes: ['circle', 'square'],
  });

  // Second burst after a short delay
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 0.3, y: 0.5 },
      colors: VEGETABLE_COLORS,
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 0.7, y: 0.5 },
      colors: VEGETABLE_COLORS,
    });
  }, 400);
};

/**
 * Hook to detect "mise en place" typing in any input field
 * Triggers confetti when the phrase is typed
 */
export function useMiseEnPlaceEasterEgg() {
  const { settings } = usePersonality();
  const lastTriggerRef = useRef<number>(0);
  const COOLDOWN_MS = 5000; // 5 second cooldown between triggers

  useEffect(() => {
    if (!settings.enabled || !settings.footerEasterEggs) {
      // Debug: Log why it's not active
      if (process.env.NODE_ENV === 'development') {
        console.log('[Mise en Place] Disabled:', {
          enabled: settings.enabled,
          footerEasterEggs: settings.footerEasterEggs,
        });
      }
      return;
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) return;

      const value = target.value.toLowerCase();

      // Check if "mise en place" appears anywhere in the input (case-insensitive)
      if (value.includes(MISE_EN_PLACE_TRIGGER)) {
        const now = Date.now();
        if (now - lastTriggerRef.current < COOLDOWN_MS) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mise en Place] Cooldown active');
          }
          return; // Cooldown
        }

        lastTriggerRef.current = now;

        if (process.env.NODE_ENV === 'development') {
          console.log('[Mise en Place] Triggered!', value);
        }

        // Trigger vegetable confetti
        throwVegetableConfetti();

        // Optional: Show a toast
        window.dispatchEvent(
          new CustomEvent('personality:addToast', {
            detail: { message: 'Mise en place! Everything in its place. 🥕' },
          }),
        );
      }
    };

    // Listen to input events on all input fields
    document.addEventListener('input', handleInput, true);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Mise en Place] Hook active, listening for input events');
    }

    return () => {
      document.removeEventListener('input', handleInput, true);
    };
  }, [settings.enabled, settings.footerEasterEggs]);
}
