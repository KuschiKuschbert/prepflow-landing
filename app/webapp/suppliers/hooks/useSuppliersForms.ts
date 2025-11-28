/**
 * Hook for managing suppliers form state and handlers.
 */

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';
import type { Supplier, SupplierFormData, SupplierPriceList, PriceListFormData } from '../types';

interface UseSuppliersFormsProps {
  suppliers: Supplier[];
  priceLists: SupplierPriceList[];
  selectedSupplier: string;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setPriceLists: React.Dispatch<React.SetStateAction<SupplierPriceList[]>>;
  setShowAddSupplier: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddPriceList: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useSuppliersForms({
  suppliers,
  priceLists,
  selectedSupplier,
  setSuppliers,
  setPriceLists,
  setShowAddSupplier,
  setShowAddPriceList,
}: UseSuppliersFormsProps) {
  const [newSupplier, setNewSupplier] = useState<SupplierFormData>({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    payment_terms: '',
    delivery_schedule: '',
    minimum_order_amount: '',
    notes: '',
  });

  const [newPriceList, setNewPriceList] = useState<PriceListFormData>({
    supplier_id: '',
    document_name: '',
    document_url: '',
    effective_date: '',
    expiry_date: '',
    notes: '',
    is_current: true,
  });

  const handleAddSupplier = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
          setNewSupplier({
            name: '',
            contact_person: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            payment_terms: '',
            delivery_schedule: '',
            minimum_order_amount: '',
            notes: '',
          });
          setShowAddSupplier(false);
        }
      } catch (error) {
        logger.error('Error adding supplier:', error);
      }
    },
    [newSupplier, suppliers, setSuppliers, setShowAddSupplier],
  );

  const handleAddPriceList = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
          setNewPriceList({
            supplier_id: '',
            document_name: '',
            document_url: '',
            effective_date: '',
            expiry_date: '',
            notes: '',
            is_current: true,
          });
          setShowAddPriceList(false);
        }
      } catch (error) {
        logger.error('Error adding price list:', error);
      }
    },
    [newPriceList, priceLists, selectedSupplier, setPriceLists, setShowAddPriceList],
  );

  return {
    newSupplier,
    setNewSupplier,
    newPriceList,
    setNewPriceList,
    handleAddSupplier,
    handleAddPriceList,
  };
}
