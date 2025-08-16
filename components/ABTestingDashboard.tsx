'use client';

import React, { useState } from 'react';
import { useExperimentStats } from '../lib/hooks/useABTest';
import { getActiveExperiments } from '../lib/ab-testing';
import type { ExperimentConfig } from '../lib/ab-testing';

export default function ABTestingDashboard() {
  const [selectedExperiment, setSelectedExperiment] = useState<string>('');
  const activeExperiments = getActiveExperiments();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔬 A/B Testing Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Monitor and analyze your A/B test performance in real-time
        </p>

        {/* Experiment Selector */}
        <div className="mb-6">
          <label htmlFor="experiment-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Experiment
          </label>
          <select
            id="experiment-select"
            value={selectedExperiment}
            onChange={(e) => setSelectedExperiment(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose an experiment...</option>
            {activeExperiments.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Experiments Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {activeExperiments.map((experiment) => (
            <ExperimentCard 
              key={experiment.id} 
              experiment={experiment}
              isSelected={selectedExperiment === experiment.id}
              onSelect={() => setSelectedExperiment(experiment.id)}
            />
          ))}
        </div>

        {/* Selected Experiment Stats */}
        {selectedExperiment && (
          <ExperimentStats experimentId={selectedExperiment} />
        )}
      </div>
    </div>
  );
}

function ExperimentCard({ 
  experiment, 
  isSelected, 
  onSelect 
}: { 
  experiment: ExperimentConfig; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  return (
    <div 
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <h3 className="font-semibold text-gray-900 mb-2">{experiment.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{experiment.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {experiment.variants.length} variants
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          experiment.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {experiment.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Traffic: {experiment.trafficSplit}% | 
        Min Sample: {experiment.minimumSampleSize.toLocaleString()}
      </div>
    </div>
  );
}

function ExperimentStats({ experimentId }: { experimentId: string }) {
  const { stats, isLoading } = useExperimentStats(experimentId);

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading experiment statistics...</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No data available for this experiment yet.</p>
      </div>
    );
  }

  const totalImpressions = stats.reduce((sum, stat) => sum + stat.impressions, 0);
  const totalConversions = stats.reduce((sum, stat) => sum + stat.conversions, 0);
  const overallConversionRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Results</h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{totalImpressions.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Impressions</div>
        </div>
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{totalConversions.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Conversions</div>
        </div>
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{overallConversionRate.toFixed(2)}%</div>
          <div className="text-sm text-gray-600">Overall Rate</div>
        </div>
      </div>

      {/* Variant Comparison */}
      <div className="space-y-4">
        {stats.map((stat) => (
          <VariantStatRow key={stat.variantId} stat={stat} />
        ))}
      </div>

      {/* Statistical Significance */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Statistical Significance</h4>
        <p className="text-sm text-blue-700">
          Results are considered statistically significant when confidence level reaches 95% or higher.
          {stats.some(s => s.isWinner) && (
            <span className="block mt-2 font-medium">
              🎉 Winner identified: {stats.find(s => s.isWinner)?.variantId}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function VariantStatRow({ stat }: { stat: any }) {
  const confidenceColor = stat.confidence >= 0.95 ? 'text-green-600' : 
                         stat.confidence >= 0.8 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">
          {stat.variantId}
          {stat.isWinner && <span className="ml-2 text-green-600">🏆</span>}
        </h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          stat.isWinner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {stat.isWinner ? 'Winner' : 'Testing'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Impressions</div>
          <div className="font-medium">{stat.impressions.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500">Conversions</div>
          <div className="font-medium">{stat.conversions.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500">Rate</div>
          <div className="font-medium">{stat.conversionRate.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-gray-500">Confidence</div>
          <div className={`font-medium ${confidenceColor}`}>
            {(stat.confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
