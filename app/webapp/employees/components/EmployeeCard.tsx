'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Employee, QualificationType } from '../types';
import { EmployeeDetailModal } from './EmployeeDetailModal';

interface EmployeeCardProps {
  employee: Employee;
  qualificationTypes: QualificationType[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeCard({
  employee,
  qualificationTypes,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQualifications, setShowQualifications] = useState(false);
  const [showAddQualification, setShowAddQualification] = useState(false);
  const [showDeleteQualConfirm, setShowDeleteQualConfirm] = useState(false);
  const [qualToDelete, setQualToDelete] = useState<string | null>(null);
  const [qualifications, setQualifications] = useState(employee.employee_qualifications || []);

  const handleAddQualification = async (qualificationData: any) => {
    try {
      const response = await fetch(`/api/employees/${employee.id}/qualifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...qualificationData,
          certificate_number: qualificationData.certificate_number || null,
          expiry_date: qualificationData.expiry_date || null,
          issuing_authority: qualificationData.issuing_authority || null,
          document_url: qualificationData.document_url || null,
          notes: qualificationData.notes || null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setQualifications([...qualifications, data.data]);
        setShowAddQualification(false);
      }
    } catch (error) {
      logger.error('Error adding qualification:', error);
    }
  };

  const handleDeleteQualification = (qualId: string) => {
    setQualToDelete(qualId);
    setShowDeleteQualConfirm(true);
  };

  const confirmDeleteQualification = async () => {
    if (!qualToDelete) return;
    try {
      const response = await fetch(`/api/employees/${employee.id}/qualifications/${qualToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setQualifications(qualifications.filter(q => q.id !== qualToDelete));
      }
    } catch (error) {
      logger.error('Error deleting qualification:', error);
    } finally {
      setShowDeleteQualConfirm(false);
      setQualToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20';
      case 'inactive':
        return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20';
      case 'terminated':
        return 'bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20';
      default:
        return 'bg-gray-500/10 text-[var(--foreground-muted)] border-gray-500/20';
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

  const handleCancelDeleteQual = () => {
    setShowDeleteQualConfirm(false);
    setQualToDelete(null);
  };

  return (
    <div>
      <div
        id={`employee-${employee.id}`}
        className="cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:border-[var(--primary)]/30 hover:shadow-xl"
        onClick={() => setShowDetailModal(true)}
      >
        <div className="flex items-center gap-3">
          {/* Employee Photo or Initial Avatar */}
          {employee.photo_url ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--primary)]/20">
              {employee.photo_url.startsWith('data:') ? (
                <Image
                  src={employee.photo_url}
                  alt={employee.full_name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={employee.photo_url}
                  alt={employee.full_name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
              <Icon icon={User} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{employee.full_name}</h3>
          </div>
        </div>
      </div>

      {/* Delete Qualification Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteQualConfirm}
        title="Remove Qualification"
        message="Are you sure you want to remove this qualification? This action can't be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteQualification}
        onCancel={handleCancelDeleteQual}
        variant="warning"
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={showDetailModal}
        employee={employee}
        qualificationTypes={qualificationTypes}
        onClose={handleCloseModal}
        onEdit={onEdit}
      />
    </div>
  );
}
