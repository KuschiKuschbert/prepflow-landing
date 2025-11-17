'use client';

import React from 'react';
import { EmployeeQualification } from '../types';
import { Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface QualificationCardProps {
  qualification: EmployeeQualification;
  onDelete: () => void;
}

export function QualificationCard({ qualification, onDelete }: QualificationCardProps) {
  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(qualification.expiry_date);

  const getExpiryColor = () => {
    if (daysUntilExpiry === null) return 'text-gray-400';
    if (daysUntilExpiry < 0) return 'text-red-400';
    if (daysUntilExpiry < 30) return 'text-yellow-400';
    if (daysUntilExpiry < 90) return 'text-orange-400';
    return 'text-green-400';
  };

  const getExpiryText = () => {
    if (daysUntilExpiry === null) return 'No expiry date';
    if (daysUntilExpiry < 0) return `${Math.abs(daysUntilExpiry)} days overdue`;
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry < 30) return `${daysUntilExpiry} days until expiry`;
    return `Expires ${new Date(qualification.expiry_date!).toLocaleDateString('en-AU')}`;
  };

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-semibold text-white">
              {qualification.qualification_types?.name || 'Unknown Qualification'}
            </h4>
            {qualification.qualification_types?.is_required && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                Required
              </span>
            )}
          </div>
          {qualification.certificate_number && (
            <p className="mb-1 text-sm text-gray-400">
              Certificate: {qualification.certificate_number}
            </p>
          )}
          {qualification.issuing_authority && (
            <p className="mb-1 text-sm text-gray-400">
              Issued by: {qualification.issuing_authority}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-gray-400">Issue Date: </span>
              <span className="text-white">
                {new Date(qualification.issue_date).toLocaleDateString('en-AU')}
              </span>
            </div>
            {qualification.expiry_date && (
              <div>
                <span className="text-gray-400">Expiry: </span>
                <span className={getExpiryColor()}>{getExpiryText()}</span>
              </div>
            )}
          </div>
          {qualification.notes && (
            <p className="mt-2 text-sm text-gray-400">{qualification.notes}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="ml-4 rounded-xl p-2 text-gray-400 transition-colors hover:bg-[#1f1f1f] hover:text-red-400"
          aria-label="Delete qualification"
        >
          <Icon icon={Trash2} size="sm" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
