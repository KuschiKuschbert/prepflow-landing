'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import { useState } from 'react';
import { PageHeader } from '../../components/static/PageHeader';
import { Calculator, Lightbulb } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export function COGSHeader() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="mb-8">
      <PageHeader
        title="COGS Calculator"
        subtitle="Calculate Cost of Goods Sold and optimize your profit margins"
        icon={Calculator}
        actions={<HelpTooltip content={getHelpText('cogs', true, true)} title="What is COGS?" />}
      />

      <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/10 to-[#3B82F6]/10 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Icon icon={Lightbulb} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            Why COGS Matters
          </h2>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-[#29E7CD] hover:underline"
          >
            {showGuide ? 'Hide' : 'Show'} Workflow Guide
          </button>
        </div>
        <p className="text-gray-300">
          COGS (Cost of Goods Sold) is the actual cost of ingredients for one serving. Knowing your
          COGS helps you set menu prices that cover costs and make profit. Without accurate COGS,
          you might be losing money on every dish you sell.
        </p>

        {showGuide && (
          <div className="mt-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Step-by-Step Workflow:</h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">1.</span>
                <span>
                  <strong>Dish Name:</strong> Enter the name of your dish (or select an existing
                  recipe)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">2.</span>
                <span>
                  <strong>Portions:</strong> Set how many servings this recipe makes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">3.</span>
                <span>
                  <strong>Add Ingredients:</strong> Add all ingredients with their quantities
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">4.</span>
                <span>
                  <strong>Calculate:</strong> See your total COGS and cost per portion
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#29E7CD]">5.</span>
                <span>
                  <strong>Set Price:</strong> Use the pricing tool to set your menu price based on
                  target profit margin
                </span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
