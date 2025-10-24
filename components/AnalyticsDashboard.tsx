'use client';

import React, { useState, useEffect } from 'react';
import { analytics, AnalyticsEvent, ConversionEvent, PerformanceMetrics } from '../lib/analytics';

interface AnalyticsDashboardProps {
  isVisible?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isVisible = false }) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [conversions, setConversions] = useState<ConversionEvent[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (isVisible) {
      const updateData = () => {
        setEvents(analytics.getEvents());
        setConversions(analytics.getConversions());
        setPerformance(analytics.getPerformance());
        setSessionId(analytics.getSessionId());
        setUserId(analytics.getUserId() || '');
      };

      updateData();
      const interval = setInterval(updateData, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const totalEvents = events.length;
  const totalConversions = conversions.length;
  const avgPageLoadTime =
    performance.length > 0
      ? performance.reduce((sum, p) => sum + p.pageLoadTime, 0) / performance.length
      : 0;

  const conversionRate =
    totalEvents > 0 ? ((totalConversions / totalEvents) * 100).toFixed(2) : '0';

  return (
    <div className="fixed right-4 bottom-4 z-50 max-h-96 w-96 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-2xl">
      <div className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] p-3">
        <h3 className="text-sm font-bold text-white">📊 PrepFlow Analytics Dashboard</h3>
      </div>

      <div className="max-h-80 space-y-4 overflow-y-auto p-4">
        {/* Session Info */}
        <div className="rounded-lg bg-gray-800 p-3">
          <h4 className="mb-2 text-sm font-semibold text-white">Session Info</h4>
          <div className="space-y-1 text-xs text-gray-300">
            <div>
              Session ID: <span className="font-mono text-[#29E7CD]">{sessionId.slice(-8)}</span>
            </div>
            <div>
              User ID: <span className="font-mono text-[#29E7CD]">{userId || 'Anonymous'}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <div className="text-2xl font-bold text-[#29E7CD]">{totalEvents}</div>
            <div className="text-xs text-gray-400">Total Events</div>
          </div>
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <div className="text-2xl font-bold text-[#D925C7]">{totalConversions}</div>
            <div className="text-xs text-gray-400">Conversions</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <div className="text-lg font-bold text-[#29E7CD]">{conversionRate}%</div>
            <div className="text-xs text-gray-400">Conversion Rate</div>
          </div>
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <div className="text-lg font-bold text-[#D925C7]">{avgPageLoadTime.toFixed(0)}ms</div>
            <div className="text-xs text-gray-400">Avg Load Time</div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="rounded-lg bg-gray-800 p-3">
          <h4 className="mb-2 text-sm font-semibold text-white">Recent Events</h4>
          <div className="max-h-32 space-y-2 overflow-y-auto">
            {events
              .slice(-5)
              .reverse()
              .map((event, index) => (
                <div key={index} className="rounded bg-gray-700 p-2 text-xs">
                  <div className="font-medium text-[#29E7CD]">{event.action}</div>
                  <div className="text-gray-400">{event.category}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Conversions */}
        <div className="rounded-lg bg-gray-800 p-3">
          <h4 className="mb-2 text-sm font-semibold text-white">Recent Conversions</h4>
          <div className="max-h-32 space-y-2 overflow-y-auto">
            {conversions
              .slice(-3)
              .reverse()
              .map((conversion, index) => (
                <div
                  key={index}
                  className="rounded border border-green-700/50 bg-green-900/30 p-2 text-xs"
                >
                  <div className="font-medium text-green-400">{conversion.type}</div>
                  <div className="text-gray-400">{conversion.element}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(conversion.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Export Data */}
        <div className="rounded-lg bg-gray-800 p-3">
          <button
            onClick={() => {
              const data = analytics.exportData();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `prepflow-analytics-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full rounded bg-[#29E7CD] px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-[#29E7CD]/80"
          >
            📥 Export Analytics Data
          </button>
        </div>
      </div>
    </div>
  );
};
