'use client';

import React, { useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { formatFileSize, MAX_PHOTO_SIZE } from '@/lib/employees/photo-validation';

interface EmployeePhotoUploadProps {
  photoPreview: string | null;
  photoUploading: boolean;
  photoError: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

/**
 * Employee photo upload component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string | null} props.photoPreview - Photo preview URL or data URL
 * @param {boolean} props.photoUploading - Whether photo is currently uploading
 * @param {string | null} props.photoError - Photo upload error message
 * @param {Function} props.onPhotoChange - Photo change handler
 * @param {Function} props.onRemovePhoto - Remove photo handler
 * @returns {JSX.Element} Rendered photo upload component
 */
export function EmployeePhotoUpload({
  photoPreview,
  photoUploading,
  photoError,
  onPhotoChange,
  onRemovePhoto,
}: EmployeePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
        Photo
        <span className="ml-2 text-xs text-[var(--foreground-subtle)]">
          (Max {formatFileSize(MAX_PHOTO_SIZE)}, JPG/PNG/WebP)
        </span>
      </label>
      <div className="flex items-center gap-4">
        {photoPreview ? (
          <div className="relative">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-[var(--border)]">
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
                    className="animate-spin text-[var(--foreground)]"
                    aria-hidden={true}
                  />
                </div>
              )}
            </div>
            {!photoUploading && (
              <button
                type="button"
                onClick={onRemovePhoto}
                className="absolute -top-2 -right-2 rounded-full bg-[var(--color-error)] p-1 text-[var(--button-active-text)] transition-colors hover:bg-red-600"
                aria-label="Remove photo"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/50">
            {photoUploading ? (
              <Icon
                icon={Loader2}
                size="md"
                className="animate-spin text-[var(--foreground-muted)]"
                aria-hidden={true}
              />
            ) : (
              <Icon
                icon={Upload}
                size="md"
                className="text-[var(--foreground-muted)]"
                aria-hidden={true}
              />
            )}
          </div>
        )}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onPhotoChange}
            disabled={photoUploading}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors ${
              photoUploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--muted)]/80'
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
          {photoError && <p className="mt-1 text-xs text-[var(--color-error)]">{photoError}</p>}
        </div>
      </div>
    </div>
  );
}
