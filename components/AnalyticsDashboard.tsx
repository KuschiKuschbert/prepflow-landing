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
  const avgPageLoadTime = performance.length > 0 
    ? performance.reduce((sum, p) => sum + p.pageLoadTime, 0) / performance.length 
    : 0;

  const conversionRate = totalEvents > 0 ? (totalConversions / totalEvents * 100).toFixed(2) : '0';

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] p-3">
        <h3 className="text-white font-bold text-sm">📊 PrepFlow Analytics Dashboard</h3>
      </div>
      
      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Session Info */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-white font-semibold text-sm mb-2">Session Info</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>Session ID: <span className="font-mono text-[#29E7CD]">{sessionId.slice(-8)}</span></div>
            <div>User ID: <span className="font-mono text-[#29E7CD]">{userId || 'Anonymous'}</span></div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-[#29E7CD]">{totalEvents}</div>
            <div className="text-xs text-gray-400">Total Events</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-[#D925C7]">{totalConversions}</div>
            <div className="text-xs text-gray-400">Conversions</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-[#29E7CD]">{conversionRate}%</div>
            <div className="text-xs text-gray-400">Conversion Rate</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-[#D925C7]">{avgPageLoadTime.toFixed(0)}ms</div>
            <div className="text-xs text-gray-400">Avg Load Time</div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-white font-semibold text-sm mb-2">Recent Events</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events.slice(-5).reverse().map((event, index) => (
              <div key={index} className="text-xs bg-gray-700 p-2 rounded">
                <div className="text-[#29E7CD] font-medium">{event.action}</div>
                <div className="text-gray-400">{event.category}</div>
                <div className="text-gray-500 text-xs">{new Date(event.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversions */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-white font-semibold text-sm mb-2">Recent Conversions</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {conversions.slice(-3).reverse().map((conversion, index) => (
              <div key={index} className="text-xs bg-green-900/30 p-2 rounded border border-green-700/50">
                <div className="text-green-400 font-medium">{conversion.type}</div>
                <div className="text-gray-400">{conversion.element}</div>
                <div className="text-gray-500 text-xs">{new Date(conversion.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-gray-800 p-3 rounded-lg">
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
            className="w-full bg-[#29E7CD] text-gray-900 px-3 py-2 rounded text-sm font-medium hover:bg-[#29E7CD]/80 transition-colors"
          >
            📥 Export Analytics Data
          </button>
        </div>
      </div>
    </div>
  );
};
