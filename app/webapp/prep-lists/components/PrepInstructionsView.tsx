'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp, ChefHat } from 'lucide-react';
import type { PrepInstructionItem } from '../types';

interface PrepInstructionsViewProps {
  prepInstructions: PrepInstructionItem[];
}

export function PrepInstructionsView({ prepInstructions }: PrepInstructionsViewProps) {
  if (!prepInstructions || prepInstructions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <Icon icon={ChefHat} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        <h3 className="text-lg font-semibold text-white">Prep Instructions</h3>
        <span className="rounded-full bg-[#29E7CD]/20 px-2 py-1 text-xs font-medium text-[#29E7CD]">
          {prepInstructions.length}
        </span>
      </div>
      <div className="space-y-3">
        {prepInstructions.map((instruction, index) => (
          <PrepInstructionCard key={index} instruction={instruction} />
        ))}
      </div>
    </div>
  );
}

function PrepInstructionCard({ instruction }: { instruction: PrepInstructionItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#29E7CD]/10"
      >
        <div className="flex-1">
          <h4 className="font-semibold text-white">{instruction.recipeName}</h4>
          {instruction.dishName && (
            <p className="mt-1 text-sm text-gray-400">From: {instruction.dishName}</p>
          )}
        </div>
        <Icon
          icon={isExpanded ? ChevronUp : ChevronDown}
          size="sm"
          className="ml-4 text-[#29E7CD]"
          aria-hidden={true}
        />
      </button>
      {isExpanded && (
        <div className="border-t border-[#29E7CD]/20 p-4">
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
            {instruction.instructions}
          </div>
        </div>
      )}
    </div>
  );
}
