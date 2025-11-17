'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PrepList } from '../types';
import { getStatusColor } from '../utils';
import { ListChecks, Edit, Trash2, Printer } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { PrepListExport } from './PrepListExport';

interface PrepListCardProps {
  prepList: PrepList;
  onEdit: (prepList: PrepList) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function PrepListCard({ prepList, onEdit, onDelete, onStatusChange }: PrepListCardProps) {
  const { t } = useTranslation();
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center space-x-4" style={{ backgroundColor: undefined }}>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${prepList.kitchen_sections.color}20` }}
            >
              <Icon icon={ListChecks} size="md" className="text-current" aria-hidden={true} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{prepList.name}</h3>
              <p className="text-sm text-gray-400">{prepList.kitchen_sections.name}</p>
            </div>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <div>
              <p className="mb-1 text-xs text-gray-400">{t('prepLists.status', 'Status')}</p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(prepList.status)}`}
              >
                {prepList.status.charAt(0).toUpperCase() + prepList.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400">{t('prepLists.items', 'Items')}</p>
              <p className="font-semibold text-white">{prepList.prep_list_items.length}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400">{t('prepLists.created', 'Created')}</p>
              <p className="font-semibold text-white">
                {new Date(prepList.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {prepList.notes && <p className="mb-4 text-sm text-gray-300">{prepList.notes}</p>}

          {prepList.prep_list_items.length > 0 && (
            <div className="rounded-xl bg-[#2a2a2a]/30 p-4">
              <h4 className="mb-3 text-sm font-semibold text-white">
                {t('prepLists.items', 'Items')}
              </h4>
              <div className="space-y-2">
                {prepList.prep_list_items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{item.ingredients.name}</span>
                    <span className="font-semibold text-white">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
                {prepList.prep_list_items.length > 3 && (
                  <p className="text-xs text-gray-400">
                    +{prepList.prep_list_items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <select
            value={prepList.status}
            onChange={e => onStatusChange(prepList.id, e.target.value)}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowExport(true)}
              className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
              title={String(t('prepLists.export', 'Export'))}
              aria-label={String(t('prepLists.export', 'Export'))}
            >
              <Icon icon={Printer} size="md" aria-hidden={true} />
            </button>
            <button
              onClick={() => onEdit(prepList)}
              className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
              title={String(t('prepLists.edit', 'Edit'))}
              aria-label={String(t('prepLists.edit', 'Edit'))}
            >
              <Icon icon={Edit} size="md" aria-hidden={true} />
            </button>
            <button
              onClick={() => onDelete(prepList.id)}
              className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-400/10"
              title={String(t('prepLists.delete', 'Delete'))}
              aria-label={String(t('prepLists.delete', 'Delete'))}
            >
              <Icon icon={Trash2} size="md" aria-hidden={true} />
            </button>
          </div>
        </div>
      </div>

      {showExport && <PrepListExport prepList={prepList} onClose={() => setShowExport(false)} />}
    </div>
  );
}
