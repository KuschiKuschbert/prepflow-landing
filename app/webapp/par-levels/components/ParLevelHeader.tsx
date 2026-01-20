'use client';

import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { Icon } from '@/components/ui/Icon';
import { PrintButton } from '@/components/ui/PrintButton';
import { useTranslation } from '@/lib/useTranslation';
import { Package2 } from 'lucide-react';

interface ParLevelHeaderProps {
  onAdd: () => void;
  onPrint: () => void;
  onExport: (format: ExportFormat) => void;
  printLoading: boolean;
  exportLoading: ExportFormat | null;
  hasItems: boolean;
}

export function ParLevelHeader({
  onAdd,
  onPrint,
  onExport,
  printLoading,
  exportLoading,
  hasItems,
}: ParLevelHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-[var(--foreground)]">
          <Icon icon={Package2} size="lg" aria-hidden={true} />
          {t('parLevels.title', 'Par Level Management')}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-[var(--foreground-muted)]">
            {t('parLevels.subtitle', 'Set minimum stock levels for automatic reordering')}
          </p>
          <HelpTooltip
            content="Par levels help you manage inventory automatically. Set a minimum stock level (par level) - when stock hits this level, you should order more. Set a reorder point (critical level) - when reached, order immediately to avoid running out."
            title="What are Par Levels?"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onAdd}
          className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
        >
          + {t('parLevels.addParLevel', 'Add Par Level')}
        </button>
        <PrintButton onClick={onPrint} loading={printLoading} disabled={!hasItems} />
        <ExportButton
          onExport={onExport}
          loading={exportLoading}
          disabled={!hasItems}
          availableFormats={['csv', 'pdf', 'html']}
        />
      </div>
    </div>
  );
}
