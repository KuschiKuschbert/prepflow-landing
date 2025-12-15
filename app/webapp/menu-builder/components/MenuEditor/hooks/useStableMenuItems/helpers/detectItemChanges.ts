/**
 * Detect changes in menu items by comparing signatures and references.
 */
import type { MenuItem } from '../../../../../types';
import { createItemSignature } from './createItemSignature';

interface ItemChange {
  id: string;
  prevSig: string;
  newSig: string;
  referenceChanged: boolean;
}

export function detectItemChanges(
  prevItems: MenuItem[],
  newItems: MenuItem[],
): {
  contentChanged: boolean;
  itemReferencesChanged: boolean;
  changedItems: ItemChange[];
} {
  const prevItemIds = prevItems.map(i => i.id).join(',');
  const newItemIds = newItems.map(i => i.id).join(',');
  const idsChanged = prevItemIds !== newItemIds;

  const prevSignatures = prevItems.map(createItemSignature).join('|');
  const newSignatures = newItems.map(createItemSignature).join('|');
  const signaturesChanged = prevSignatures !== newSignatures;

  const changedItems: ItemChange[] = [];
  let itemReferencesChanged = false;

  newItems.forEach(item => {
    const newSig = createItemSignature(item);
    const prevItem = prevItems.find(i => i.id === item.id);
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
      changedItems.push({ id: item.id, prevSig: 'NEW', newSig, referenceChanged: true });
      itemReferencesChanged = true;
    }
  });

  const contentChanged = idsChanged || signaturesChanged || itemReferencesChanged;

  return {
    contentChanged,
    itemReferencesChanged,
    changedItems,
  };
}
