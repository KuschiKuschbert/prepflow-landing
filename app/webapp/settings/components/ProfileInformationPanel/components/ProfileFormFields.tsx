'use client';

import type { ProfileFormData } from '../types';

interface ProfileFormFieldsProps {
  email: string;
  formData: ProfileFormData;
  onFieldChange: (field: keyof ProfileFormData, value: string) => void;
}

/**
 * Profile form fields component
 */
export function ProfileFormFields({ email, formData, onFieldChange }: ProfileFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Email (Read-only) */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full cursor-not-allowed rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-[var(--foreground-muted)]"
        />
        <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
          Email is managed by your authentication provider and can&apos;t be changed here.
        </p>
      </div>

      {/* First Name */}
      <div>
        <label
          htmlFor="first_name"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          First Name
        </label>
        <input
          id="first_name"
          type="text"
          value={formData.first_name}
          onChange={e => onFieldChange('first_name', e.target.value)}
          maxLength={100}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="Enter your first name"
        />
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="last_name"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          Last Name
        </label>
        <input
          id="last_name"
          type="text"
          value={formData.last_name}
          onChange={e => onFieldChange('last_name', e.target.value)}
          maxLength={100}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="Enter your last name"
        />
      </div>

      {/* Business Name */}
      <div>
        <label
          htmlFor="business_name"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          Business Name
        </label>
        <input
          id="business_name"
          type="text"
          value={formData.business_name}
          onChange={e => onFieldChange('business_name', e.target.value)}
          maxLength={255}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="Enter your business name"
        />
      </div>
    </div>
  );
}
