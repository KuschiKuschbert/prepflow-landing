/**
 * Milestone Toast Component
 *
 * Subtle milestone celebration toast with minimal confetti.
 * Appears briefly when usage milestones are reached.
 */

'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import type { Milestone } from '@/lib/gamification/types';
import { throwSubtleConfetti } from '@/lib/gamification/milestones';
import { subscribeMilestones } from '@/lib/gamification/events';

export function MilestoneToast() {
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMilestoneReached = (event: CustomEvent<{ milestone: Milestone }>) => {
      const milestone = event.detail.milestone;
      setCurrentMilestone(milestone);
      setIsVisible(true);

      // Throw subtle confetti (already triggered in dispatchMilestoneReached, but keep for safety)
      throwSubtleConfetti(0.5);

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentMilestone(null), 300); // Wait for fade-out animation
      }, 4000);
    };

    const unsubscribe = subscribeMilestones(handleMilestoneReached);

    return unsubscribe;
  }, []);

  if (!currentMilestone || !isVisible) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 fixed top-20 left-1/2 z-[60] -translate-x-1/2 duration-300">
      <div className="rounded-2xl border border-[var(--tertiary)]/30 bg-gradient-to-r from-[var(--tertiary)]/20 via-[var(--accent)]/20 to-[var(--primary)]/20 p-[1px] shadow-xl">
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface)]/95 px-4 py-3">
          {currentMilestone.icon && <span className="text-2xl">{currentMilestone.icon}</span>}
          <div className="flex-1">
            <div className="font-semibold text-[var(--foreground)]">{currentMilestone.name}</div>
            <div className="text-sm text-[var(--foreground-muted)]">{currentMilestone.description}</div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => setCurrentMilestone(null), 300);
            }}
            className="rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Dismiss milestone notification"
          >
            <Icon icon={X} size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
