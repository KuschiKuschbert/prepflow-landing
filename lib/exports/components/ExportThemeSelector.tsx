'use client';

import { Icon } from '@/lib/ui/Icon';
import { LayoutTemplate, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type TemplateVariant } from '../print-template';
import { type ExportTheme, themes } from '../themes';
import { ThemePreview } from './ThemePreview';

export function ExportThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState<ExportTheme>('cyber-carrot');
  const [previewVariant, setPreviewVariant] = useState<TemplateVariant>('customer');
  const [mounted, setMounted] = useState(false);

  // Load saved theme from localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('prepflow-export-theme');
    if (savedTheme && (Object.keys(themes) as string[]).includes(savedTheme)) {
      setSelectedTheme(savedTheme as ExportTheme);
    }
  }, []);

  const handleThemeChange = (theme: ExportTheme) => {
    setSelectedTheme(theme);
    localStorage.setItem('prepflow-export-theme', theme);
  };

  if (!mounted) return null;

  return (
    <div className="desktop:grid-cols-12 grid grid-cols-1 gap-8">
      {/* Controls Column */}
      <div className="desktop:col-span-4 space-y-8">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">Theme Selection</h2>
          <p className="mb-6 text-sm text-[var(--foreground-muted)]">
            Choose the visual style for your PDF exports. This theme will be applied to all your
            exported documents.
          </p>

          <div className="space-y-4">
            {Object.entries(themes).map(([key, theme]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-start space-y-0 space-x-3 rounded-md border p-4 transition-colors ${
                  selectedTheme === key
                    ? 'border-[var(--primary)] bg-[var(--accent)]/50'
                    : 'border-[var(--border)] hover:bg-[var(--accent)]/20'
                }`}
              >
                <div className="mt-1">
                  <input
                    type="radio"
                    name="theme"
                    value={key}
                    checked={selectedTheme === key}
                    onChange={() => handleThemeChange(key as ExportTheme)}
                    className="h-4 w-4 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </div>
                <div className="grid w-full gap-1.5 leading-none">
                  <div className="text-base font-semibold text-[var(--foreground)]">
                    {theme.label}
                  </div>
                  <p className="w-[90%] text-sm text-[var(--foreground-muted)]">
                    {theme.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Icon icon={LayoutTemplate} size="sm" aria-hidden />
            Preview Layout
          </h3>
          <div className="relative">
            <select
              value={previewVariant}
              onChange={e => setPreviewVariant(e.target.value as TemplateVariant)}
              className="w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-sm text-[var(--foreground)] outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="default">Purchase Order (Standard)</option>
              <option value="menu">Menu</option>
              <option value="recipe">Recipe Card</option>
              <option value="supplier">Supplier Order</option>
              <option value="kitchen">Kitchen Prep List</option>
              <option value="runsheet">Runsheet</option>
              <option value="compliance">Compliance Report</option>
            </select>
            {/* Custom arrow if needed, but appearance-none + default is fine for now */}
          </div>
          <p className="mt-2 text-xs text-[var(--foreground-muted)]">
            Change the layout to see how the theme adapts to different document types.
          </p>
        </div>
      </div>
      {/* Preview Column */}
      <div className="desktop:col-span-8">
        <div className="sticky top-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm">
            <ThemePreview theme={selectedTheme} variant={previewVariant} />
          </div>
          <div className="mt-4 flex items-center justify-between px-2 text-sm text-[var(--foreground-muted)]">
            <span className="flex items-center gap-2">
              <Icon icon={Monitor} size="sm" aria-hidden />
              Live Preview
            </span>
            <span>Real-time rendering of {themes[selectedTheme].label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
