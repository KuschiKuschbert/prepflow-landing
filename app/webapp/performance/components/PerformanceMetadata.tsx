'use client';

import { PerformanceMetadata as PerformanceMetadataType } from '../types';

interface PerformanceMetadataProps {
  metadata: PerformanceMetadataType | null;
}

export default function PerformanceMetadata({ metadata }: PerformanceMetadataProps) {
  if (!metadata) return null;

  return (
    <div className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">PrepFlow COGS Dynamic Methodology</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="text-center">
          <div className="mb-1 text-sm text-gray-400">Methodology</div>
          <div className="text-lg font-semibold text-[#29E7CD]">{metadata.methodology}</div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-sm text-gray-400">Average Profit Margin</div>
          <div className="text-lg font-semibold text-white">
            {metadata.averageProfitMargin?.toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-sm text-gray-400">Average Popularity</div>
          <div className="text-lg font-semibold text-white">
            {metadata.averagePopularity?.toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-sm text-gray-400">Popularity Threshold</div>
          <div className="text-lg font-semibold text-[#D925C7]">
            {metadata.popularityThreshold?.toFixed(1)}%
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-300">
        <p>
          <strong>Profit Check:</strong> HIGH if above menu average (
          {metadata.averageProfitMargin?.toFixed(1)}%), LOW if below
        </p>
        <p>
          <strong>Popularity Check:</strong> HIGH if ≥ 80% of average popularity (
          {metadata.popularityThreshold?.toFixed(1)}%), LOW if below
        </p>
      </div>
    </div>
  );
}
