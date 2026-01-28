'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Employee, QualificationType } from '../../roster/types';
import { StaffCard } from './StaffCard';

interface StaffListProps {
  staff: Employee[];
  qualificationTypes: QualificationType[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export function StaffList({
  staff,
  qualificationTypes,
  onDelete,
  loading,
}: StaffListProps) {
  if (loading) {
    return <PageSkeleton />;
  }

  if (staff.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
          <svg className="h-12 w-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[var(--foreground)]">No Staff Found</h3>
        <p className="mx-auto max-w-xs text-[var(--foreground-muted)]">
          No team members match the selected filters. Try adjusting your status filter or adding a new member.
        </p>
      </div>
    );
  }

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-6">
      {staff.map(member => (
        <StaffCard
          key={member.id}
          member={member}
          qualificationTypes={qualificationTypes}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
