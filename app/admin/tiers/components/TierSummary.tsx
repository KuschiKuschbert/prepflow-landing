'use client';

import type { TierConfiguration } from '../types';

interface TierSummaryProps {
  tier: TierConfiguration;
}

export function TierSummary({ tier }: TierSummaryProps) {
  const featureCount = Object.values(tier.features).filter(Boolean).length;
  const totalFeatures = Object.keys(tier.features).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="mb-1 text-xs text-gray-500">Monthly Price</p>
          <p className="font-semibold text-white">
            {tier.price_monthly ? `$${tier.price_monthly.toFixed(2)}` : 'Not set'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500">Yearly Price</p>
          <p className="font-semibold text-white">
            {tier.price_yearly ? `$${tier.price_yearly.toFixed(2)}` : 'Not set'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500">Features</p>
          <p className="font-semibold text-white">
            {featureCount} / {totalFeatures}
          </p>
        </div>
      </div>

      {tier.limits.recipes !== undefined || tier.limits.ingredients !== undefined ? (
        <div>
          <p className="mb-1 text-xs text-gray-500">Limits</p>
          <div className="flex gap-4 text-sm text-gray-300">
            {tier.limits.recipes !== undefined && <span>Recipes: {tier.limits.recipes}</span>}
            {tier.limits.ingredients !== undefined && (
              <span>Ingredients: {tier.limits.ingredients}</span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400">Unlimited recipes and ingredients</p>
      )}
    </div>
  );
}
