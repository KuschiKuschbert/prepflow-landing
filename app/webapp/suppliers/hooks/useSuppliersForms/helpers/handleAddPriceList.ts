/**
 * Handle add price list logic.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { SupplierPriceList, PriceListFormData } from '../../../types';
import { DEFAULT_PRICE_LIST_FORM } from '../defaultValues';

export async function handleAddPriceListHelper(
  newPriceList: PriceListFormData,
  priceLists: SupplierPriceList[],
  selectedSupplier: string,
  setPriceLists: React.Dispatch<React.SetStateAction<SupplierPriceList[]>>,
  setNewPriceList: React.Dispatch<React.SetStateAction<PriceListFormData>>,
  setShowAddPriceList: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
  // Store original state for rollback
  const originalPriceLists = [...priceLists];

  // Create temporary price list for optimistic update
  const tempId = `temp-${Date.now()}`;
  const tempPriceList: SupplierPriceList = {
    id: tempId as any, // Temporary ID, will be replaced by server
    supplier_id: parseInt(newPriceList.supplier_id),
    document_name: newPriceList.document_name,
    document_url: newPriceList.document_url || '',
    effective_date: newPriceList.effective_date || new Date().toISOString().split('T')[0],
    expiry_date: newPriceList.expiry_date || null,
    is_current: newPriceList.is_current !== undefined ? newPriceList.is_current : true,
    notes: newPriceList.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    suppliers: null as any, // Will be populated from server response
  };

  // Optimistically add to UI immediately
  setPriceLists([tempPriceList, ...priceLists]);
  setNewPriceList(DEFAULT_PRICE_LIST_FORM);
  setShowAddPriceList(false);

  try {
    const response = await fetch('/api/supplier-price-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newPriceList,
        supplier_id: parseInt(newPriceList.supplier_id),
      }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      // Replace temp price list with real price list from server
      setPriceLists(prevPriceLists =>
        prevPriceLists.map(pl => (String(pl.id) === tempId ? data.data : pl)),
      );
      if (selectedSupplier === 'all') {
        cacheData('supplier_price_lists', [data.data, ...originalPriceLists]);
      }
    } else {
      // Error - revert optimistic update
      setPriceLists(originalPriceLists);
      throw new Error(data.error || data.message || 'Failed to add price list');
    }
  } catch (error) {
    // Error - revert optimistic update
    setPriceLists(originalPriceLists);
    logger.error('Error adding price list:', error);
    throw error;
  }
}
