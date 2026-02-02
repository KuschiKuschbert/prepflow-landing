'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { PrepInstructionItem } from '@/lib/types/prep-lists';

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
        <Icon icon={ChefHat} size="md" className="text-[var(--primary)]" aria-hidden={true} />
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Prep Instructions</h3>
        <span className="rounded-full bg-[var(--primary)]/20 px-2 py-1 text-xs font-medium text-[var(--primary)]">
          {prepInstructions.length}
        </span>
      </div>
      <PrepInstructionList instructions={prepInstructions} />
    </div>
  );
}

function PrepInstructionList({ instructions }: { instructions: PrepInstructionItem[] }) {
  return (
    <div className="space-y-3">
      {instructions.map((instruction, index) => (
        <PrepInstructionCard key={index} instruction={instruction} />
      ))}
    </div>
  );
}

function PrepInstructionCard({ instruction }: { instruction: PrepInstructionItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[var(--primary)]/10"
      >
        <div className="flex-1">
          <h4 className="font-semibold text-[var(--foreground)]">{instruction.recipeName}</h4>
          {instruction.dishName && (
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              From: {instruction.dishName}
            </p>
          )}
        </div>
        <Icon
          icon={isExpanded ? ChevronUp : ChevronDown}
          size="sm"
          className="ml-4 text-[var(--primary)]"
          aria-hidden={true}
        />
      </button>
      {isExpanded && (
        <div className="border-t border-[var(--primary)]/20 p-4">
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground-secondary)]">
            {instruction.instructions}
          </div>
        </div>
      )}
    </div>
  );
}
