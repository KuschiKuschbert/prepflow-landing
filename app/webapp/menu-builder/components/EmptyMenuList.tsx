'use client';

import { Icon } from '@/components/ui/Icon';
import { FileText } from 'lucide-react';

/**
 * Empty state component for when no menus exist.
 *
 * @component
 * @returns {JSX.Element} Empty menu list message
 */
export function EmptyMenuList() {
  return (
    <div className="py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 p-6">
          <Icon icon={FileText} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
      </div>
      <h3 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">No menus yet</h3>
      <p className="mx-auto mb-6 max-w-md text-[var(--foreground-muted)]">
        Create your first menu to organize your dishes into categories. You can drag and drop dishes
        from your recipe collection into menu categories.
      </p>
      <div className="mx-auto max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <p className="mb-2 text-sm text-[var(--foreground-secondary)]">
          💡 <strong>Tip:</strong> Before creating a menu, make sure you have:
        </p>
        <ul className="ml-6 list-disc space-y-1 text-left text-sm text-[var(--foreground-muted)]">
          <li>
            Created some dishes in the <strong>Dish Builder</strong>
          </li>
          <li>Or linked recipes to dishes</li>
        </ul>
      </div>
    </div>
  );
}
