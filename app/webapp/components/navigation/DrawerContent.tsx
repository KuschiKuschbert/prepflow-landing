'use client';

import React from 'react';
import { CategorySection } from './CategorySection';
import type { NavigationItemConfig } from './nav-items';
import type { WorkflowType } from '@/lib/workflow/preferences';

interface DrawerContentProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  groupedItems: Record<string, NavigationItemConfig[]>;
  isActive: (href: string) => boolean;
  onItemClick: (href: string) => void;
  onTrack?: (href: string) => void;
  isDragging: boolean;
  canDrag: boolean;
  onContentTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  workflow?: WorkflowType;
}

function isAtTop(contentRef: React.RefObject<HTMLDivElement | null>): boolean {
  return contentRef.current ? contentRef.current.scrollTop <= 5 : false;
}

export function DrawerContent({
  contentRef,
  groupedItems,
  isActive,
  onItemClick,
  onTrack,
  isDragging,
  canDrag,
  onContentTouchStart,
  onTouchMove,
  onTouchEnd,
  workflow = 'daily-operations',
}: DrawerContentProps) {
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (link) {
      e.stopPropagation();
      return;
    }
    onContentTouchStart(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (link) {
      e.stopPropagation();
      return;
    }
    // Always call onTouchMove to allow upward gesture detection when at top
    // The hook will determine if it's an upward or downward gesture
    onTouchMove(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (link) {
      e.stopPropagation();
      return;
    }
    onTouchEnd();
  };

  // Determine touch action based on state
  // Always allow pan-y for scrolling - gesture handlers will prevent default when needed
  // This allows users to scroll normally, but also drag to close when at top
  const touchAction = 'pan-y';

  return (
    <div
      ref={contentRef}
      className="min-h-0 flex-1 overflow-y-auto px-3 py-2"
      style={{
        touchAction,
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {Object.entries(groupedItems).map(([category, items]) => (
        <CategorySection
          key={category}
          category={category}
          items={items}
          isActive={isActive}
          onItemClick={onItemClick}
          onTrack={onTrack}
          compact={true}
          workflow={workflow}
        />
      ))}
    </div>
  );
}
