'use client';
import { Icon } from '@/components/ui/Icon';
import { QRCodeModal } from '@/lib/qr-codes';
import { Award, FileText, QrCode, User, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Employee, QualificationType } from '../types';
import { QualificationCard } from './QualificationCard';
import { getStatusColor } from './EmployeeDetailModal/helpers/getStatusColor';
import { EmployeeEmploymentInfo } from './EmployeeDetailModal/EmployeeEmploymentInfo';
import { EmployeeContactInfo } from './EmployeeDetailModal/EmployeeContactInfo';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employee: Employee | null;
  qualificationTypes: QualificationType[];
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

/**
 * Employee detail modal component showing all employee information
 */
export function EmployeeDetailModal({
  isOpen,
  employee,
  qualificationTypes: _qualificationTypes,
  onClose,
  onEdit,
}: EmployeeDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  if (!isOpen || !employee) return null;
  const qualifications = employee.employee_qualifications || [];
  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden={true}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative z-50 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-modal-title"
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
        >
          <div className="max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--surface)] p-6">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Employee Photo or Avatar */}
                {employee.photo_url ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-[var(--primary)]/20">
                    {employee.photo_url.startsWith('data:') ? (
                      <Image
                        src={employee.photo_url}
                        alt={employee.full_name}
                        width={80}
                        height={80}
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
                    <Icon
                      icon={User}
                      size="xl"
                      className="text-[var(--primary)]"
                      aria-hidden={true}
                    />
                  </div>
                )}
                <div>
                  <h2
                    id="employee-modal-title"
                    className="text-2xl font-bold text-[var(--foreground)]"
                  >
                    {employee.full_name}
                  </h2>
                  <p className="text-lg text-[var(--foreground-muted)]">
                    {employee.role || 'No role specified'}
                  </p>
                  {employee.employee_id && (
                    <p className="text-sm text-[var(--foreground-subtle)]">
                      ID: {employee.employee_id}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(employee.status)}`}
                >
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </span>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  aria-label="Close"
                >
                  <Icon icon={X} size="md" aria-hidden={true} />
                </button>
              </div>
            </div>

            <EmployeeEmploymentInfo employee={employee} />
            <EmployeeContactInfo employee={employee} />

            {/* Qualifications */}
            <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <Icon icon={Award} size="md" className="text-[var(--primary)]" aria-hidden={true} />
                Certificates & Qualifications
                <span className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-xs text-[var(--primary)]">
                  {qualifications.length}
                </span>
              </h3>
              {qualifications.length === 0 ? (
                <p className="text-sm text-[var(--foreground-muted)]">
                  No qualifications added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {qualifications.map(qual => (
                    <QualificationCard
                      key={qual.id}
                      qualification={qual}
                      onDelete={() => {}} // Read-only in modal
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            {employee.notes && (
              <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                  <Icon
                    icon={FileText}
                    size="md"
                    className="text-[var(--primary)]"
                    aria-hidden={true}
                  />
                  Notes
                </h3>
                <p className="text-sm whitespace-pre-wrap text-[var(--foreground-secondary)]">
                  {employee.notes}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-4">
              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2.5 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
                title="Generate ID badge with QR code"
              >
                <Icon icon={QrCode} size="sm" />
                ID Badge
              </button>
              <button
                onClick={onClose}
                className="rounded-xl bg-[var(--muted)] px-6 py-2.5 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-2.5 font-medium text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
              >
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Employee ID Badge */}
      <QRCodeModal
        entity={{ id: employee.id, name: employee.full_name }}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        entityTypeLabel="Employee"
        urlPattern="/webapp/employees?id={id}"
        icon={User}
        getSubtitle={() => employee.role || null}
        instructions="Scan to view employee profile and qualifications"
        hint="Print this as an ID badge for time clock and task assignment!"
        printInstructions="Scan this QR code to view employee details"
        permanentLinkNote="This QR code stays valid even if employee name changes — perfect for printed ID badges!"
      />
    </>
  );
}
