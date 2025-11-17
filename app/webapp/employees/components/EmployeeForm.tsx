'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Employee, EmployeeFormData, QualificationType } from '../types';
import { Award, Upload, X, Loader2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { validatePhoto, formatFileSize, MAX_PHOTO_SIZE } from '@/lib/employees/photo-validation';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';

interface EmployeeFormProps {
  employee?: Employee | null;
  formData?: EmployeeFormData;
  qualificationTypes: QualificationType[];
  onChange?: (data: EmployeeFormData) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onUpdate?: (employee: Employee, updates: Partial<EmployeeFormData>) => void;
  onCancel: () => void;
}

export function EmployeeForm({
  employee,
  formData: externalFormData,
  qualificationTypes,
  onChange,
  onSubmit,
  onUpdate,
  onCancel,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(
    employee
      ? {
          employee_id: employee.employee_id || '',
          full_name: employee.full_name,
          role: employee.role || '',
          employment_start_date: employee.employment_start_date,
          employment_end_date: employee.employment_end_date || '',
          status: employee.status,
          phone: employee.phone || '',
          email: employee.email || '',
          emergency_contact: employee.emergency_contact || '',
          photo_url: employee.photo_url || '',
          notes: employee.notes || '',
        }
      : externalFormData || {
          employee_id: '',
          full_name: '',
          role: '',
          employment_start_date: new Date().toISOString().split('T')[0],
          employment_end_date: '',
          status: 'active',
          phone: '',
          email: '',
          emergency_contact: '',
          photo_url: '',
          notes: '',
        },
  );

  const [photoPreview, setPhotoPreview] = useState<string | null>(employee?.photo_url || null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null); // Store path for deletion
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
    }
  }, [externalFormData]);

  useEffect(() => {
    // Initialize photoPath when editing existing employee
    if (employee?.photo_url && !photoPath) {
      // Extract filename from URL for deletion tracking
      const fileName = employee.photo_url.split('/').pop();
      if (fileName) {
        setPhotoPath(fileName);
      }
    }
  }, [employee, photoPath]);

  const handleChange = (field: keyof EmployeeFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setPhotoError(null);

    // Validate file
    const validation = validatePhoto(file);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid photo file');
      showError(validation.error || 'Invalid photo file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employee?.id || 'temp');

      const response = await fetch('/api/employees/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to upload photo');
      }

      // Store the new photo URL and path
      setPhotoPath(data.data.path);
      handleChange('photo_url', data.data.url);
      setPhotoError(null);
      showSuccess('Photo uploaded successfully');
    } catch (error: any) {
      logger.error('Error uploading photo:', error);
      const errorMessage = error.message || 'Failed to upload photo. Please try again.';
      setPhotoError(errorMessage);
      setPhotoPreview(null);
      showError(errorMessage);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    // Delete photo from storage if it exists
    if (photoPath || employee?.photo_url) {
      try {
        const pathToDelete = photoPath || employee?.photo_url;
        if (pathToDelete && !pathToDelete.startsWith('data:')) {
          // Extract filename from URL or path
          const fileName = pathToDelete.split('/').pop() || pathToDelete;
          await fetch(`/api/employees/upload-photo?path=${encodeURIComponent(fileName)}`, {
            method: 'DELETE',
          });
        }
      } catch (error) {
        logger.error('Error deleting photo:', error);
        // Don't block removal if delete fails
      }
    }

    setPhotoPreview(null);
    setPhotoPath(null);
    handleChange('photo_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewCertificates = () => {
    // Scroll to qualifications section in the employee card
    // This will be handled by the parent component
    if (employee) {
      const element = document.getElementById(`employee-${employee.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee && onUpdate) {
      onUpdate(employee, formData);
    } else if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="mb-6 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        {/* Employee ID */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Employee ID</label>
          <input
            type="text"
            value={formData.employee_id}
            onChange={e => handleChange('employee_id', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., EMP001, STAFF-2024-001"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Photo
            <span className="ml-2 text-xs text-gray-500">
              (Max {formatFileSize(MAX_PHOTO_SIZE)}, JPG/PNG/WebP)
            </span>
          </label>
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <div className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-[#2a2a2a]">
                  {photoPreview.startsWith('data:') ? (
                    <Image
                      src={photoPreview}
                      alt="Employee photo"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={photoPreview}
                      alt="Employee photo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  {photoUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Icon
                        icon={Loader2}
                        size="md"
                        className="animate-spin text-white"
                        aria-hidden={true}
                      />
                    </div>
                  )}
                </div>
                {!photoUploading && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    aria-label="Remove photo"
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-[#2a2a2a] bg-[#2a2a2a]/50">
                {photoUploading ? (
                  <Icon
                    icon={Loader2}
                    size="md"
                    className="animate-spin text-gray-400"
                    aria-hidden={true}
                  />
                ) : (
                  <Icon icon={Upload} size="md" className="text-gray-400" aria-hidden={true} />
                )}
              </div>
            )}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={photoUploading}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={`flex cursor-pointer items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors ${
                  photoUploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#2a2a2a]/80'
                }`}
              >
                {photoUploading ? (
                  <>
                    <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Icon icon={Upload} size="sm" aria-hidden={true} />
                    <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  </>
                )}
              </label>
              {photoError && <p className="mt-1 text-xs text-red-400">{photoError}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={e => handleChange('full_name', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Role/Position</label>
          <input
            type="text"
            value={formData.role}
            onChange={e => handleChange('role', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Head Chef, Line Cook, Food Handler"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Employment Start Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={formData.employment_start_date}
            onChange={e => handleChange('employment_start_date', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Employment End Date
          </label>
          <input
            type="date"
            value={formData.employment_end_date}
            onChange={e => handleChange('employment_end_date', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
          <select
            value={formData.status}
            onChange={e =>
              handleChange('status', e.target.value as 'active' | 'inactive' | 'terminated')
            }
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Emergency Contact</label>
          <input
            type="text"
            value={formData.emergency_contact}
            onChange={e => handleChange('emergency_contact', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Name and phone number"
          />
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">Notes</label>
          <textarea
            value={formData.notes}
            onChange={e => handleChange('notes', e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            rows={3}
            placeholder="Additional notes about this employee"
          />
        </div>

        {/* Certificates & Qualifications Button (only when editing) */}
        {employee && employee.employee_qualifications && (
          <div className="desktop:col-span-2">
            <button
              type="button"
              onClick={handleViewCertificates}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-6 py-3 font-medium text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20 hover:shadow-lg"
            >
              <Icon icon={Award} size="md" aria-hidden={true} />
              View Certificates & Qualifications ({employee.employee_qualifications.length})
            </button>
          </div>
        )}

        <div className="desktop:col-span-2 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2a2a2a]/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {employee ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
