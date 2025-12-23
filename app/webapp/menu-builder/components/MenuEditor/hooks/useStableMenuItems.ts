'use client';

import { logger } from '@/lib/logger';
import { useEffect, useMemo, useRef } from 'react';
import type { MenuItem } from '../../../types';
import { detectItemChanges } from './useStableMenuItems/helpers/detectItemChanges';

export function useStableMenuItems(rawMenuItems: MenuItem[], menuId: string): MenuItem[] {
  const prevRawMenuItemsRef = useRef<MenuItem[]>(rawMenuItems);
  const prevItemIdsRef = useRef<string>('');
  const stableMenuItemsRef = useRef<MenuItem[]>(rawMenuItems);

  const menuItems = useMemo(() => {
    const currentItemIds = rawMenuItems.map(i => i.id).join(',');
    const referenceChanged = prevRawMenuItemsRef.current !== rawMenuItems;

    const { contentChanged, itemReferencesChanged, changedItems } = detectItemChanges(
      prevRawMenuItemsRef.current,
      rawMenuItems,
    );

    logger.dev('[MenuEditor] menuItems useMemo recalculating', {
      menuId,
      itemCount: rawMenuItems.length,
      referenceChanged,
      contentChanged,
      itemReferencesChanged,
      changedItemsCount: changedItems.length,
    });

    // If content hasn't changed, return the stable reference
    if (!contentChanged && prevRawMenuItemsRef.current.length === rawMenuItems.length) {
      logger.dev('[MenuEditor] menuItems content unchanged - returning previous reference', {
        menuId,
      });
      return stableMenuItemsRef.current;
    }

    logger.dev('[MenuEditor] menuItems content changed - returning new array reference', {
      menuId,
    });

    // Content changed - update refs in useEffect, return new array
    return rawMenuItems;
  }, [rawMenuItems, menuId]);

  // Update refs after memo calculation to avoid mutating during render
  useEffect(() => {
    const currentItemIds = rawMenuItems.map(i => i.id).join(',');
    const prevItemIds = prevItemIdsRef.current;

    const { contentChanged } = detectItemChanges(prevRawMenuItemsRef.current, rawMenuItems);

    // Only update refs if content actually changed
    if (contentChanged || prevRawMenuItemsRef.current.length !== rawMenuItems.length) {
      prevRawMenuItemsRef.current = rawMenuItems;
      prevItemIdsRef.current = currentItemIds;
      stableMenuItemsRef.current = rawMenuItems;

      logger.dev('[MenuEditor] menuItems refs updated', {
        menuId,
        contentChanged,
        prevCount: prevRawMenuItemsRef.current.length,
        newCount: rawMenuItems.length,
      });
    }
  }, [rawMenuItems, menuId]);

  return menuItems;
}
