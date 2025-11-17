'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Wrench } from 'lucide-react';
import { PageHeader } from '../components/static/PageHeader';
import { CookingTimeCalculator } from './components/CookingTimeCalculator';
import { IngredientSubstitutionGuide } from './components/IngredientSubstitutionGuide';
import { KitchenTimer } from './components/KitchenTimer';
import { TemperatureConverter } from './components/TemperatureConverter';
import { UnitConverter } from './components/UnitConverter';
import { VolumeToWeightConverter } from './components/VolumeToWeightConverter';
import { YieldPortionCalculator } from './components/YieldPortionCalculator';
import { GadgetsCard } from './components/GadgetsCard';

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
    <div className="w-full bg-[#0a0a0a] text-white">
      <div className="tablet:px-4 tablet:py-4 desktop:px-6 desktop:py-6 mx-auto w-full px-2 py-2">
        {/* Compact Header for Mobile */}
        <div className="tablet:mb-4 mb-2 flex-shrink-0">
          <h1 className="text-fluid-base tablet:text-fluid-xl desktop:text-fluid-2xl font-bold text-white">
            <span className="tablet:mr-2 mr-1">🔧</span>
            Kitchen Gadgets
          </h1>
          <p className="text-fluid-xs tablet:block tablet:text-fluid-sm hidden text-gray-400">
            Useful digital tools for your kitchen
          </p>
        </div>

        {/* Compact Tab Navigation */}
        <div className="tablet:mb-4 mb-2 w-full flex-shrink-0 overflow-x-auto">
          <div className="tablet:space-x-2 flex w-full space-x-1 border-b border-[#2a2a2a]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-fluid-xs tablet:gap-2 tablet:px-3 desktop:py-2.5 tablet:text-fluid-sm flex flex-shrink-0 items-center gap-1 border-b-2 px-2 py-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#29E7CD] text-[#29E7CD]'
                    : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-fluid-sm tablet:text-fluid-base">{tab.icon}</span>
                <span className="tablet:inline hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Swipe Indicators */}
        <div className="tablet:mb-4 tablet:gap-2 mb-2 flex flex-shrink-0 items-center justify-center gap-1.5">
          {tabs.map((tab, index) => {
            const currentIndex = tabs.findIndex(t => t.id === activeTab);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-1 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'tablet:w-6 w-5 bg-[#29E7CD]'
                    : 'tablet:w-1.5 w-1 bg-[#2a2a2a] hover:bg-[#2a2a2a]/50'
                }`}
                aria-label={`Go to ${tab.label}`}
              />
            );
          })}
        </div>

        {/* Swipe Hint (shown on first load) */}
        {showSwipeHint && (
          <div className="text-fluid-xs tablet:mb-4 tablet:gap-2 tablet:text-fluid-sm mb-2 flex flex-shrink-0 items-center justify-center gap-1.5 text-gray-400">
            <svg
              className="tablet:h-4 tablet:w-4 h-3 w-3 animate-pulse"
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
              className="tablet:h-4 tablet:w-4 h-3 w-3 animate-pulse"
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

        {/* Gadget Content Card - Only the gadget itself */}
        <GadgetsCard>
          <div
            ref={contentRef}
            className="relative flex h-full w-full touch-pan-y overflow-hidden"
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
                      className="tablet:h-8 tablet:w-8 h-6 w-6 text-[#29E7CD]"
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
                      className="tablet:h-8 tablet:w-8 h-6 w-6 text-[#29E7CD]"
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

            {/* Content with swipe transform - Full Height */}
            <div
              className="flex h-full w-full flex-col transition-all duration-200"
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
        </GadgetsCard>
      </div>
    </div>
  );
}

export default function GadgetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="tablet:px-6 tablet:py-8 mx-auto max-w-7xl px-4 py-6">
            <PageHeader
              title="Kitchen Gadgets"
              subtitle="Useful digital tools for your kitchen"
              icon={Wrench}
            />
            <div className="tablet:p-8 rounded-2xl bg-[#1f1f1f] p-6">
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
