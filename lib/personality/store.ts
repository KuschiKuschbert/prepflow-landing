// PrepFlow Personality System - Settings Store (localStorage-backed)

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  type PersonalitySettings,
  getDefaultSettings,
  validateSettings,
  validateSpirit,
} from './schema';
import { PRESETS } from './presets';

const STORAGE_KEY = 'prepflow-personality';

export function usePersonality() {
  // Always start with default to prevent hydration mismatch
  const [settings, setSettings] = useState<PersonalitySettings>(getDefaultSettings());
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const validated = validateSettings(JSON.parse(stored));
        setSettings(validated);
      }
    } catch {
      // Invalid stored data, use defaults
    }

    setIsHydrated(true);
  }, []);

  // Persist to localStorage on change (only after hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage quota exceeded or disabled, ignore
    }
  }, [settings, isHydrated]);

  const updateSettings = useCallback((patch: Partial<PersonalitySettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const applyPreset = useCallback((spirit: PersonalitySettings['spirit']) => {
    const preset = PRESETS[spirit] || {};
    setSettings(prev => ({
      ...prev,
      spirit: validateSpirit(spirit),
      ...preset,
    }));
  }, []);

  const silenceFor24h = useCallback(() => {
    const silencedUntil = Date.now() + 24 * 60 * 60 * 1000;
    setSettings(prev => ({ ...prev, silencedUntil }));
  }, []);

  return {
    settings,
    set: updateSettings,
    applyPreset,
    silenceFor24h,
  };
}
