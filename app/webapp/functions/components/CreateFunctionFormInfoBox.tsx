'use client';

import { Icon } from '@/components/ui/Icon';
import { Calendar } from 'lucide-react';

export function CreateFunctionFormInfoBox() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--primary)]/5 p-4">
      <div className="flex items-start gap-3">
        <Icon
          icon={Calendar}
          size="md"
          className="mt-0.5 flex-shrink-0 text-[var(--primary)]"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">What happens next?</p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Your event will be created and you can build out a detailed runsheet with times,
            activities, and meal services. You can link function menus to meal entries directly.
          </p>
        </div>
      </div>
    </div>
  );
}
