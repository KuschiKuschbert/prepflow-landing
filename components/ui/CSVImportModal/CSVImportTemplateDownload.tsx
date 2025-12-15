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
    <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          <div>
            <h3 className="text-sm font-semibold text-white">Need a template?</h3>
            <p className="text-xs text-gray-400">
              Download our CSV template with all required columns
            </p>
          </div>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
        >
          <Icon icon={Download} size="sm" aria-hidden={true} />
          Download Template
        </button>
      </div>
    </div>
  );
}
