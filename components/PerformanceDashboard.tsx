'use client';

import { useState, useEffect } from 'react';
import { getQueryMetrics, getCacheStats } from '../lib/database-optimization';

interface PerformanceDashboardProps {
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
}

export default function PerformanceDashboard({ 
  enabled = true, 
  refreshInterval = 30000 
}: PerformanceDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [queryMetrics, setQueryMetrics] = useState<any[]>([]);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Load initial data
    loadPerformanceData();

    // Set up refresh interval
    const interval = setInterval(loadPerformanceData, refreshInterval);

    // Keyboard shortcut to toggle dashboard (Ctrl+Shift+P)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, refreshInterval, isVisible]);

  const loadPerformanceData = () => {
    // Load query metrics
    const queries = getQueryMetrics();
    setQueryMetrics(queries);

    // Load cache stats
    const stats = getCacheStats();
    setCacheStats(stats);

    // Load performance metrics from window
    if (typeof window !== 'undefined' && (window as any).prepflowMetrics) {
      setMetrics((window as any).prepflowMetrics);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg shadow-lg hover:bg-[#29E7CD]/80 transition-colors"
        >
          📊 Performance
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1f1f1f] rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">PrepFlow Performance Dashboard</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Core Web Vitals */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">LCP</h3>
                <div className="text-3xl font-bold text-[#29E7CD]">
                  {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">
                  {metrics.lcp && metrics.lcp < 2500 ? '✅ Good' : '⚠️ Needs improvement'}
                </div>
              </div>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">FID</h3>
                <div className="text-3xl font-bold text-[#29E7CD]">
                  {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">
                  {metrics.fid && metrics.fid < 100 ? '✅ Good' : '⚠️ Needs improvement'}
                </div>
              </div>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">CLS</h3>
                <div className="text-3xl font-bold text-[#29E7CD]">
                  {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">
                  {metrics.cls && metrics.cls < 0.1 ? '✅ Good' : '⚠️ Needs improvement'}
                </div>
              </div>
            </div>
          )}

          {/* Database Performance */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Database Performance</h3>
            
            {cacheStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Cache Entries</div>
                  <div className="text-xl font-bold text-white">{cacheStats.totalEntries}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Valid Entries</div>
                  <div className="text-xl font-bold text-[#29E7CD]">{cacheStats.validEntries}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Hit Rate</div>
                  <div className="text-xl font-bold text-white">
                    {(cacheStats.hitRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Avg Query Time</div>
                  <div className="text-xl font-bold text-white">
                    {cacheStats.averageQueryTime.toFixed(0)}ms
                  </div>
                </div>
              </div>
            )}

            {/* Recent Queries */}
            <div>
              <h4 className="text-md font-semibold text-white mb-2">Recent Queries</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {queryMetrics.slice(-10).map((query, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate flex-1 mr-4">
                      {query.query}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        query.cacheHit ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {query.cacheHit ? 'Cache' : 'DB'}
                      </span>
                      <span className="text-gray-400">
                        {query.duration.toFixed(0)}ms
                      </span>
                      <span className="text-gray-400">
                        {query.rowsReturned} rows
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Performance */}
          {metrics && metrics.resources && (
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Resource Performance</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Total Resources</div>
                  <div className="text-xl font-bold text-white">{metrics.resources.totalResources}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Slow Resources</div>
                  <div className="text-xl font-bold text-[#D925C7]">{metrics.resources.slowResources.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Avg Load Time</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.resources.averageLoadTime.toFixed(0)}ms
                  </div>
                </div>
              </div>

              {/* Slow Resources */}
              {metrics.resources.slowResources.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-white mb-2">Slow Resources</h4>
                  <div className="space-y-2">
                    {metrics.resources.slowResources.map((resource: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 truncate flex-1 mr-4">
                          {resource.name.split('/').pop()}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-400">{resource.type}</span>
                          <span className="text-[#D925C7]">{resource.duration}ms</span>
                          <span className="text-gray-400">
                            {(resource.size / 1024).toFixed(1)}KB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Network Information */}
          {metrics && metrics.network && (
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Network Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Connection Type</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.network.effectiveType || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Download Speed</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.network.downlink ? `${metrics.network.downlink} Mbps` : 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Round Trip Time</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.network.rtt ? `${metrics.network.rtt}ms` : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Memory Usage */}
          {metrics && metrics.memory && (
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Memory Usage</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Used JS Heap</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.memory.usedJSHeapSize ? 
                      `${(metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total JS Heap</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.memory.totalJSHeapSize ? 
                      `${(metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Heap Limit</div>
                  <div className="text-xl font-bold text-white">
                    {metrics.memory.jsHeapSizeLimit ? 
                      `${(metrics.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)} MB` : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 text-center text-sm text-gray-400">
          Press Ctrl+Shift+P to toggle this dashboard • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
