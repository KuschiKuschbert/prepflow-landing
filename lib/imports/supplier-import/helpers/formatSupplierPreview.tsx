import { formatEntityPreview } from '../../import-utils';
import type { SupplierImportRow } from '../../supplier-import';

/**
 * Format supplier for preview
 */
export function formatSupplierPreview(supplier: SupplierImportRow, _index: number): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">{supplier.name}</div>
      <div className="text-xs text-gray-400">
        {formatEntityPreview(supplier, ['contact_person', 'email', 'phone', 'address', 'website'])}
      </div>
    </div>
  );
}
