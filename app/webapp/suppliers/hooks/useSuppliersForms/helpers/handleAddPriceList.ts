/**
 * Handle add price list logic.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { SupplierPriceList, PriceListFormData } from '../../types';
import { DEFAULT_PRICE_LIST_FORM } from '../defaultValues';

export async function handleAddPriceListHelper(
  newPriceList: PriceListFormData,
  priceLists: SupplierPriceList[],
  selectedSupplier: string,
  setPriceLists: React.Dispatch<React.SetStateAction<SupplierPriceList[]>>,
  setNewPriceList: React.Dispatch<React.SetStateAction<PriceListFormData>>,
  setShowAddPriceList: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
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
    if (data.success) {
      const updatedPriceLists = [data.data, ...priceLists];
      setPriceLists(updatedPriceLists);
      if (selectedSupplier === 'all') {
        cacheData('supplier_price_lists', updatedPriceLists);
      }
      setNewPriceList(DEFAULT_PRICE_LIST_FORM);
      setShowAddPriceList(false);
    }
  } catch (error) {
    logger.error('Error adding price list:', error);
  }
}
