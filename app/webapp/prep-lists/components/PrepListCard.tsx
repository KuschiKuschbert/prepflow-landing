'use client';

import { useTranslation } from '@/lib/useTranslation';
import { PrepList } from '../types';
import { getStatusColor } from '../utils';

interface PrepListCardProps {
  prepList: PrepList;
  onEdit: (prepList: PrepList) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function PrepListCard({ prepList, onEdit, onDelete, onStatusChange }: PrepListCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center space-x-4" style={{ backgroundColor: undefined }}>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${prepList.kitchen_sections.color}20` }}
            >
              <span className="text-lg">📝</span>
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
              onClick={() => onEdit(prepList)}
              className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
              title={String(t('prepLists.edit', 'Edit'))}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(prepList.id)}
              className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-400/10"
              title={String(t('prepLists.delete', 'Delete'))}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
