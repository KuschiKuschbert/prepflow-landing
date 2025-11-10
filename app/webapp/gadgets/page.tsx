'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '../components/static/PageHeader';
import { KitchenTimer } from './components/KitchenTimer';
import { UnitConverter } from './components/UnitConverter';
import { TemperatureConverter } from './components/TemperatureConverter';
import { CookingTimeCalculator } from './components/CookingTimeCalculator';
import { YieldPortionCalculator } from './components/YieldPortionCalculator';
import { VolumeToWeightConverter } from './components/VolumeToWeightConverter';
import { IngredientSubstitutionGuide } from './components/IngredientSubstitutionGuide';

type GadgetTab =
  | 'timer'
  | 'unit'
  | 'temperature'
  | 'cooking-time'
  | 'yield'
  | 'volume-weight'
  | 'substitution';

function GadgetsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<GadgetTab>('timer');
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Check for tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (
      tabParam &&
      [
        'timer',
        'unit',
        'temperature',
        'cooking-time',
        'yield',
        'volume-weight',
        'substitution',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam as GadgetTab);
    }
  }, [searchParams]);

  const tabs: { id: GadgetTab; label: string; icon: string }[] = [
    { id: 'timer', label: 'Kitchen Timer', icon: '⏱️' },
    { id: 'unit', label: 'Unit Converter', icon: '🔄' },
    { id: 'temperature', label: 'Temperature', icon: '🌡️' },
    { id: 'cooking-time', label: 'Cooking Time', icon: '⏰' },
    { id: 'yield', label: 'Yield/Portion', icon: '📊' },
    { id: 'volume-weight', label: 'Volume to Weight', icon: '⚖️' },
    { id: 'substitution', label: 'Substitutions', icon: '🔄' },
  ];

  // Hide swipe hint after first interaction
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => setShowSwipeHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  // Swipe navigation handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(false);
    setSwipeOffset(0);
    setShowSwipeHint(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default scrolling if we're doing a horizontal swipe
    if (touchStartX.current !== null && touchStartY.current !== null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - touchStartX.current);
      const deltaY = Math.abs(currentY - touchStartY.current);

      // If horizontal swipe is more dominant than vertical, prevent scroll and show movement
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
        setIsSwiping(true);
        const offset = currentX - touchStartX.current;
        // Limit offset to prevent over-swiping
        const maxOffset = 100;
        setSwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, offset)));
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      setIsSwiping(false);
      setSwipeOffset(0);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);
    const minSwipeDistance = 50; // Minimum distance for a swipe

    // Only process if horizontal swipe is more dominant than vertical
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > minSwipeDistance) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(tabs[currentIndex - 1].id);
      } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }

    // Reset swipe state
    setIsSwiping(false);
    setSwipeOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white">
      <div className="mx-auto w-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {/* Compact Header for Mobile */}
        <div className="mb-2 sm:mb-4">
          <h1 className="text-lg font-bold text-white sm:text-2xl md:text-4xl">
            <span className="mr-1 sm:mr-2">🔧</span>
            Kitchen Gadgets
          </h1>
          <p className="hidden text-xs text-gray-400 sm:block sm:text-sm md:text-base">
            Useful digital tools for your kitchen
          </p>
        </div>

        {/* Compact Tab Navigation */}
        <div className="mb-2 w-full overflow-x-auto sm:mb-4">
          <div className="flex w-full space-x-1 border-b border-[#2a2a2a] sm:space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 items-center gap-1 border-b-2 px-2 py-1.5 text-xs font-medium transition-colors sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                  activeTab === tab.id
                    ? 'border-[#29E7CD] text-[#29E7CD]'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Swipe Indicators */}
        <div className="mb-2 flex items-center justify-center gap-2 sm:mb-4">
          {tabs.map((tab, index) => {
            const currentIndex = tabs.findIndex(t => t.id === activeTab);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'w-6 bg-[#29E7CD]'
                    : 'w-1.5 bg-[#2a2a2a] hover:bg-[#2a2a2a]/50'
                }`}
                aria-label={`Go to ${tab.label}`}
              />
            );
          })}
        </div>

        {/* Swipe Hint (shown on first load) */}
        {showSwipeHint && (
          <div className="mb-2 flex items-center justify-center gap-2 text-xs text-gray-400 sm:mb-4 sm:text-sm">
            <svg
              className="h-4 w-4 animate-pulse sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span>Swipe to navigate</span>
            <svg
              className="h-4 w-4 animate-pulse sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        )}

        {/* Gadget Content - Compact Padding with Swipe Support */}
        <div
          ref={contentRef}
          className="relative w-full touch-pan-y overflow-hidden rounded-xl bg-[#1f1f1f] p-2 sm:rounded-2xl sm:p-4 md:p-6 lg:p-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
          {/* Swipe Direction Arrows (shown during swipe) */}
          {isSwiping && (
            <>
              {swipeOffset < -20 && (
                <div className="pointer-events-none absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-[#29E7CD]/20 p-3 backdrop-blur-sm">
                  <svg
                    className="h-6 w-6 text-[#29E7CD] sm:h-8 sm:w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
              {swipeOffset > 20 && (
                <div className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-[#29E7CD]/20 p-3 backdrop-blur-sm">
                  <svg
                    className="h-6 w-6 text-[#29E7CD] sm:h-8 sm:w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
              )}
            </>
          )}

          {/* Content with swipe transform */}
          <div
            className="transition-all duration-200"
            style={{
              transform: isSwiping ? `translateX(${swipeOffset}px)` : 'translateX(0)',
              opacity: isSwiping ? 1 - Math.abs(swipeOffset) / 200 : 1,
            }}
          >
            {activeTab === 'timer' && <KitchenTimer />}
            {activeTab === 'unit' && <UnitConverter />}
            {activeTab === 'temperature' && <TemperatureConverter />}
            {activeTab === 'cooking-time' && <CookingTimeCalculator />}
            {activeTab === 'yield' && <YieldPortionCalculator />}
            {activeTab === 'volume-weight' && <VolumeToWeightConverter />}
            {activeTab === 'substitution' && <IngredientSubstitutionGuide />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GadgetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <PageHeader
              title="Kitchen Gadgets"
              subtitle="Useful digital tools for your kitchen"
              icon="🔧"
            />
            <div className="rounded-2xl bg-[#1f1f1f] p-6 md:p-8">
              <div className="animate-pulse text-center text-gray-400">Loading gadgets...</div>
            </div>
          </div>
        </div>
      }
    >
      <GadgetsContent />
    </Suspense>
  );
}
