'use client';

import { ExportThemeSelector } from '@/lib/exports/components/ExportThemeSelector';
import { FileDown } from 'lucide-react';

export function ExportSection() {
  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 rounded-lg p-2">
          <FileDown className="text-primary h-6 w-6" />
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Export Settings</h2>
          <p className="text-muted-foreground">
            Customize how your documents look when exported to PDF.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <ExportThemeSelector />
      </div>
    </div>
  );
}
