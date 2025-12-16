'use client';

import React from 'react';
import { useTheme } from '@/lib/theme/useTheme';
import { Moon, Sun } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useIsVisible } from '@/hooks/useIsVisible';

/**
 * Theme toggle panel component for settings page.
 * Allows users to switch between dark and light themes.
 *
 * @component
 * @returns {JSX.Element} Theme toggle panel
 */
export function ThemeTogglePanel() {
  const { theme, toggleTheme, isDark, isLight, isHydrated } = useTheme();
  const [ref, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.1 });
  const [isMounted, setIsMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use default values until hydrated to prevent mismatch
  const displayIsDark = isMounted && isHydrated ? isDark : true;
  const displayIsLight = isMounted && isHydrated ? isLight : false;

  return (
    <div
      ref={ref}
      className="mb-6 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Theme</h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">
          Choose your preferred color theme. Light mode uses brighter colors while maintaining the
          Cyber Carrot design system.
        </p>
      </div>

      {/* Theme Toggle */}
      <div className="space-y-4 border-t border-[var(--border)] pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon
                icon={displayIsDark ? Moon : Sun}
                size="md"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
              <label
                className="text-sm font-medium text-[var(--foreground)]"
                suppressHydrationWarning
              >
                {displayIsDark ? 'Dark Mode' : 'Light Mode'}
              </label>
            </div>
            <p
              className="mt-1 text-xs text-[var(--foreground)]/60"
              suppressHydrationWarning
            >
              {displayIsDark
                ? 'Dark theme with Cyber Carrot accents'
                : 'Light theme with brighter colors and Cyber Carrot accents'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--muted)] focus:outline-none ${
              displayIsLight ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
            }`}
            role="switch"
            aria-checked={displayIsLight}
            aria-label={displayIsDark ? 'Switch to light mode' : 'Switch to dark mode'}
            suppressHydrationWarning
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[var(--qr-background)] shadow ring-0 transition-transform ${
                displayIsLight ? 'translate-x-5' : 'translate-x-0'
              }`}
              suppressHydrationWarning
            />
          </button>
        </div>

        {/* Theme Preview */}
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="mb-3 text-xs font-medium text-[var(--foreground)]/60 uppercase tracking-wider">
            Preview
          </p>
          <div className="flex gap-3">
            {/* Primary Color */}
            <div className="flex-1">
              <div
                className="h-12 rounded-lg"
                style={{ backgroundColor: 'var(--primary)' }}
                title="Primary (Cyan)"
              />
              <p className="mt-2 text-xs text-[var(--foreground)]/60">Primary</p>
            </div>
            {/* Secondary Color */}
            <div className="flex-1">
              <div
                className="h-12 rounded-lg"
                style={{ backgroundColor: 'var(--secondary)' }}
                title="Secondary (Blue)"
              />
              <p className="mt-2 text-xs text-[var(--foreground)]/60">Secondary</p>
            </div>
            {/* Accent Color */}
            <div className="flex-1">
              <div
                className="h-12 rounded-lg"
                style={{ backgroundColor: 'var(--accent)' }}
                title="Accent (Magenta)"
              />
              <p className="mt-2 text-xs text-[var(--foreground)]/60">Accent</p>
            </div>
            {/* Tertiary Color */}
            <div className="flex-1">
              <div
                className="h-12 rounded-lg"
                style={{ backgroundColor: 'var(--tertiary)' }}
                title="Tertiary (Orange)"
              />
              <p className="mt-2 text-xs text-[var(--foreground)]/60">Tertiary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
