/**
 * Filter controls for compliance records.
 */

import { useTranslation } from '@/lib/useTranslation';
import { getTypeIconEmoji } from '../utils';
import type { ComplianceType } from '../types';

interface ComplianceFiltersProps {
  types: ComplianceType[];
  selectedType: string;
  selectedStatus: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onAddRecord: () => void;
}

export function ComplianceFilters({
  types,
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange,
  onAddRecord,
}: ComplianceFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-4">
      <div className="tablet:flex-row flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.filterType', 'Filter by Type')}
          </label>
          <select
            value={selectedType}
            onChange={e => onTypeChange(e.target.value)}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="all">{t('compliance.allTypes', 'All Types')}</option>
            {types.map(type => (
              <option key={type.id} value={type.id.toString()}>
                {getTypeIconEmoji(type.name)} {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.filterStatus', 'Filter by Status')}
          </label>
          <select
            value={selectedStatus}
            onChange={e => onStatusChange(e.target.value)}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="all">{t('compliance.allStatuses', 'All Statuses')}</option>
            <option value="active">✅ {t('compliance.active', 'Active')}</option>
            <option value="pending_renewal">
              ⚠️ {t('compliance.pendingRenewal', 'Pending Renewal')}
            </option>
            <option value="expired">❌ {t('compliance.expired', 'Expired')}</option>
          </select>
        </div>
      </div>
      <button
        onClick={onAddRecord}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
      >
        ➕ {t('compliance.addRecord', 'Add Compliance Record')}
      </button>
    </div>
  );
}
