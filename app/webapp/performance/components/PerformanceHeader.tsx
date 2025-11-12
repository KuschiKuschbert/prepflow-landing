'use client';

import { PageHeader } from '../../components/static/PageHeader';
import { PerformanceAlert } from '../types';
import { BarChart3 } from 'lucide-react';

interface PerformanceHeaderProps {
  performanceScore: number;
  realtimeEnabled: boolean;
  lastUpdate: Date | null;
  performanceAlerts: PerformanceAlert[];
}

export default function PerformanceHeader({
  performanceScore,
  realtimeEnabled,
  lastUpdate,
  performanceAlerts,
}: PerformanceHeaderProps) {
  const performanceScoreColor =
    performanceScore >= 90
      ? 'text-green-400'
      : performanceScore >= 70
        ? 'text-yellow-400'
        : 'text-red-400';

  const metrics = (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="text-sm text-gray-400">Performance Score</div>
        <div className={`text-2xl font-bold ${performanceScoreColor}`}>{performanceScore}/100</div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${realtimeEnabled ? 'animate-pulse bg-green-400' : 'bg-gray-400'}`}
        />
        <span className="text-sm text-gray-300">{realtimeEnabled ? 'Live' : 'Offline'}</span>
      </div>
      {lastUpdate && (
        <div className="text-right">
          <div className="text-xs text-gray-400">Last Update</div>
          <div className="text-xs text-gray-300">{lastUpdate.toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-8">
      <PageHeader
        title="Performance Analysis"
        subtitle="Analyze your menu performance and profitability"
        icon={BarChart3}
        actions={metrics}
      />

      {performanceAlerts.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-yellow-400">Performance Alerts</span>
          </div>
          <div className="space-y-1">
            {performanceAlerts.slice(-3).map(alert => (
              <div key={alert.id} className="text-sm text-yellow-300">
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
