'use client';

import { Icon } from '@/components/ui/Icon';
import { Mail, Phone, User } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeContactInfoProps {
  employee: Employee;
}

export function EmployeeContactInfo({ employee }: EmployeeContactInfoProps) {
  if (!employee.phone && !employee.email && !employee.emergency_contact) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
        <Icon icon={Phone} size="md" className="text-[var(--primary)]" aria-hidden={true} />
        Contact Information
      </h3>
      <div className="space-y-3">
        {employee.phone && (
          <div className="flex items-center gap-3">
            <Icon
              icon={Phone}
              size="sm"
              className="text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <div>
              <span className="text-sm text-[var(--foreground-muted)]">Phone</span>
              <p className="text-[var(--foreground)]">
                {employee.phone.startsWith('+61')
                  ? employee.phone
                  : `+61 ${employee.phone.replace(/^\+?61\s*/, '')}`}
              </p>
            </div>
          </div>
        )}
        {employee.email && (
          <div className="flex items-center gap-3">
            <Icon
              icon={Mail}
              size="sm"
              className="text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <div>
              <span className="text-sm text-[var(--foreground-muted)]">Email</span>
              <p className="text-[var(--foreground)]">{employee.email}</p>
            </div>
          </div>
        )}
        {employee.emergency_contact && (
          <div className="flex items-center gap-3">
            <Icon
              icon={User}
              size="sm"
              className="text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <div>
              <span className="text-sm text-[var(--foreground-muted)]">Emergency Contact</span>
              <p className="text-[var(--foreground)]">{employee.emergency_contact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


