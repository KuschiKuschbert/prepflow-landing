'use client';

import React, { useState } from 'react';
import { Employee, QualificationType } from '../types';
import { QualificationCard } from './QualificationCard';
import { QualificationForm } from './QualificationForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp, Award, User } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import Image from 'next/image';

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
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'terminated':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div
      id={`employee-${employee.id}`}
      className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Employee Photo or Initial Avatar */}
          {employee.photo_url ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-[#29E7CD]/20">
              {employee.photo_url.startsWith('data:') ? (
                <img
                  src={employee.photo_url}
                  alt={employee.full_name}
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon icon={User} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-white">{employee.full_name}</h3>
            <p className="text-gray-400">{employee.role || 'No role specified'}</p>
            {employee.employee_id && (
              <p className="text-xs text-gray-500">ID: {employee.employee_id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(employee.status)}`}
          >
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </span>
          <button
            onClick={() => onEdit(employee)}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
            aria-label={`Edit ${employee.full_name}`}
          >
            <Icon icon={Edit2} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-red-400"
            aria-label={`Delete ${employee.full_name}`}
          >
            <Icon icon={Trash2} size="sm" aria-hidden={true} />
          </button>
        </div>
      </div>

      {/* Certificates & Qualifications Button - Prominent */}
      <div className="mb-4">
        <button
          onClick={() => setShowQualifications(!showQualifications)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-4 py-3 font-medium text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20 hover:shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Icon icon={Award} size="md" aria-hidden={true} />
            <span>Certificates & Qualifications</span>
            <span className="rounded-full bg-[#29E7CD]/20 px-2 py-0.5 text-xs">
              {qualifications.length}
            </span>
          </div>
          <Icon icon={showQualifications ? ChevronUp : ChevronDown} size="sm" aria-hidden={true} />
        </button>
      </div>

      <div className="desktop:grid-cols-2 mb-4 grid grid-cols-1 gap-4">
        <div>
          <span className="text-sm text-gray-400">Employment Start: </span>
          <span className="text-white">
            {new Date(employee.employment_start_date).toLocaleDateString('en-AU')}
          </span>
        </div>
        {employee.employment_end_date && (
          <div>
            <span className="text-sm text-gray-400">Employment End: </span>
            <span className="text-white">
              {new Date(employee.employment_end_date).toLocaleDateString('en-AU')}
            </span>
          </div>
        )}
        {employee.phone && (
          <div>
            <span className="text-sm text-gray-400">Phone: </span>
            <span className="text-white">{employee.phone}</span>
          </div>
        )}
        {employee.email && (
          <div>
            <span className="text-sm text-gray-400">Email: </span>
            <span className="text-white">{employee.email}</span>
          </div>
        )}
      </div>

      {/* Qualifications Section */}
      {showQualifications && (
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="mb-3 flex items-center justify-end">
            <button
              onClick={() => setShowAddQualification(!showAddQualification)}
              className="flex items-center gap-2 rounded-xl bg-[#29E7CD]/10 px-3 py-1.5 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
            >
              <Icon icon={Plus} size="sm" aria-hidden={true} />
              Add Qualification
            </button>
          </div>

          {showAddQualification && (
            <div className="mb-4">
              <QualificationForm
                qualificationTypes={qualificationTypes}
                onSubmit={handleAddQualification}
                onCancel={() => setShowAddQualification(false)}
              />
            </div>
          )}

          <div className="space-y-3">
            {qualifications.length === 0 ? (
              <p className="text-sm text-gray-400">No qualifications added yet</p>
            ) : (
              qualifications.map(qual => (
                <QualificationCard
                  key={qual.id}
                  qualification={qual}
                  onDelete={() => handleDeleteQualification(qual.id)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Qualification Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteQualConfirm}
        title="Remove Qualification"
        message="Are you sure you want to remove this qualification? This action cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteQualification}
        onCancel={() => {
          setShowDeleteQualConfirm(false);
          setQualToDelete(null);
        }}
        variant="warning"
      />
    </div>
  );
}
