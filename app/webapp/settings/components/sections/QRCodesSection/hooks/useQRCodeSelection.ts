import { useState, useCallback } from 'react';
import type { QRCodeEntity } from '../types';

/**
 * Hook for managing QR code selection state
 */
export function useQRCodeSelection(entities: QRCodeEntity[]) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAllInSection = useCallback(
    (sectionEntities: QRCodeEntity[]) => {
      const allSelected = sectionEntities.every(e => selectedItems.has(e.id));

      setSelectedItems(prev => {
        const next = new Set(prev);
        if (allSelected) {
          // Deselect all in section
          sectionEntities.forEach(e => next.delete(e.id));
        } else {
          // Select all in section
          sectionEntities.forEach(e => next.add(e.id));
        }
        return next;
      });
    },
    [selectedItems],
  );

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  return {
    selectedItems,
    toggleSelect,
    selectAllInSection,
    clearSelection,
  };
}
