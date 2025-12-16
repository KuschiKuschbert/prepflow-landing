// PrepFlow Theme System - Theme Management Hook (localStorage-backed)

'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'prepflow-theme';
const DEFAULT_THEME: Theme = 'dark';

/**
 * Theme management hook.
 * Provides theme state and utilities with localStorage persistence.
 *
 * @returns {Object} Theme utilities
 * @returns {Theme} returns.theme - Current theme ('dark' | 'light')
 * @returns {Function} returns.setTheme - Set theme directly
 * @returns {Function} returns.toggleTheme - Toggle between dark and light
 * @returns {boolean} returns.isDark - Whether current theme is dark
 * @returns {boolean} returns.isLight - Whether current theme is light
 * @returns {boolean} returns.isHydrated - Whether theme has been loaded from localStorage
 *
 * @example
 * ```typescript
 * const { theme, toggleTheme, isDark } = useTheme();
 *
 * return (
 *   <button onClick={toggleTheme}>
 *     Switch to {isDark ? 'light' : 'dark'} mode
 *   </button>
 * );
 * ```
 */
export function useTheme() {
  // Always start with default to prevent hydration mismatch
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  // Also sync with data-theme attribute set by inline script to prevent hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
      // First, check if data-theme attribute is already set (by inline script)
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark' || currentTheme === 'light') {
        setThemeState(currentTheme as Theme);
        setIsHydrated(true);
        return;
      }

      // Fallback to localStorage if data-theme not set
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'dark' || stored === 'light')) {
        setThemeState(stored as Theme);
      }
    } catch {
      // Invalid stored data, use defaults
    }

    setIsHydrated(true);
  }, []);

  // Apply theme to document root on change (only after hydration to prevent SSR mismatch)
  // Only update if different from current value to prevent unnecessary DOM updates
  useEffect(() => {
    if (typeof document === 'undefined' || !isHydrated) return;

    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    if (currentTheme !== theme) {
      root.setAttribute('data-theme', theme);
    }
  }, [theme, isHydrated]);

  // Persist to localStorage on change (only after hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage quota exceeded or disabled, ignore
    }
  }, [theme, isHydrated]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isHydrated,
  };
}
