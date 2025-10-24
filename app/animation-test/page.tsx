/**
 * Simple Animation Test Page
 * Basic animations without complex imports
 */

'use client';

import React from 'react';

export default function SimpleAnimationTest() {
  const [showToast, setShowToast] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="animate-fade-in mb-8 text-center text-4xl font-bold text-white">
          🎨 PrepFlow Animation System Test
        </h1>

        <p className="animate-fade-in-up mb-8 text-center text-lg text-gray-400">
          Testing the new animation system with Prettier formatting
        </p>

        {/* Simple Animated Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="group animate-fade-in-up relative cursor-pointer rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#29E7CD]/50 hover:shadow-xl hover:shadow-[#29E7CD]/10">
            <div className="group-hover:animate-glow mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD] to-[#D925C7]">
              <span className="text-xl text-white">⚡</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#29E7CD]">
              Performance Optimized
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              All animations use CSS transforms and opacity for 60fps performance
            </p>
          </div>

          <div
            className="group animate-fade-in-up relative cursor-pointer rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#29E7CD]/50 hover:shadow-xl hover:shadow-[#29E7CD]/10"
            style={{ animationDelay: '100ms' }}
          >
            <div className="group-hover:animate-glow mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD] to-[#D925C7]">
              <span className="text-xl text-white">♿</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#29E7CD]">
              Accessibility First
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Respects prefers-reduced-motion and includes proper ARIA labels
            </p>
          </div>

          <div
            className="group animate-fade-in-up relative cursor-pointer rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#29E7CD]/50 hover:shadow-xl hover:shadow-[#29E7CD]/10"
            style={{ animationDelay: '200ms' }}
          >
            <div className="group-hover:animate-glow mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD] to-[#D925C7]">
              <span className="text-xl text-white">✨</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#29E7CD]">
              Modern Design
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Subtle effects that enhance UX without being distracting
            </p>
          </div>
        </div>

        {/* Animated Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowToast(true)}
            className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 text-base font-medium text-white transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:shadow-[#29E7CD]/25 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:outline-none active:scale-95"
          >
            Primary Action
          </button>

          <button
            onClick={() => setShowToast(true)}
            className="relative inline-flex items-center justify-center rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-base font-medium text-white transition-all duration-200 ease-out hover:scale-105 hover:border-[#29E7CD]/50 hover:bg-[#3a3a3a] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:outline-none active:scale-95"
          >
            Secondary Action
          </button>
        </div>

        {/* Progress Bars */}
        <div className="mx-auto mt-12 max-w-md space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Loading Progress</span>
              <span className="font-medium text-[#29E7CD]">75%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-1000 ease-out"
                style={{ width: '75%' }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Upload Status</span>
              <span className="font-medium text-[#29E7CD]">45%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-1000 ease-out"
                style={{ width: '45%' }}
              />
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="animate-shimmer h-32 rounded-2xl bg-[#2a2a2a]" />
          <div className="animate-shimmer h-4 rounded bg-[#2a2a2a]" />
          <div className="animate-shimmer h-20 w-20 rounded-full bg-[#2a2a2a]" />
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="animate-slide-in-right fixed top-4 right-4 z-50 w-full max-w-sm rounded-xl border border-green-500 bg-green-900/20 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-400">
                  Animation system is working perfectly! 🎉
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
