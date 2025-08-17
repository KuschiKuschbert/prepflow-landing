'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getActiveExperiments, getExperimentInfo } from '../../lib/experiment';

interface ExperimentData {
  variant: string;
  impressions: number;
  primary_cta_clicks: number;
  purchase_completes: number;
  hero_cta_clicks: number;
  scroll_50: number;
  outbound_click_gumroad: number;
}

interface DashboardData {
  [variant: string]: ExperimentData;
}

export default function ExperimentsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [dateRange, setDateRange] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const experiments = getActiveExperiments();
  const currentExperiment = experiments.landing_ab_001;

  useEffect(() => {
    // In a real implementation, this would fetch data from PostHog or local storage
    // For now, we'll use mock data to demonstrate the dashboard
    const mockData: DashboardData = {
      control: {
        variant: 'control',
        impressions: 1250,
        primary_cta_clicks: 187,
        purchase_completes: 23,
        hero_cta_clicks: 89,
        scroll_50: 625,
        outbound_click_gumroad: 45
      },
      v1: {
        variant: 'v1',
        impressions: 1230,
        primary_cta_clicks: 215,
        purchase_completes: 28,
        hero_cta_clicks: 102,
        scroll_50: 615,
        outbound_click_gumroad: 52
      },
      v2: {
        variant: 'v2',
        impressions: 1240,
        primary_cta_clicks: 198,
        purchase_completes: 25,
        hero_cta_clicks: 95,
        scroll_50: 620,
        outbound_click_gumroad: 48
      },
      v3: {
        variant: 'v3',
        impressions: 1220,
        primary_cta_clicks: 231,
        purchase_completes: 31,
        hero_cta_clicks: 108,
        scroll_50: 610,
        outbound_click_gumroad: 58
      }
    };

    setDashboardData(mockData);
    setIsLoading(false);
  }, [dateRange]);

  // Calculate conversion rates
  const calculateConversionRate = (clicks: number, impressions: number): number => {
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  };

  // Calculate statistical significance using Wilson interval
  const calculateWilsonInterval = (clicks: number, impressions: number, confidence = 0.95): [number, number] => {
    if (impressions === 0) return [0, 0];
    
    const z = 1.96; // 95% confidence
    const p = clicks / impressions;
    const denominator = 1 + z * z / impressions;
    const centre_adjusted_probability = (p + z * z / (2 * impressions)) / denominator;
    const adjusted_standard_error = z * Math.sqrt((p * (1 - p) + z * z / (4 * impressions)) / impressions) / denominator;
    
    const lower_bound = Math.max(0, centre_adjusted_probability - adjusted_standard_error);
    const upper_bound = Math.min(1, centre_adjusted_probability + adjusted_standard_error);
    
    return [lower_bound * 100, upper_bound * 100];
  };

  // Check if difference is statistically significant
  const isSignificant = (controlRate: number, variantRate: number, controlCI: [number, number]): boolean => {
    const [controlLower, controlUpper] = controlCI;
    return variantRate < controlLower || variantRate > controlUpper;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29E7CD] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading experiment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading experiment data</p>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  const controlData = dashboardData.control;
  const controlCTARate = calculateConversionRate(controlData.primary_cta_clicks, controlData.impressions);
  const controlCTACI = calculateWilsonInterval(controlData.primary_cta_clicks, controlData.impressions);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Image 
            src="/images/prepflow-logo.png" 
            alt="PrepFlow Logo"
            className="h-12 w-auto"
            priority
            width={48}
            height={48}
          />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
            PrepFlow Experiments
          </span>
        </div>
        <Link href="/" className="text-gray-300 hover:text-[#29E7CD] transition-colors">
          ← Back to Landing Page
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Experiment Status */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Landing Page A/B Test</h1>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-lg font-semibold">Dec 2024</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
              <p className="text-sm text-gray-400">Total Impressions</p>
              <p className="text-lg font-semibold">
                {Object.values(dashboardData).reduce((sum, data) => sum + data.impressions, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
              <p className="text-sm text-gray-400">Traffic Split</p>
              <p className="text-lg font-semibold">25% each</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
              <p className="text-sm text-gray-400">Status</p>
              <p className="text-lg font-semibold text-[#29E7CD]">Active</p>
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
            className="bg-[#1f1f1f] border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {/* Variant Performance Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Variant Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-300 font-medium">Variant</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Impressions</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Primary CTA Clicks</th>
                  <th className="text-left p-4 text-gray-300 font-medium">CTR</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Purchases</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Conversion Rate</th>
                  <th className="text-left p-4 text-gray-300 font-medium">95% CI</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Significance</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(dashboardData).map((data) => {
                  const ctr = calculateConversionRate(data.primary_cta_clicks, data.impressions);
                  const purchaseRate = calculateConversionRate(data.purchase_completes, data.impressions);
                  const ci = calculateWilsonInterval(data.primary_cta_clicks, data.impressions);
                  const significant = data.variant !== 'control' && isSignificant(controlCTARate, ctr, controlCTACI);
                  
                  return (
                    <tr key={data.variant} className="border-b border-gray-700">
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          data.variant === 'control' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-[#29E7CD]/20 text-[#29E7CD]'
                        }`}>
                          {data.variant === 'control' ? 'Control' : `Variant ${data.variant.slice(1)}`}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{data.impressions.toLocaleString()}</td>
                      <td className="p-4 text-gray-300">{data.primary_cta_clicks}</td>
                      <td className="p-4 text-gray-300">{ctr.toFixed(2)}%</td>
                      <td className="p-4 text-gray-300">{data.purchase_completes}</td>
                      <td className="p-4 text-gray-300">{purchaseRate.toFixed(2)}%</td>
                      <td className="p-4 text-gray-300">
                        {ci[0].toFixed(2)}% - {ci[1].toFixed(2)}%
                      </td>
                      <td className="p-4">
                        {data.variant === 'control' ? (
                          <span className="text-gray-400">Baseline</span>
                        ) : significant ? (
                          <span className="text-green-400 font-medium">Significant</span>
                        ) : (
                          <span className="text-yellow-400">Not significant</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Conversion Funnel</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {Object.values(dashboardData).map((data) => {
              const funnel = [
                { label: 'Impressions', value: data.impressions, color: 'bg-gray-600' },
                { label: 'Primary CTA Clicks', value: data.primary_cta_clicks, color: 'bg-[#29E7CD]' },
                { label: 'Gumroad Clicks', value: data.outbound_click_gumroad, color: 'bg-[#D925C7]' },
                { label: 'Purchases', value: data.purchase_completes, color: 'bg-[#3B82F6]' }
              ];

              return (
                <div key={data.variant} className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    data.variant === 'control' ? 'text-gray-300' : 'text-[#29E7CD]'
                  }`}>
                    {data.variant === 'control' ? 'Control' : `Variant ${data.variant.slice(1)}`}
                  </h3>
                  {funnel.map((step, index) => (
                    <div key={step.label} className="text-center">
                      <div className={`w-full h-4 rounded-full ${step.color} mb-2`}></div>
                      <p className="text-sm text-gray-400">{step.label}</p>
                      <p className="text-lg font-semibold text-white">{step.value.toLocaleString()}</p>
                      {index > 0 && (
                        <p className="text-xs text-gray-500">
                          {((step.value / funnel[index - 1].value) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Experiment Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Experiment Details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
              <h3 className="text-lg font-semibold mb-4">Hypothesis</h3>
              <p className="text-gray-300 mb-4">
                Testing different hero section approaches to improve primary CTA conversion rates:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>V1:</strong> Clarity-first with simplified messaging</li>
                <li>• <strong>V2:</strong> Trust-first with social proof above fold</li>
                <li>• <strong>V3:</strong> Action-first with pricing and risk reduction</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
              <h3 className="text-lg font-semibold mb-4">Success Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Primary CTA click rate</li>
                <li>• Purchase conversion rate</li>
                <li>• Hero CTA engagement</li>
                <li>• Scroll depth (50%)</li>
                <li>• Gumroad outbound clicks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
          <div className="p-6 rounded-xl border border-gray-700 bg-[#1f1f1f]/80">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#29E7CD] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Current Status</h3>
                <p className="text-gray-300 mb-4">
                  The experiment is currently running with all variants showing promising results. 
                  V3 (Action-first) is showing the highest primary CTA click rate at {dashboardData.v3?.primary_cta_clicks} clicks 
                  from {dashboardData.v3?.impressions} impressions.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-[#29E7CD]/10 border border-[#29E7CD]/30">
                    <p className="text-sm font-semibold text-[#29E7CD] mb-1">Best Performer</p>
                    <p className="text-white">V3 (Action-first)</p>
                    <p className="text-xs text-gray-400">Highest CTA click rate</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#D925C7]/10 border border-[#D925C7]/30">
                    <p className="text-sm font-semibold text-[#D925C7] mb-1">Next Steps</p>
                    <p className="text-white">Continue monitoring</p>
                    <p className="text-xs text-gray-400">Collect more data for significance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
