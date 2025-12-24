'use client';
import { Icon } from '@/components/ui/Icon';
import { AlertTriangle } from 'lucide-react';

interface WizardErrorDisplayProps {
  error: string | null;
}

export function WizardErrorDisplay({ error }: WizardErrorDisplayProps) {
  if (!error) return null;
  return (
    <div className="mb-3 rounded-lg border border-[var(--color-error)] bg-red-900/20 px-3 py-2 text-sm text-[var(--color-error)]">
      <div className="flex items-center space-x-2">
        <Icon
          icon={AlertTriangle}
          size="md"
          className="text-[var(--color-error)]"
          aria-hidden={true}
        />
        <span>{error}</span>
      </div>
    </div>
  );
}
