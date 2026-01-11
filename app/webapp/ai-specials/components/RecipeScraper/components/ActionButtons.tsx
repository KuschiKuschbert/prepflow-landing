/**
 * Action Buttons Component
 * Displays action buttons for scraper control
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Download, Gauge, Loader2, RefreshCw, Square } from 'lucide-react';

interface ActionButtonsProps {
  isRunning: boolean;
  converting: boolean;
  onStartComprehensive: () => void;
  onStopComprehensive?: () => void;
  onRefreshStatus?: () => void;
  onConvertUnits: () => void;
}

export function ActionButtons({
  isRunning,
  converting,
  onStartComprehensive,
  onStopComprehensive,
  onRefreshStatus,
  onConvertUnits,
}: ActionButtonsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        onClick={onStartComprehensive}
        disabled={isRunning || converting}
        className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRunning ? (
          <>
            <Icon icon={Loader2} className="mr-2 inline animate-spin" aria-hidden={true} />
            Scraping in Progress...
          </>
        ) : (
          <>
            <Icon icon={Download} className="mr-2 inline" aria-hidden={true} />
            Start Comprehensive Scrape
          </>
        )}
      </button>
      {onStopComprehensive && (
        <button
          onClick={onStopComprehensive}
          disabled={!isRunning || converting}
          className="rounded-xl border-2 border-[var(--color-error)] bg-transparent px-6 py-3 font-semibold text-[var(--color-error)] transition-all hover:bg-[var(--color-error)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon icon={Square} className="mr-2 inline" aria-hidden={true} />
          Stop Scraping
        </button>
      )}
      {onRefreshStatus && (
        <button
          onClick={onRefreshStatus}
          disabled={converting}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
          title="Refresh scraper status"
        >
          <Icon icon={RefreshCw} className="inline" aria-hidden={true} />
        </button>
      )}
      <button
        onClick={onConvertUnits}
        disabled={converting || isRunning}
        className="rounded-xl border border-[#29E7CD]/50 bg-[#29E7CD]/10 px-6 py-3 font-semibold text-[#29E7CD] transition-all hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
        title="Convert all recipes to Australian units (ml, l, gm, kg)"
      >
        {converting ? (
          <>
            <Icon icon={Loader2} className="mr-2 inline animate-spin" aria-hidden={true} />
            Converting...
          </>
        ) : (
          <>
            <Icon icon={Gauge} className="mr-2 inline" aria-hidden={true} />
            Convert to Australian Units
          </>
        )}
      </button>
    </div>
  );
}
