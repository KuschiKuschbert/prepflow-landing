'use client';

import React from 'react';
import { CategorySection } from './CategorySection';
import type { NavigationItemConfig } from './nav-items';

interface DrawerContentProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  groupedItems: Record<string, NavigationItemConfig[]>;
  isActive: (href: string) => boolean;
  onItemClick: (href: string) => void;
  isDragging: boolean;
  canDrag: boolean;
  onContentTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function DrawerContent({
  contentRef,
  groupedItems,
  isActive,
  onItemClick,
  isDragging,
  canDrag,
  onContentTouchStart,
  onTouchMove,
  onTouchEnd,
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
    if (isDragging && canDrag) {
      onTouchMove(e);
    }
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

  return (
    <div
      ref={contentRef}
      className="min-h-0 flex-1 overflow-y-auto px-3 py-2"
      style={{
        touchAction: isDragging && canDrag ? 'none' : 'pan-y',
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
          compact={true}
        />
      ))}
    </div>
  );
}
