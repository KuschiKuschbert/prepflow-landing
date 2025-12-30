'use client';

import { Icon } from '@/components/ui/Icon';
import { Calendar } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeEmploymentInfoProps {
  employee: Employee;
}

export function EmployeeEmploymentInfo({ employee }: EmployeeEmploymentInfoProps) {
  return (
    <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
        <Icon icon={Calendar} size="md" className="text-[var(--primary)]" aria-hidden={true} />
        Employment Information
      </h3>
      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div>
          <span className="text-sm text-[var(--foreground-muted)]">Start Date</span>
          <p className="text-[var(--foreground)]">
            {new Date(employee.employment_start_date).toLocaleDateString('en-AU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        </div>
        {employee.employment_end_date && (
          <div>
            <span className="text-sm text-[var(--foreground-muted)]">End Date</span>
            <p className="text-[var(--foreground)]">
              {new Date(employee.employment_end_date).toLocaleDateString('en-AU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


