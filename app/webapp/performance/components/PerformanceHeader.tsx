'use client';

import { PerformanceAlert } from '../types';

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
  performanceAlerts
}: PerformanceHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Performance Analysis
          </h1>
          <p className="text-gray-300 text-lg">
            Analyze your menu performance and profitability
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Performance Score</div>
            <div className={`text-2xl font-bold ${
              performanceScore >= 90 ? 'text-green-400' :
              performanceScore >= 70 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {performanceScore}/100
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              realtimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-300">
              {realtimeEnabled ? 'Live' : 'Offline'}
            </span>
          </div>
          {lastUpdate && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Last Update</div>
              <div className="text-xs text-gray-300">
                {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
      {performanceAlerts.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span className="text-yellow-400 font-medium">Performance Alerts</span>
          </div>
          <div className="space-y-1">
            {performanceAlerts.slice(-3).map((alert) => (
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
