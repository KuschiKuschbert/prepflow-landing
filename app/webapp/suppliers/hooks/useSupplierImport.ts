'use client';

import type { Supplier } from '../types';
import { useSupplierImportProcessor } from './useSupplierImportProcessor';

interface UseSupplierImportProps {
  suppliers: Supplier[];
  setSuppliers: (updater: (prev: Supplier[]) => Supplier[]) => void;
  setShowImportModal: (show: boolean) => void;
}

export function useSupplierImport({
  suppliers,
  setSuppliers,
  setShowImportModal,
}: UseSupplierImportProps) {
  const { importProgress, setImportProgress, processImports } = useSupplierImportProcessor({
    suppliers,
    setSuppliers,
    setShowImportModal,
  });

  return {
    importProgress,
    setImportProgress,
    handleImport: processImports,
  };
}
