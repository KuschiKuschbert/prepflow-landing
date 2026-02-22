'use client';

import { Icon } from '@/components/ui/Icon';
import { ExportThemeSelector } from '@/lib/exports/components/ExportThemeSelector';
import { FileDown } from 'lucide-react';

export function ExportSection() {
  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 rounded-lg p-2">
          <Icon icon={FileDown} size="md" className="text-primary" aria-hidden />
        </div>
        <div>
          <h2 className="text-fluid-xl tablet:text-fluid-2xl font-bold tracking-tight text-[var(--foreground)]">
            Export Settings
          </h2>
          <p className="text-[var(--foreground-muted)]">
            Customize how your documents look when exported to PDF.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <ExportThemeSelector />
      </div>
    </div>
  );
}
