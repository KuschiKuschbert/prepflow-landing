/**
 * Export dropdown component
 */

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Download, FileText, ChevronDown } from 'lucide-react';

interface ExportDropdownProps {
  exportLoading: string | null;
  onExport: (format: 'csv' | 'pdf' | 'html') => void;
}

export function ExportDropdown({ exportLoading, onExport }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exportLoading !== null}
        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
      >
        <Icon icon={Download} size="sm" aria-hidden={true} />
        <span>{exportLoading ? `Exporting ${exportLoading.toUpperCase()}...` : 'Export'}</span>
        <Icon
          icon={ChevronDown}
          size="xs"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden={true}
        />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden={true} />
          <div className="absolute top-full left-0 z-50 mt-1.5 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            <div className="p-1.5">
              <button
                onClick={() => {
                  onExport('csv');
                  setIsOpen(false);
                }}
                disabled={exportLoading !== null}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon={FileText} size="sm" aria-hidden={true} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => {
                  onExport('html');
                  setIsOpen(false);
                }}
                disabled={exportLoading !== null}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon={FileText} size="sm" aria-hidden={true} />
                <span>Export HTML</span>
              </button>
              <button
                onClick={() => {
                  onExport('pdf');
                  setIsOpen(false);
                }}
                disabled={exportLoading !== null}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon={FileText} size="sm" aria-hidden={true} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



