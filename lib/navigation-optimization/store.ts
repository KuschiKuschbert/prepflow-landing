// PrepFlow Adaptive Navigation Optimization - Settings Store (localStorage-backed)

'use client';

import { useState, useEffect, useCallback } from 'react';
import { type AdaptiveNavSettings, getDefaultSettings, validateSettings } from './schema';

const STORAGE_KEY = 'prepflow-adaptive-nav';

/**
 * Hook to manage adaptive navigation settings stored in localStorage.
 *
 * @returns {Object} Adaptive navigation settings hook
 * @returns {AdaptiveNavSettings} returns.settings - Current settings
 * @returns {Function} returns.setSettings - Function to update settings
 * @returns {Function} returns.updateSettings - Function to partially update settings
 *
 * @example
 * ```typescript
 * const { settings, setSettings, updateSettings } = useAdaptiveNavSettings();
 * updateSettings({ enabled: true, selectedSections: ['service', 'planning'] });
 * ```
 */
export function useAdaptiveNavSettings() {
  const [settings, setSettingsState] = useState<AdaptiveNavSettings>(() => {
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
      const updatedSettings = {
        ...settings,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch {
      // Storage quota exceeded or disabled, ignore
    }
  }, [settings]);

  const setSettings = useCallback((newSettings: AdaptiveNavSettings) => {
    setSettingsState(validateSettings(newSettings));
  }, []);

  const updateSettings = useCallback((patch: Partial<AdaptiveNavSettings>) => {
    setSettingsState(prev => validateSettings({ ...prev, ...patch }));
  }, []);

  return {
    settings,
    setSettings,
    updateSettings,
  };
}

/**
 * Get adaptive navigation settings from localStorage (for use outside React).
 *
 * @returns {AdaptiveNavSettings} Current settings or defaults
 */
export function getAdaptiveNavSettings(): AdaptiveNavSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return validateSettings(JSON.parse(stored));
    }
  } catch {
    // Invalid stored data, use defaults
  }
  return getDefaultSettings();
}
