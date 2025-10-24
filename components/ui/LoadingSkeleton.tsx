'use client';

import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'chart' | 'list' | 'form' | 'stats' | 'text' | 'button';
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

export function LoadingSkeleton({
  variant = 'card',
  className = '',
  count = 1,
  height,
  width,
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-[#2a2a2a] rounded-xl';

  const variants = {
    card: 'h-32',
    table: 'h-64',
    chart: 'h-80',
    list: 'h-16',
    form: 'h-96',
    stats: 'h-24',
    text: 'h-4',
    button: 'h-10 w-24',
  };

  const skeletonClasses = `${baseClasses} ${variants[variant]} ${className}`;
  const style = {
    ...(height && { height }),
    ...(width && { width }),
  };

  if (count === 1) {
    return <div className={skeletonClasses} style={style}></div>;
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={skeletonClasses} style={style}></div>
      ))}
    </div>
  );
}

// Specialized skeleton components for common patterns
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded-3xl bg-[#2a2a2a]"></div>
          <div className="h-4 w-1/2 rounded-xl bg-[#2a2a2a]"></div>
        </div>

        {/* Action buttons skeleton */}
        <div className="mb-8 flex gap-3">
          <div className="h-12 w-32 animate-pulse rounded-2xl bg-[#2a2a2a]"></div>
          <div className="h-12 w-40 animate-pulse rounded-2xl bg-[#2a2a2a]"></div>
          <div className="h-12 w-28 animate-pulse rounded-2xl bg-[#2a2a2a]"></div>
        </div>

        {/* Main content skeleton */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
          <div className="animate-pulse">
            <div className="mb-6 h-6 w-1/4 rounded-xl bg-[#2a2a2a]"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[#2a2a2a]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4">
        <div className="animate-pulse">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 w-24 rounded bg-[#2a2a2a]"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#2a2a2a]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="animate-pulse">
              <div className="flex gap-4">
                {Array.from({ length: columns }).map((_, j) => (
                  <div key={j} className="h-4 w-20 rounded bg-[#2a2a2a]"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-1/3 rounded-xl bg-[#2a2a2a]"></div>
        <div className="h-80 rounded-xl bg-[#2a2a2a]"></div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg"
        >
          <div className="mb-3 h-4 w-3/4 rounded bg-[#2a2a2a]"></div>
          <div className="mb-2 h-3 w-1/2 rounded bg-[#2a2a2a]"></div>
          <div className="h-3 w-2/3 rounded bg-[#2a2a2a]"></div>
        </div>
      ))}
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg"
        >
          <div className="mb-3 h-4 w-1/2 rounded bg-[#2a2a2a]"></div>
          <div className="mb-2 h-8 w-1/3 rounded bg-[#2a2a2a]"></div>
          <div className="h-3 w-2/3 rounded bg-[#2a2a2a]"></div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="mb-6 h-6 w-1/4 rounded-xl bg-[#2a2a2a]"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-4 w-1/3 rounded bg-[#2a2a2a]"></div>
              <div className="h-10 rounded-xl bg-[#2a2a2a]"></div>
            </div>
          ))}
          <div className="h-10 w-24 rounded-xl bg-[#2a2a2a]"></div>
        </div>
      </div>
    </div>
  );
}

// Landing page specific skeletons
export function HeroSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mx-auto mb-8 h-16 w-2/3 rounded-3xl bg-[#2a2a2a]"></div>
          <div className="mx-auto mb-12 h-6 w-1/2 rounded-xl bg-[#2a2a2a]"></div>
          <div className="mb-16 flex justify-center gap-4">
            <div className="h-14 w-48 rounded-2xl bg-[#2a2a2a]"></div>
            <div className="h-14 w-40 rounded-2xl bg-[#2a2a2a]"></div>
          </div>
          <div className="h-96 rounded-3xl bg-[#2a2a2a]"></div>
        </div>
      </div>
    </div>
  );
}

export function PricingSkeleton() {
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 shadow-lg">
      <div className="animate-pulse">
        <div className="mb-6 h-8 w-1/3 rounded-xl bg-[#2a2a2a]"></div>
        <div className="mb-4 h-12 w-1/4 rounded-xl bg-[#2a2a2a]"></div>
        <div className="mb-8 h-4 w-1/2 rounded bg-[#2a2a2a]"></div>
        <div className="mb-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-[#2a2a2a]"></div>
          ))}
        </div>
        <div className="h-14 w-full rounded-2xl bg-[#2a2a2a]"></div>
      </div>
    </div>
  );
}
