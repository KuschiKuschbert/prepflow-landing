'use client';
import { Icon } from '@/components/ui/Icon';
import { QRCodeModal } from '@/lib/qr-codes';
import { Award, Calendar, FileText, Mail, Phone, QrCode, User, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Employee, QualificationType } from '../types';
import { QualificationCard } from './QualificationCard';

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
  qualificationTypes,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'terminated':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

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
          className="relative z-50 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-modal-title"
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
        >
          <div className="max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1f1f1f] p-6">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Employee Photo or Avatar */}
                {employee.photo_url ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-[#29E7CD]/20">
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                    <Icon icon={User} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
                  </div>
                )}
                <div>
                  <h2 id="employee-modal-title" className="text-2xl font-bold text-white">
                    {employee.full_name}
                  </h2>
                  <p className="text-lg text-gray-400">{employee.role || 'No role specified'}</p>
                  {employee.employee_id && (
                    <p className="text-sm text-gray-500">ID: {employee.employee_id}</p>
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
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                  aria-label="Close"
                >
                  <Icon icon={X} size="md" aria-hidden={true} />
                </button>
              </div>
            </div>

            {/* Employment Information */}
            <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Icon icon={Calendar} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                Employment Information
              </h3>
              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
                <div>
                  <span className="text-sm text-gray-400">Start Date</span>
                  <p className="text-white">
                    {new Date(employee.employment_start_date).toLocaleDateString('en-AU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {employee.employment_end_date && (
                  <div>
                    <span className="text-sm text-gray-400">End Date</span>
                    <p className="text-white">
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
            {(employee.phone || employee.email || employee.emergency_contact) && (
              <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Icon icon={Phone} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {employee.phone && (
                    <div className="flex items-center gap-3">
                      <Icon icon={Phone} size="sm" className="text-gray-400" aria-hidden={true} />
                      <div>
                        <span className="text-sm text-gray-400">Phone</span>
                        <p className="text-white">
                          {employee.phone.startsWith('+61')
                            ? employee.phone
                            : `+61 ${employee.phone.replace(/^\+?61\s*/, '')}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {employee.email && (
                    <div className="flex items-center gap-3">
                      <Icon icon={Mail} size="sm" className="text-gray-400" aria-hidden={true} />
                      <div>
                        <span className="text-sm text-gray-400">Email</span>
                        <p className="text-white">{employee.email}</p>
                      </div>
                    </div>
                  )}
                  {employee.emergency_contact && (
                    <div className="flex items-center gap-3">
                      <Icon icon={User} size="sm" className="text-gray-400" aria-hidden={true} />
                      <div>
                        <span className="text-sm text-gray-400">Emergency Contact</span>
                        <p className="text-white">{employee.emergency_contact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Qualifications */}
            <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Icon icon={Award} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                Certificates & Qualifications
                <span className="rounded-full bg-[#29E7CD]/20 px-2 py-0.5 text-xs text-[#29E7CD]">
                  {qualifications.length}
                </span>
              </h3>
              {qualifications.length === 0 ? (
                <p className="text-sm text-gray-400">No qualifications added yet</p>
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
              <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                  <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                  Notes
                </h3>
                <p className="text-sm whitespace-pre-wrap text-gray-300">{employee.notes}</p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#2a2a2a] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#3a3a3a]"
                title="Generate ID badge with QR code"
              >
                <Icon icon={QrCode} size="sm" />
                ID Badge
              </button>
              <button
                onClick={onClose}
                className="rounded-xl bg-[#2a2a2a] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#3a3a3a]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-2.5 font-medium text-black transition-all duration-200 hover:shadow-xl"
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
