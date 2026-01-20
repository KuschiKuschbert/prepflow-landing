/**
 * CSV Import Template Download Component
 */
'use client';

import { Download, FileText } from 'lucide-react';
import { Icon } from '../Icon';

interface CSVImportTemplateDownloadProps {
  onDownload: () => void;
}

export function CSVImportTemplateDownload({ onDownload }: CSVImportTemplateDownloadProps) {
  return (
    <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--muted)]/30 p-4">
      <div className="flex items-center justify-between">
        <TemplateInfo />
        <DownloadButton onDownload={onDownload} />
      </div>
    </div>
  );
}

function TemplateInfo() {
  return (
    <div className="flex items-center gap-3">
      <Icon icon={FileText} size="md" className="text-[var(--primary)]" aria-hidden={true} />
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Need a template?</h3>
        <p className="text-xs text-[var(--foreground-muted)]">
          Download our CSV template with all required columns
        </p>
      </div>
    </div>
  );
}

function DownloadButton({ onDownload }: { onDownload: () => void }) {
  return (
    <button
      onClick={onDownload}
      className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
    >
      <Icon icon={Download} size="sm" aria-hidden={true} />
      Download Template
    </button>
  );
}
