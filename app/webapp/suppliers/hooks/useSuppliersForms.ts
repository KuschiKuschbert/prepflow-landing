/**
 * Hook for managing suppliers form state and handlers.
 */

import { useState, useCallback } from 'react';
import type { SupplierFormData, PriceListFormData, Supplier, SupplierPriceList } from '../types';
import { handleAddSupplierHelper } from './useSuppliersForms/helpers/handleAddSupplier';
import { handleAddPriceListHelper } from './useSuppliersForms/helpers/handleAddPriceList';
import { DEFAULT_SUPPLIER_FORM, DEFAULT_PRICE_LIST_FORM } from './useSuppliersForms/defaultValues';

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
  const [newSupplier, setNewSupplier] = useState<SupplierFormData>(DEFAULT_SUPPLIER_FORM);
  const [newPriceList, setNewPriceList] = useState<PriceListFormData>(DEFAULT_PRICE_LIST_FORM);

  const handleAddSupplier = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddSupplierHelper(
        newSupplier,
        suppliers,
        setSuppliers,
        setNewSupplier,
        setShowAddSupplier,
      );
    },
    [newSupplier, suppliers, setSuppliers, setShowAddSupplier],
  );

  const handleAddPriceList = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddPriceListHelper(
        newPriceList,
        priceLists,
        selectedSupplier,
        setPriceLists,
        setNewPriceList,
        setShowAddPriceList,
      );
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
