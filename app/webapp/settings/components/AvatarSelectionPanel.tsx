'use client';

import { Icon } from '@/components/ui/Icon';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { AVAILABLE_AVATARS } from '@/lib/avatars';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Avatar selection panel component for settings page.
 * Displays avatars in a horizontal scrollable carousel with snap points (iOS app picker style).
 *
 * @component
 * @returns {JSX.Element} Avatar selection panel
 */
export function AvatarSelectionPanel() {
  const { avatar, setAvatar, loading } = useUserAvatar();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Memoize card width calculation
  const cardWidth = useMemo(() => 160 + 16, []); // card width + gap

  // Scroll to specific avatar (memoized)
  const scrollToAvatar = useMemo(
    () => (index: number) => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const containerCenter = container.clientWidth / 2;
      const cardCenter = cardWidth / 2;
      const scrollPosition = index * cardWidth + cardCenter - containerCenter;

      container.scrollTo({
        left: Math.max(0, Math.min(scrollPosition, container.scrollWidth - container.clientWidth)),
        behavior: 'smooth',
      });
    },
    [cardWidth],
  );

  // Find selected avatar index and scroll to it
  useEffect(() => {
    if (avatar) {
      const index = AVAILABLE_AVATARS.findIndex(a => a.id === avatar);
      if (index !== -1) {
        setSelectedIndex(index);
        // Scroll to selected avatar after a short delay to ensure container is rendered
        setTimeout(() => scrollToAvatar(index), 100);
      }
    } else {
      setSelectedIndex(0);
    }
  }, [avatar, scrollToAvatar]);

  // Check scroll position for fade indicators and update selected index
  const checkScrollPosition = useMemo(
    () => () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

      // Determine which avatar is centered
      const centerPosition = scrollLeft + clientWidth / 2;
      const centeredIndex = Math.round(centerPosition / cardWidth);
      const clampedIndex = Math.max(0, Math.min(centeredIndex, AVAILABLE_AVATARS.length - 1));
      setSelectedIndex(clampedIndex);
    },
    [cardWidth],
  );

  // Handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    checkScrollPosition();

    // Set up scroll listener with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScrollPosition]);

  // Scroll navigation
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Avatar</h2>
        <p className="mt-1 text-sm text-gray-300">
          Choose your avatar to personalize your PrepFlow experience.
        </p>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="relative">
        {/* Left Fade Gradient */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-[#1f1f1f]/50 to-transparent" />
        )}

        {/* Right Fade Gradient */}
        {canScrollRight && (
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-[#1f1f1f]/50 to-transparent" />
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pt-2 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: 'calc(50% - 80px)',
            scrollPaddingRight: 'calc(50% - 80px)',
          }}
        >
          {AVAILABLE_AVATARS.map((avatarOption, index) => {
            const isSelected = avatar === avatarOption.id;
            const isCenter = Math.abs(index - selectedIndex) <= 1;

            return (
              <button
                key={avatarOption.id}
                onClick={() => {
                  if (!loading) {
                    setAvatar(avatarOption.id);
                    scrollToAvatar(index);
                  }
                }}
                disabled={loading}
                className={`group relative flex-shrink-0 snap-center transition-all duration-300 ${
                  isSelected
                    ? 'z-20 scale-110'
                    : isCenter
                      ? 'z-10 scale-100'
                      : 'z-0 scale-90 opacity-60'
                } ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  scrollSnapAlign: 'center',
                  width: '160px',
                  minWidth: '160px',
                }}
                aria-label={`Select ${avatarOption.name}`}
                aria-pressed={isSelected}
                onFocus={() => scrollToAvatar(index)}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#29E7CD] bg-[#29E7CD]/10 shadow-lg shadow-[#29E7CD]/20'
                      : 'border-[#2a2a2a] bg-[#2a2a2a]/20 hover:border-[#29E7CD]/50'
                  }`}
                >
                  {/* Avatar Image */}
                  <div className="relative aspect-square w-full">
                    <Image
                      src={avatarOption.imagePath}
                      alt={avatarOption.name}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={index < 3}
                      loading={index < 5 ? 'eager' : 'lazy'}
                    />
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#29E7CD] shadow-lg">
                      <Icon icon={Check} size="xs" className="text-black" aria-hidden={true} />
                    </div>
                  )}

                  {/* Avatar Name */}
                  <div className="border-t border-[#2a2a2a] bg-[#1f1f1f]/80 p-2">
                    <p
                      className={`truncate text-center text-xs font-medium transition-colors ${
                        isSelected ? 'text-[#29E7CD]' : 'text-gray-300'
                      }`}
                    >
                      {avatarOption.name}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Arrows (Desktop Only) */}
        <div className="desktop:flex hidden items-center justify-between">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#2a2a2a]/30 text-gray-400 transition-all hover:bg-[#2a2a2a]/50 hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Scroll left"
          >
            <Icon icon={ChevronLeft} size="sm" aria-hidden={true} />
          </button>

          <div className="flex gap-1">
            {AVAILABLE_AVATARS.map((avatarOption, index) => {
              const isSelected = avatar === avatarOption.id;
              return (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    isSelected ? 'w-6 bg-[#29E7CD]' : 'w-1.5 bg-[#2a2a2a]'
                  }`}
                  aria-hidden={true}
                />
              );
            })}
          </div>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#2a2a2a]/30 text-gray-400 transition-all hover:bg-[#2a2a2a]/50 hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Scroll right"
          >
            <Icon icon={ChevronRight} size="sm" aria-hidden={true} />
          </button>
        </div>
      </div>

      {/* Clear Selection Button */}
      {avatar && (
        <div className="flex justify-end border-t border-[#2a2a2a] pt-4">
          <button
            onClick={() => !loading && setAvatar(null)}
            disabled={loading}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/50 disabled:opacity-50"
          >
            Use Initials Instead
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent" />
        </div>
      )}
    </div>
  );
}
