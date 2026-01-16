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
  // Store original state for rollback
  const originalSuppliers = [...suppliers];

  // Create temporary supplier for optimistic update
  const tempId = -Date.now();
  const tempSupplier: Supplier = {
    id: tempId, // Temporary ID, will be replaced by server
    name: newSupplier.name,
    contact_person: newSupplier.contact_person || null,
    email: newSupplier.email || null,
    phone: newSupplier.phone || null,
    address: newSupplier.address || null,
    website: newSupplier.website || null,
    payment_terms: newSupplier.payment_terms || null,
    delivery_schedule: newSupplier.delivery_schedule || null,
    minimum_order_amount: newSupplier.minimum_order_amount
      ? parseFloat(newSupplier.minimum_order_amount)
      : null,
    is_active: true,
    notes: newSupplier.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Optimistically add to UI immediately
  setSuppliers([...suppliers, tempSupplier]);
  setNewSupplier(DEFAULT_SUPPLIER_FORM);
  setShowAddSupplier(false);

  try {
    // Transform form data to API format (name -> supplier_name)
    const apiData = {
      supplier_name: newSupplier.name,
      contact_person: newSupplier.contact_person || null,
      email: newSupplier.email || null,
      phone: newSupplier.phone || null,
      address: newSupplier.address || null,
      website: newSupplier.website || null,
      payment_terms: newSupplier.payment_terms || null,
      delivery_schedule: newSupplier.delivery_schedule || null,
      minimum_order_amount: newSupplier.minimum_order_amount
        ? parseFloat(newSupplier.minimum_order_amount)
        : null,
      is_active: true,
      notes: newSupplier.notes || null,
    };

    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });
    const data = await response.json();
    if (data.success && data.data) {
      // Transform API response (supplier_name -> name) to match Supplier interface
      const serverSupplier: Supplier = {
        ...data.data,
        name: data.data.supplier_name || data.data.name,
      };
      // Replace temp supplier with real supplier from server
      setSuppliers(prevSuppliers => prevSuppliers.map(s => (s.id === tempId ? serverSupplier : s)));
      cacheData('suppliers', [...originalSuppliers, serverSupplier]);
    } else {
      // Error - revert optimistic update
      setSuppliers(originalSuppliers);
      throw new Error(data.error || data.message || 'Failed to add supplier');
    }
  } catch (error) {
    // Error - revert optimistic update
    setSuppliers(originalSuppliers);
    logger.error('Error adding supplier:', error);
    throw error;
  }
}
