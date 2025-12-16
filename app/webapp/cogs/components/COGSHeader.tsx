'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import { useState } from 'react';
import { PageHeader } from '../../components/static/PageHeader';
import { Calculator, Lightbulb } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { PrintButton } from '@/components/ui/PrintButton';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { printCOGSAnalysis } from '../utils/printCOGSAnalysis';
import {
  exportCOGSAnalysisToCSV,
  exportCOGSAnalysisToHTML,
  exportCOGSAnalysisToPDF,
} from '../utils/exportCOGSAnalysis';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { Recipe, COGSCalculation } from '../types';

interface COGSHeaderProps {
  recipe: Recipe | null;
  calculations: COGSCalculation[];
  totalCOGS: number;
  costPerPortion: number;
  dishPortions: number;
}

export function COGSHeader({
  recipe,
  calculations,
  totalCOGS,
  costPerPortion,
  dishPortions,
}: COGSHeaderProps) {
  const [showGuide, setShowGuide] = useState(false);
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const handlePrint = () => {
    if (!recipe || calculations.length === 0) {
      showError('No COGS data to print. Please select a recipe and add ingredients.');
      return;
    }

    setPrintLoading(true);
    try {
      printCOGSAnalysis({ recipe, calculations, totalCOGS, costPerPortion, dishPortions });
      showSuccess('COGS analysis opened for printing');
    } catch (error) {
      logger.error('Failed to print COGS analysis:', error);
      showError('Failed to print COGS analysis');
    } finally {
      setPrintLoading(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!recipe || calculations.length === 0) {
      showError('No COGS data to export. Please select a recipe and add ingredients.');
      return;
    }

    setExportLoading(format);
    try {
      switch (format) {
        case 'csv':
          exportCOGSAnalysisToCSV(calculations, totalCOGS, costPerPortion);
          showSuccess('COGS analysis exported to CSV');
          break;
        case 'html':
          exportCOGSAnalysisToHTML(calculations, totalCOGS, costPerPortion);
          showSuccess('COGS analysis exported to HTML');
          break;
        case 'pdf':
          await exportCOGSAnalysisToPDF(calculations, totalCOGS, costPerPortion);
          showSuccess('COGS analysis exported to PDF');
          break;
      }
    } catch (error) {
      logger.error(`Failed to export COGS analysis to ${format}:`, error);
      showError(`Failed to export COGS analysis to ${format.toUpperCase()}`);
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="mb-8">
      <PageHeader
        title="COGS Calculator"
        subtitle="Calculate Cost of Goods Sold and optimize your profit margins"
        icon={Calculator}
        actions={
          <div className="flex items-center gap-2">
            <PrintButton
              onClick={handlePrint}
              loading={printLoading}
              disabled={!recipe || calculations.length === 0}
              size="sm"
              variant="secondary"
            />
            <ExportButton
              onExport={handleExport}
              loading={exportLoading}
              disabled={!recipe || calculations.length === 0}
              availableFormats={['csv', 'pdf', 'html']}
              size="sm"
              variant="secondary"
            />
            <HelpTooltip content={getHelpText('cogs', true, true)} title="What is COGS?" />
          </div>
        }
      />

      <div className="rounded-3xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/10 to-[#3B82F6]/10 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--button-active-text)]">
            <Icon icon={Lightbulb} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
            Why COGS Matters
          </h2>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-[var(--primary)] hover:underline"
          >
            {showGuide ? 'Hide' : 'Show'} Workflow Guide
          </button>
        </div>
        <p className="text-[var(--foreground-secondary)]">
          COGS (Cost of Goods Sold) is the actual cost of ingredients for one serving. Knowing your
          COGS helps you set menu prices that cover costs and make profit. Without accurate COGS,
          you might be losing money on every dish you sell.
        </p>

        {showGuide && (
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Step-by-Step Workflow:</h3>
            <ol className="space-y-2 text-sm text-[var(--foreground-secondary)]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[var(--primary)]">1.</span>
                <span>
                  <strong>Dish Name:</strong> Enter the name of your dish (or select an existing
                  recipe)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[var(--primary)]">2.</span>
                <span>
                  <strong>Portions:</strong> Set how many servings this recipe makes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[var(--primary)]">3.</span>
                <span>
                  <strong>Add Ingredients:</strong> Add all ingredients with their quantities
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[var(--primary)]">4.</span>
                <span>
                  <strong>Calculate:</strong> See your total COGS and cost per portion
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[var(--primary)]">5.</span>
                <span>
                  <strong>Set Price:</strong> Use the pricing tool to set your menu price based on
                  target profit margin
                </span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
