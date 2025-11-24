'use client';

import { LANDING_COLORS } from '@/lib/landing-styles';

interface PerformanceActionsProps {
  showImportModal: boolean;
  showCharts: boolean;
  onImportClick: () => void;
  onExportCSV: () => void;
  onToggleCharts: () => void;
}

export default function PerformanceActions({
  showImportModal,
  showCharts,
  onImportClick,
  onExportCSV,
  onToggleCharts,
}: PerformanceActionsProps) {
  return (
    <div className="tablet:gap-4 desktop:mb-6 mb-4 flex flex-wrap gap-3">
      <button
        onClick={onImportClick}
        className="tablet:w-auto tablet:px-6 tablet:text-base flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-black transition-colors"
        style={{
          backgroundColor: LANDING_COLORS.primary,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = `${LANDING_COLORS.primary}CC`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = LANDING_COLORS.primary;
        }}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="tablet:inline hidden">Import Sales Data</span>
        <span className="tablet:hidden">Import</span>
      </button>
      <button
        onClick={onExportCSV}
        className="tablet:w-auto tablet:px-6 tablet:text-base flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors"
        style={{
          backgroundColor: LANDING_COLORS.secondary,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = `${LANDING_COLORS.secondary}CC`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = LANDING_COLORS.secondary;
        }}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="tablet:inline hidden">Export CSV</span>
        <span className="tablet:hidden">Export</span>
      </button>
      <button
        onClick={onToggleCharts}
        className="tablet:w-auto tablet:px-6 tablet:text-base flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-gray-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d={
              showCharts
                ? 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'
                : 'M10 12a2 2 0 100-4 2 2 0 000 4zM3.05 13a1 1 0 011.414 0L9 16.536V19a1 1 0 11-2 0v-2.464L4.464 13a1 1 0 010-1.414zM16.95 7a1 1 0 010 1.414L14.536 10H17a1 1 0 110 2h-2.464l2.414 2.414a1 1 0 11-1.414 1.414L12 13.414V16a1 1 0 11-2 0v-2.586l-2.414 2.414a1 1 0 11-1.414-1.414L10.536 12H8a1 1 0 110-2h2.536L8.122 7.586a1 1 0 111.414-1.414L12 8.586V6a1 1 0 112 0v2.586l2.414-2.414A1 1 0 0116.95 7z'
            }
          />
        </svg>
        <span className="tablet:inline hidden">{showCharts ? 'Hide Charts' : 'Show Charts'}</span>
        <span className="tablet:hidden">{showCharts ? 'Hide' : 'Charts'}</span>
      </button>
    </div>
  );
}
