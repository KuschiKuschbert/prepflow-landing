/**
 * Helpers for supplier import. Extracted from useSupplierImportProcessor to stay under 120-line limit.
 */
import { cacheData } from '@/lib/cache/data-cache';
import type { SupplierImportRow } from '@/lib/imports/supplier-import';
import { logger } from '@/lib/logger';
import type { Supplier } from '../types';

export interface ProcessRowResult {
  success: boolean;
  supplier?: Supplier;
  error?: string;
}

export async function processSingleImportRow(
  row: SupplierImportRow,
  index: number,
  tempId: number,
  tempSupplier: Supplier,
  setSuppliers: (updater: (prev: Supplier[]) => Supplier[]) => void,
): Promise<ProcessRowResult> {
  setSuppliers(prev => [...prev, tempSupplier]);

  try {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildSupplierApiPayload(row)),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      const serverSupplier = toSupplierFromApiResponse(result.data);
      setSuppliers(prev => prev.map(s => (s.id === tempId ? serverSupplier : s)));
      return { success: true, supplier: serverSupplier };
    }
    setSuppliers(prev => prev.filter(s => s.id !== tempId));
    return {
      success: false,
      error: result.error || result.message || 'Failed to import supplier',
    };
  } catch (err) {
    setSuppliers(prev => prev.filter(s => s.id !== tempId));
    const errorMessage = err instanceof Error ? err.message : 'Failed to import supplier';
    logger.error(`[Suppliers Import] Failed to import row ${index + 1}:`, {
      error: errorMessage,
      err,
    });
    return { success: false, error: errorMessage };
  }
}

export function buildTempSupplierFromRow(row: SupplierImportRow, tempId: number): Supplier {
  return {
    id: tempId,
    name: row.name,
    contact_person: row.contact_person || null,
    email: row.email || null,
    phone: row.phone || null,
    address: row.address || null,
    website: row.website || null,
    payment_terms: row.payment_terms || null,
    delivery_schedule: row.delivery_schedule || null,
    minimum_order_amount: row.minimum_order_amount || null,
    is_active: row.is_active !== undefined ? row.is_active : true,
    notes: row.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function buildSupplierApiPayload(row: SupplierImportRow) {
  return {
    supplier_name: row.name,
    contact_person: row.contact_person || null,
    email: row.email || null,
    phone: row.phone || null,
    address: row.address || null,
    website: row.website || null,
    payment_terms: row.payment_terms || null,
    delivery_schedule: row.delivery_schedule || null,
    minimum_order_amount: row.minimum_order_amount || null,
    is_active: row.is_active !== undefined ? row.is_active : true,
    notes: row.notes || null,
  };
}

export function toSupplierFromApiResponse(data: Record<string, unknown>): Supplier {
  const base = data as unknown as Supplier & { supplier_name?: string };
  return { ...base, name: base.supplier_name ?? base.name ?? '' };
}

export function buildImportCompletionProgress(
  total: number,
  successCount: number,
  failCount: number,
  errors: Array<{ row: number; error: string }>,
) {
  return {
    total,
    processed: total,
    successful: successCount,
    failed: failCount,
    isComplete: true,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function finalizeSupplierImport(
  importedSuppliers: Supplier[],
  tempSuppliers: Array<{ tempId: number; supplier: Supplier }>,
  originalSuppliers: Supplier[],
  setSuppliers: (updater: (prev: Supplier[]) => Supplier[]) => void,
) {
  if (importedSuppliers.length > 0) {
    setSuppliers(prev => {
      const finalList = prev.filter(s => !tempSuppliers.some(t => t.tempId === s.id));
      const updatedList = [...finalList, ...importedSuppliers];
      cacheData('suppliers', updatedList);
      return updatedList;
    });
  } else {
    setSuppliers(() => originalSuppliers);
  }
}
