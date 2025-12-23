'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Sparkles, Loader2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface StandardTaskTemplatesProps {
  onPopulate: () => void;
}

/**
 * Standard Task Templates Component
 * Shows standard task templates and allows populating them
 */
export function StandardTaskTemplates({ onPopulate }: StandardTaskTemplatesProps) {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const handlePopulate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/cleaning-tasks/populate-standard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to populate standard tasks');
      }

      showSuccess(`Successfully created ${data.data?.count || 0} standard cleaning tasks`);
      onPopulate();
    } catch (error) {
      logger.error('Error populating standard tasks:', error);
      showError('Failed to populate standard tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
          <Icon icon={Sparkles} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--foreground)]">Standard Tasks</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Pre-populate cleaning tasks based on your equipment and sections
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
        <p className="text-sm text-[var(--foreground-secondary)]">This will automatically create cleaning tasks for:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--foreground-muted)]">
          <li>Equipment: Fridge seals, ovens, grills, flat tops, cookers</li>
          <li>Sections: Floor cleaning and bench cleaning per section</li>
          <li>Standard frequencies: Daily, weekly, monthly based on task type</li>
        </ul>
      </div>

      <button
        onClick={handlePopulate}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
            Populating...
          </span>
        ) : (
          'Populate Standard Tasks'
        )}
      </button>
    </div>
  );
}



