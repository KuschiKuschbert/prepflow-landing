'use client';

import { logger } from '@/lib/logger';
import { useEffect, useMemo, useRef } from 'react';
import { MenuItem } from '../../../types';

export function useStableMenuItems(rawMenuItems: MenuItem[], menuId: string): MenuItem[] {
  const prevRawMenuItemsRef = useRef<MenuItem[]>(rawMenuItems);
  const prevItemIdsRef = useRef<string>('');
  const prevMenuItemsRef = useRef(rawMenuItems);

  const menuItems = useMemo(() => {
    const currentItemIds = rawMenuItems.map(i => i.id).join(',');
    const prevItemIds = prevItemIdsRef.current;
    const referenceChanged = prevRawMenuItemsRef.current !== rawMenuItems;

    // Create a signature that includes both IDs and key properties that might change
    // This ensures we detect changes to prices, categories, positions, etc.
    const createItemSignature = (item: MenuItem) => {
      return `${item.id}:${item.actual_selling_price ?? 'null'}:${item.category}:${item.position}`;
    };
    const currentSignatures = rawMenuItems.map(createItemSignature).join('|');
    const prevSignatures = prevRawMenuItemsRef.current.map(createItemSignature).join('|');
    const signaturesChanged = prevSignatures !== currentSignatures;

    // Check if any item object references changed (even if signatures match)
    // This is critical: API response might have same signature as optimistic update,
    // but the item object reference changed, so we need to return new array
    let itemReferencesChanged = false;
    const changedItems: Array<{
      id: string;
      prevSig: string;
      newSig: string;
      referenceChanged: boolean;
    }> = [];
    rawMenuItems.forEach(item => {
      const newSig = createItemSignature(item);
      const prevItem = prevRawMenuItemsRef.current.find(i => i.id === item.id);
      if (prevItem) {
        const prevSig = createItemSignature(prevItem);
        const sigChanged = prevSig !== newSig;
        const refChanged = prevItem !== item;
        if (sigChanged || refChanged) {
          changedItems.push({ id: item.id, prevSig, newSig, referenceChanged: refChanged });
          if (refChanged) {
            itemReferencesChanged = true;
          }
        }
      } else {
        // New item added
        changedItems.push({ id: item.id, prevSig: 'NEW', newSig, referenceChanged: true });
        itemReferencesChanged = true;
      }
    });

    // Content changed if IDs changed, signatures changed, OR item references changed
    const contentChanged =
      prevItemIds !== currentItemIds || signaturesChanged || itemReferencesChanged;

    // Log full signatures and comparison details
    logger.dev('[MenuEditor] menuItems useMemo recalculating - full signature comparison', {
      menuId,
      itemCount: rawMenuItems.length,
      referenceChanged,
      contentChanged,
      prevItemIds,
      newItemIds: currentItemIds,
      idsChanged: prevItemIds !== currentItemIds,
      signaturesChanged,
      itemReferencesChanged,
      prevSignaturesFull: prevSignatures, // Full signatures, not truncated
      newSignaturesFull: currentSignatures, // Full signatures, not truncated
      changedItemsCount: changedItems.length,
      changedItems: changedItems.map(ci => ({
        id: ci.id,
        prevSignature: ci.prevSig,
        newSignature: ci.newSig,
        referenceChanged: ci.referenceChanged,
        prevPrice: prevRawMenuItemsRef.current.find(i => i.id === ci.id)?.actual_selling_price,
        newPrice: rawMenuItems.find(i => i.id === ci.id)?.actual_selling_price,
        prevItemRef: prevRawMenuItemsRef.current.find(i => i.id === ci.id),
        newItemRef: rawMenuItems.find(i => i.id === ci.id),
        refsEqual:
          prevRawMenuItemsRef.current.find(i => i.id === ci.id) ===
          rawMenuItems.find(i => i.id === ci.id),
      })),
    });

    // Only return previous reference if both IDs and signatures are unchanged
    // This ensures property changes (like price updates) are detected
    if (!contentChanged && prevRawMenuItemsRef.current.length === rawMenuItems.length) {
      logger.dev('[MenuEditor] menuItems content unchanged - returning previous reference', {
        menuId,
        arrayReferenceBefore: prevRawMenuItemsRef.current,
        arrayReferenceAfter: rawMenuItems,
        arraysEqual: prevRawMenuItemsRef.current === rawMenuItems,
      });
      return prevRawMenuItemsRef.current;
    }

    // Log array reference change
    logger.dev('[MenuEditor] menuItems content changed - returning new array reference', {
      menuId,
      arrayReferenceBefore: prevRawMenuItemsRef.current,
      arrayReferenceAfter: rawMenuItems,
      arraysEqual: prevRawMenuItemsRef.current === rawMenuItems,
      willReturnNewReference: true,
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
        prevIds,
        newIds,
      });
      prevMenuItemsRef.current = rawMenuItems;
    }
  }, [rawMenuItems, menuId]);

  return menuItems;
}
