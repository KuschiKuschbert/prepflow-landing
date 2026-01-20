'use client';

import { Icon } from '@/components/ui/Icon';
import { Users } from 'lucide-react';

interface EmployeesHeaderProps {
  selectedStatus: 'all' | 'active' | 'inactive' | 'terminated';
  onStatusChange: (status: 'all' | 'active' | 'inactive' | 'terminated') => void;
  onAddEmployee: () => void;
}

export function EmployeesHeader({
  selectedStatus,
  onStatusChange,
  onAddEmployee,
}: EmployeesHeaderProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-[var(--foreground)]">
          <Icon icon={Users} size="lg" aria-hidden={true} />
          Kitchen Staff & Food Handlers
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Manage your kitchen staff and food handlers, track qualifications and certifications
        </p>
      </div>

      <div className="tablet:flex-row tablet:items-center mb-6 flex flex-col items-start justify-between gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={e =>
              onStatusChange(
                e.target.value as 'all' | 'active' | 'inactive' | 'terminated',
              )
            }
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <button
          onClick={onAddEmployee}
          className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
        >
          ➕ Add Employee
        </button>
      </div>
    </>
  );
}
