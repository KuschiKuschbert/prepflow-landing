/**
 * Comprehensive Scraper Section Component
 * Modern, clean UI for comprehensive scraping progress
 */

'use client';

import { useState } from 'react';
import type { ComprehensiveScraperSectionProps } from './types';
import { useScraperDiagnostics } from './hooks/useScraperDiagnostics';
import { StatusIndicatorCard } from './components/StatusIndicatorCard';
import { ActionButtons } from './components/ActionButtons';
import { OverallProgressCard } from './components/OverallProgressCard';
import { PerSourceProgressGrid } from './components/PerSourceProgressGrid';
import { DiagnosticsPanel } from './components/DiagnosticsPanel';

export function ComprehensiveScraperSection({
  comprehensiveScraping,
  comprehensiveStatus,
  onStartComprehensive,
  onStopComprehensive,
  onResumeComprehensive,
  onRefreshStatus,
}: ComprehensiveScraperSectionProps) {
  const isRunning = comprehensiveScraping || (comprehensiveStatus?.isRunning ?? false);
  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const diagnostics = useScraperDiagnostics(comprehensiveStatus, isRunning);

  const handleConvertUnits = async (dryRun: boolean = false) => {
    setConverting(true);
    setConversionResult(null);
    try {
      const response = await fetch(`/api/recipe-scraper/convert-units${dryRun ? '?dry=1' : ''}`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        setConversionResult(
          dryRun
            ? `Dry run: Would convert ${result.data.convertedRecipes} recipes (${result.data.totalIngredientsConverted} ingredients)`
            : `✅ Converted ${result.data.convertedRecipes} recipes (${result.data.totalIngredientsConverted} ingredients)`,
        );
        if (!dryRun && onRefreshStatus) {
          // Refresh status after conversion
          setTimeout(() => {
            onRefreshStatus?.();
          }, 1000);
        }
      } else {
        setConversionResult(`Error: ${result.message || 'Conversion failed'}`);
      }
    } catch (error) {
      setConversionResult(`Error: ${error instanceof Error ? error.message : 'Conversion failed'}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="desktop:p-8 rounded-3xl border border-[#29E7CD]/20 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="desktop:text-3xl mb-2 text-2xl font-bold text-[var(--foreground)]">
          Comprehensive Database Scraping
        </h2>
        <p className="desktop:text-base text-sm text-[var(--foreground-muted)]">
          Scrape ALL recipes from AllRecipes, Food Network, Epicurious, Bon Appétit, Tasty, Serious
          Eats, Food52, Simply Recipes, Smitten Kitchen, The Kitchn, and Delish automatically.
        </p>
      </div>

      {/* Status Indicator Card */}
      {comprehensiveStatus && (
        <StatusIndicatorCard
          isRunning={isRunning}
          comprehensiveStatus={comprehensiveStatus}
          onStopComprehensive={onStopComprehensive}
          onResumeComprehensive={onResumeComprehensive}
          disabled={converting}
        />
      )}

      {/* Action Buttons */}
      <ActionButtons
        isRunning={isRunning}
        converting={converting}
        onStartComprehensive={onStartComprehensive}
        onStopComprehensive={onStopComprehensive}
        onRefreshStatus={onRefreshStatus}
        onConvertUnits={() => handleConvertUnits(false)}
      />

      {/* Conversion Result */}
      {conversionResult && (
        <div
          className={`mb-4 rounded-xl border p-4 ${
            conversionResult.startsWith('✅')
              ? 'border-green-500/50 bg-green-500/10 text-green-400'
              : conversionResult.startsWith('Dry run')
                ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10 text-[#29E7CD]'
                : 'border-[var(--color-error)]/50 bg-[var(--color-error)]/10 text-[var(--color-error)]'
          }`}
        >
          <div className="text-sm font-medium">{conversionResult}</div>
        </div>
      )}

      {/* Progress Dashboard */}
      {comprehensiveStatus && (
        <div className="space-y-6">
          {/* Overall Progress */}
          <OverallProgressCard comprehensiveStatus={comprehensiveStatus} />

          {/* Per-Source Progress */}
          <PerSourceProgressGrid sources={comprehensiveStatus.sources || {}} />

          {/* Diagnostics Panel */}
          {diagnostics && <DiagnosticsPanel diagnostics={diagnostics} />}
        </div>
      )}
    </div>
  );
}
