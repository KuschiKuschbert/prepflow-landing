'use client';

import { logger } from '@/lib/logger';
import { useEffect, useMemo, useRef } from 'react';
import type { MenuItem } from '../../../types';
import { detectItemChanges } from './useStableMenuItems/helpers/detectItemChanges';

export function useStableMenuItems(rawMenuItems: MenuItem[], menuId: string): MenuItem[] {
  const prevRawMenuItemsRef = useRef<MenuItem[]>(rawMenuItems);
  const prevItemIdsRef = useRef<string>('');
  const prevMenuItemsRef = useRef(rawMenuItems);

  const menuItems = useMemo(() => {
    const currentItemIds = rawMenuItems.map(i => i.id).join(',');
    const prevItemIds = prevItemIdsRef.current;
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

    if (!contentChanged && prevRawMenuItemsRef.current.length === rawMenuItems.length) {
      logger.dev('[MenuEditor] menuItems content unchanged - returning previous reference', {
        menuId,
      });
      return prevRawMenuItemsRef.current;
    }

    logger.dev('[MenuEditor] menuItems content changed - returning new array reference', {
      menuId,
    });

    prevRawMenuItemsRef.current = rawMenuItems;
    prevItemIdsRef.current = currentItemIds;

    return rawMenuItems;
  }, [rawMenuItems, menuId]);

  useEffect(() => {
    if (prevMenuItemsRef.current !== rawMenuItems) {
      const prevIds = prevMenuItemsRef.current.map(i => i.id).join(',');
      const newIds = rawMenuItems.map(i => i.id).join(',');
      const contentChanged = prevIds !== newIds;
      logger.dev('[MenuEditor] menuItems reference changed', {
        menuId,
        contentChanged,
        prevCount: prevMenuItemsRef.current.length,
        newCount: rawMenuItems.length,
      });
      prevMenuItemsRef.current = rawMenuItems;
    }
  }, [rawMenuItems, menuId]);

  return menuItems;
}
