/**
 * Handle add supplier logic.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { Supplier, SupplierFormData } from '../../../types';
import { DEFAULT_SUPPLIER_FORM } from '../defaultValues';

export async function handleAddSupplierHelper(
  newSupplier: SupplierFormData,
  suppliers: Supplier[],
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>,
  setNewSupplier: React.Dispatch<React.SetStateAction<SupplierFormData>>,
  setShowAddSupplier: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
  try {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplier),
    });
    const data = await response.json();
    if (data.success) {
      const updatedSuppliers = [...suppliers, data.data];
      setSuppliers(updatedSuppliers);
      cacheData('suppliers', updatedSuppliers);
      setNewSupplier(DEFAULT_SUPPLIER_FORM);
      setShowAddSupplier(false);
    }
  } catch (error) {
    logger.error('Error adding supplier:', error);
  }
}
