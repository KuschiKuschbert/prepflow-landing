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
  onToggleRealtime
}: PerformanceActionsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={onImportClick}
        className="bg-[#29E7CD] hover:bg-[#29E7CD]/80 text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
        </svg>
        Import Sales Data
      </button>
      <button
        onClick={onExportCSV}
        className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
        </svg>
        Export CSV
      </button>
      <button
        onClick={onToggleCharts}
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d={showCharts ? "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" : "M10 12a2 2 0 100-4 2 2 0 000 4zM3.05 13a1 1 0 011.414 0L9 16.536V19a1 1 0 11-2 0v-2.464L4.464 13a1 1 0 010-1.414zM16.95 7a1 1 0 010 1.414L14.536 10H17a1 1 0 110 2h-2.464l2.414 2.414a1 1 0 11-1.414 1.414L12 13.414V16a1 1 0 11-2 0v-2.586l-2.414 2.414a1 1 0 11-1.414-1.414L10.536 12H8a1 1 0 110-2h2.536L8.122 7.586a1 1 0 111.414-1.414L12 8.586V6a1 1 0 112 0v2.586l2.414-2.414A1 1 0 0116.95 7z"}/>
        </svg>
        {showCharts ? 'Hide Charts' : 'Show Charts'}
      </button>
      <button
        onClick={onToggleRealtime}
        className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          realtimeEnabled
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        <div className={`w-3 h-3 rounded-full ${
          realtimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`}></div>
        {realtimeEnabled ? 'Disable Real-time' : 'Enable Real-time'}
      </button>
    </div>
  );
}
