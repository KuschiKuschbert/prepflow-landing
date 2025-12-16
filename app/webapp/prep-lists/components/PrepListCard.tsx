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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-xl">
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
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{prepList.name}</h3>
              <p className="text-sm text-[var(--foreground-muted)]">{prepList.kitchen_sections.name}</p>
            </div>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <div>
              <p className="mb-1 text-xs text-[var(--foreground-muted)]">{t('prepLists.status', 'Status')}</p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(prepList.status)}`}
              >
                {prepList.status.charAt(0).toUpperCase() + prepList.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="mb-1 text-xs text-[var(--foreground-muted)]">{t('prepLists.items', 'Items')}</p>
              <p className="font-semibold text-[var(--foreground)]">{prepList.prep_list_items.length}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-[var(--foreground-muted)]">{t('prepLists.created', 'Created')}</p>
              <p className="font-semibold text-[var(--foreground)]">
                {new Date(prepList.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {prepList.notes && <p className="mb-4 text-sm text-[var(--foreground-secondary)]">{prepList.notes}</p>}

          {prepList.prep_list_items.length > 0 && (
            <div className="rounded-xl bg-[var(--muted)]/30 p-4">
              <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                {t('prepLists.items', 'Items')}
              </h4>
              <div className="space-y-2">
                {prepList.prep_list_items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--foreground-secondary)]">{item.ingredients.name}</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
                {prepList.prep_list_items.length > 3 && (
                  <p className="text-xs text-[var(--foreground-muted)]">
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
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowExport(true)}
              className="rounded-xl p-2 text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
              title={String(t('prepLists.export', 'Export'))}
              aria-label={String(t('prepLists.export', 'Export'))}
            >
              <Icon icon={Printer} size="md" aria-hidden={true} />
            </button>
            <button
              onClick={() => onEdit(prepList)}
              className="rounded-xl p-2 text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
              title={String(t('prepLists.edit', 'Edit'))}
              aria-label={String(t('prepLists.edit', 'Edit'))}
            >
              <Icon icon={Edit} size="md" aria-hidden={true} />
            </button>
            <button
              onClick={() => onDelete(prepList.id)}
              className="rounded-xl p-2 text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10"
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
