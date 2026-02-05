'use client';

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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Controls Column */}
      <div className="space-y-8 lg:col-span-4">
        <div>
          <h2 className="text-foreground mb-4 text-xl font-semibold">Theme Selection</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Choose the visual style for your PDF exports. This theme will be applied to all your
            exported documents.
          </p>

          <div className="space-y-4">
            {Object.entries(themes).map(([key, theme]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-start space-y-0 space-x-3 rounded-md border p-4 transition-colors ${
                  selectedTheme === key
                    ? 'bg-accent/50 border-primary'
                    : 'hover:bg-accent border-input'
                }`}
              >
                <div className="mt-1">
                  <input
                    type="radio"
                    name="theme"
                    value={key}
                    checked={selectedTheme === key}
                    onChange={() => handleThemeChange(key as ExportTheme)}
                    className="text-primary focus:ring-primary h-4 w-4 border-gray-300"
                  />
                </div>
                <div className="grid w-full gap-1.5 leading-none">
                  <div className="text-base font-semibold">{theme.label}</div>
                  <p className="text-muted-foreground w-[90%] text-sm">{theme.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <LayoutTemplate className="h-4 w-4" />
            Preview Layout
          </h3>
          <div className="relative">
            <select
              value={previewVariant}
              onChange={e => setPreviewVariant(e.target.value as TemplateVariant)}
              className="bg-background text-foreground focus:ring-primary w-full appearance-none rounded-md border p-2 text-sm outline-none focus:border-transparent focus:ring-2"
            >
              <option value="default">Purchase Order (Standard)</option>
              <option value="menu">Menu</option>
              <option value="recipe">Recipe Card</option>
              <option value="supplier">Supplier Order</option>
              <option value="kitchen">Kitchen Prep List</option>
              <option value="compliance">Compliance Report</option>
            </select>
            {/* Custom arrow if needed, but appearance-none + default is fine for now */}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Change the layout to see how the theme adapts to different document types.
          </p>
        </div>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-8">
        <div className="sticky top-6">
          <div className="bg-card rounded-xl border p-1 shadow-sm">
            <ThemePreview theme={selectedTheme} variant={previewVariant} />
          </div>
          <div className="text-muted-foreground mt-4 flex items-center justify-between px-2 text-sm">
            <span className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Live Preview
            </span>
            <span>Real-time rendering of {themes[selectedTheme].label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
