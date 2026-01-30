'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Employee, QualificationType } from '../../roster/types';

interface StaffCardProps {
  member: Employee;
  qualificationTypes: QualificationType[];
  onDelete: (id: string) => void;
}

export function StaffCard({
  member,
  qualificationTypes: _qualificationTypes,
  onDelete,
}: StaffCardProps) {
  const { showSuccess, showError } = useNotification();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'inactive':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'terminated':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const qualCount = member.employee_qualifications?.length || 0;

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl"
        onClick={() => router.push(`/webapp/staff/${member.id}/onboarding`)}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {member.photo_url ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
              <Image
                src={member.photo_url}
                alt={`${member.first_name} ${member.last_name}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
              <Icon icon={User} size="lg" className="text-[var(--primary)]" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <h3 className="truncate text-lg font-bold text-[var(--foreground)]">
                {member.first_name} {member.last_name}
              </h3>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getStatusColor(member.status)}`}
              >
                {member.status}
              </span>
            </div>

            <p className="mt-0.5 truncate text-sm text-[var(--foreground-muted)]">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)} •{' '}
              {member.employment_type}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)]">
                <Icon
                  icon={ShieldCheck}
                  size="xs"
                  className={qualCount > 0 ? 'text-[var(--primary)]' : 'text-gray-400'}
                />
                <span>{qualCount} Quals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Overlay (Appears on Hover) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={e => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${member.first_name}? This will also delete their onboarding records.`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={() => {
          onDelete(member.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </>
  );
}
