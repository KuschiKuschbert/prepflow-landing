'use client';

interface PerformanceActionsProps {
  showImportModal: boolean;
  showCharts: boolean;
  realtimeEnabled: boolean;
  onImportClick: () => void;
  onExportCSV: () => void;
  onToggleCharts: () => void;
  onToggleRealtime: () => void;
}

export default function PerformanceActions({
  showImportModal,
  showCharts,
  realtimeEnabled,
  onImportClick,
  onExportCSV,
  onToggleCharts,
  onToggleRealtime,
}: PerformanceActionsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3 sm:gap-4">
      <button
        onClick={onImportClick}
        className="flex min-h-[44px] items-center gap-2 rounded-lg bg-[#29E7CD] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-[#29E7CD]/80 sm:px-6 sm:text-base"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline">Import Sales Data</span>
        <span className="sm:hidden">Import</span>
      </button>
      <button
        onClick={onExportCSV}
        className="flex min-h-[44px] items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3B82F6]/80 sm:px-6 sm:text-base"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline">Export CSV</span>
        <span className="sm:hidden">Export</span>
      </button>
      <button
        onClick={onToggleCharts}
        className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gray-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 sm:px-6 sm:text-base"
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
        <span className="hidden sm:inline">{showCharts ? 'Hide Charts' : 'Show Charts'}</span>
        <span className="sm:hidden">{showCharts ? 'Hide' : 'Charts'}</span>
      </button>
      <button
        onClick={onToggleRealtime}
        className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors sm:px-6 sm:text-base ${
          realtimeEnabled
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        <div
          className={`h-3 w-3 rounded-full ${
            realtimeEnabled ? 'animate-pulse bg-green-400' : 'bg-gray-400'
          }`}
        ></div>
        <span className="hidden sm:inline">
          {realtimeEnabled ? 'Disable Real-time' : 'Enable Real-time'}
        </span>
        <span className="sm:hidden">{realtimeEnabled ? 'Disable' : 'Real-time'}</span>
      </button>
    </div>
  );
}
