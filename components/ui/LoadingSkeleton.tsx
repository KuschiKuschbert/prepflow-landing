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
  width 
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
    button: 'h-10 w-24'
  };

  const skeletonClasses = `${baseClasses} ${variants[variant]} ${className}`;
  const style = {
    ...(height && { height }),
    ...(width && { width })
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
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-4"></div>
          <div className="h-4 bg-[#2a2a2a] rounded-xl w-1/2"></div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="h-12 bg-[#2a2a2a] rounded-2xl w-32 animate-pulse"></div>
          <div className="h-12 bg-[#2a2a2a] rounded-2xl w-40 animate-pulse"></div>
          <div className="h-12 bg-[#2a2a2a] rounded-2xl w-28 animate-pulse"></div>
        </div>

        {/* Main content skeleton */}
        <div className="bg-[#1f1f1f] rounded-3xl shadow-lg border border-[#2a2a2a] p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-[#2a2a2a] rounded-xl"></div>
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
    <div className="bg-[#1f1f1f] rounded-3xl shadow-lg border border-[#2a2a2a] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4 border-b border-[#2a2a2a]">
        <div className="animate-pulse">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-[#2a2a2a] rounded w-24"></div>
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
                  <div key={j} className="h-4 bg-[#2a2a2a] rounded w-20"></div>
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
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="animate-pulse">
        <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/3 mb-4"></div>
        <div className="h-80 bg-[#2a2a2a] rounded-xl"></div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] animate-pulse">
          <div className="h-4 bg-[#2a2a2a] rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-[#2a2a2a] rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-[#2a2a2a] rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] animate-pulse">
          <div className="h-4 bg-[#2a2a2a] rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-[#2a2a2a] rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-[#2a2a2a] rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="animate-pulse">
        <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-[#2a2a2a] rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-[#2a2a2a] rounded-xl"></div>
            </div>
          ))}
          <div className="h-10 bg-[#2a2a2a] rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
}

// Landing page specific skeletons
export function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-16 bg-[#2a2a2a] rounded-3xl w-2/3 mb-8 mx-auto"></div>
          <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/2 mb-12 mx-auto"></div>
          <div className="flex justify-center gap-4 mb-16">
            <div className="h-14 bg-[#2a2a2a] rounded-2xl w-48"></div>
            <div className="h-14 bg-[#2a2a2a] rounded-2xl w-40"></div>
          </div>
          <div className="h-96 bg-[#2a2a2a] rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export function PricingSkeleton() {
  return (
    <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="animate-pulse">
        <div className="h-8 bg-[#2a2a2a] rounded-xl w-1/3 mb-6"></div>
        <div className="h-12 bg-[#2a2a2a] rounded-xl w-1/4 mb-4"></div>
        <div className="h-4 bg-[#2a2a2a] rounded w-1/2 mb-8"></div>
        <div className="space-y-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-[#2a2a2a] rounded w-full"></div>
          ))}
        </div>
        <div className="h-14 bg-[#2a2a2a] rounded-2xl w-full"></div>
      </div>
    </div>
  );
}