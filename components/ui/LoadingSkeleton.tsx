'use client';

import React from 'react';

export function HeroSkeleton() {
  return (
    <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-16 bg-gray-700 rounded-lg mb-6 w-3/4"></div>
        
        {/* Subtitle skeleton */}
        <div className="h-6 bg-gray-700 rounded mb-8 w-full"></div>
        
        {/* Bullet points skeleton */}
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-600 mt-2"></div>
              <div className="h-5 bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
        
        {/* CTA buttons skeleton */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="h-12 bg-gray-700 rounded-2xl w-48"></div>
          <div className="h-12 bg-gray-700 rounded-2xl w-48"></div>
        </div>
      </div>
      
      {/* Image skeleton */}
      <div className="animate-pulse">
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <div className="w-full h-80 bg-gray-700 rounded-xl"></div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingSkeleton() {
  return (
    <section className="py-20 animate-pulse">
      <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="h-10 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-700 rounded mb-6 w-full"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <div className="h-5 bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center">
            <div className="h-16 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-700 rounded mb-8 w-3/4 mx-auto"></div>
            <div className="h-12 bg-gray-700 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
