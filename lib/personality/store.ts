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
  const [settings, setSettings] = useState<PersonalitySettings>(() => {
    if (typeof window === 'undefined') return getDefaultSettings();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return validateSettings(JSON.parse(stored));
      }
    } catch {
      // Invalid stored data, use defaults
    }
    return getDefaultSettings();
  });

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage quota exceeded or disabled, ignore
    }
  }, [settings]);

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
