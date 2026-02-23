'use client';

import { getFirstDone } from '@/lib/page-help/first-done-storage';
import { useEffect, useState } from 'react';

interface InlineHintProps {
  /** Unique context key (e.g. 'ingredients', 'recipes') - used for localStorage */
  context: string;
  /** Hint text shown near the primary CTA */
  children: string;
  /** Optional class name */
  className?: string;
}

/**
 * Small contextual hint near primary CTA. Disappears permanently after first success.
 * Parent must call markFirstDone(context) when the action succeeds.
 */
export function InlineHint({ context, children, className = '' }: InlineHintProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!getFirstDone(context));
  }, [context]);

  if (!show) return null;

  return (
    <p
      className={`text-sm text-[var(--foreground-muted)] ${className}`}
      data-inline-hint-context={context}
    >
      {children}
    </p>
  );
}
