'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import { useState } from 'react';
import { PageHeader } from '../../components/static/PageHeader';

export function DishCogsHeader() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="mb-8">
      <PageHeader
        title="Dish COGS Calculator"
        subtitle="Calculate Cost of Goods Sold for dishes combining multiple recipes and ingredients"
        icon="🍽️"
        actions={<HelpTooltip content={getHelpText('cogs', true, true)} title="What is COGS?" />}
      />

      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/10 to-[#3B82F6]/10 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">💡 Dish COGS Calculator</h2>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-[#29E7CD] hover:underline"
          >
            {showGuide ? 'Hide' : 'Show'} Workflow Guide
          </button>
        </div>
        <p className="text-gray-300">
          Calculate the total COGS for dishes that combine multiple recipes and standalone
          ingredients. See the complete cost breakdown and optimize your pricing for maximum
          profitability.
        </p>

        {showGuide && (
          <div className="mt-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Step-by-Step Workflow:</h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">1.</span>
                <span>
                  <strong>Select Dish:</strong> Choose a dish from your recipe book (or create a new
                  one)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">2.</span>
                <span>
                  <strong>View Breakdown:</strong> See all recipes and ingredients with their costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">3.</span>
                <span>
                  <strong>Calculate:</strong> See your total COGS and cost per dish
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">4.</span>
                <span>
                  <strong>Optimize Price:</strong> Use the pricing tool to set optimal selling price
                </span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
