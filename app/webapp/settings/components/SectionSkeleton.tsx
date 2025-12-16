'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

/**
 * Section skeleton component for settings page.
 * Displays loading state while section components are being loaded.
 *
 * @component
 * @returns {JSX.Element} Section skeleton
 */
export function SectionSkeleton() {
  return (
    <div className="space-y-6">
      {/* First Panel Skeleton */}
      <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
        <div className="space-y-3">
          <LoadingSkeleton variant="text" className="h-6 w-48" />
          <LoadingSkeleton variant="text" className="h-4 w-64" />
        </div>
        <div className="space-y-4 border-t border-[var(--border)] pt-4">
          <LoadingSkeleton variant="text" className="h-10 w-full" />
          <LoadingSkeleton variant="text" className="h-10 w-full" />
          <LoadingSkeleton variant="text" className="h-10 w-3/4" />
        </div>
      </div>

      {/* Second Panel Skeleton */}
      <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
        <div className="space-y-3">
          <LoadingSkeleton variant="text" className="h-6 w-40" />
          <LoadingSkeleton variant="text" className="h-4 w-56" />
        </div>
        <div className="space-y-3 border-t border-[var(--border)] pt-4">
          <LoadingSkeleton variant="text" className="h-16 w-full" />
          <LoadingSkeleton variant="text" className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
