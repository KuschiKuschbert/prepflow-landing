'use client';

/**
 * Landing section skeleton for lazy-loaded components
 * Maintains Apple-style aesthetic with smooth loading states
 */
export function LandingSectionSkeleton() {
  return (
    <div className="tablet:py-20 relative bg-transparent py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header Skeleton */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 h-12 w-64 animate-pulse rounded-3xl bg-[#2a2a2a]"></div>
          <div className="mx-auto h-6 w-48 animate-pulse rounded-xl bg-[#2a2a2a]"></div>
        </div>

        {/* Content Skeleton */}
        <div className="animate-pulse">
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-[#1f1f1f]/30 p-6">
                <div className="mb-4 h-8 w-3/4 rounded-xl bg-[#2a2a2a]"></div>
                <div className="mb-2 h-4 w-full rounded bg-[#2a2a2a]"></div>
                <div className="h-4 w-2/3 rounded bg-[#2a2a2a]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
