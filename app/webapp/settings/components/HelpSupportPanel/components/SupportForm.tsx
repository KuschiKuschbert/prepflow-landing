'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle } from 'lucide-react';
import type { SupportFormData } from '../types';

interface SupportFormProps {
  formData: SupportFormData;
  submitting: boolean;
  onFormDataChange: (data: SupportFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

/**
 * Support contact form component
 */
export function SupportForm({
  formData,
  submitting,
  onFormDataChange,
  onSubmit,
  onCancel,
}: SupportFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 border-t border-[var(--border)] pt-4">
      {formData.related_error_id && (
        <div className="rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3 text-sm text-[var(--primary)]">
          <Icon icon={AlertTriangle} size="sm" className="mb-1 inline-block" aria-hidden={true} />{' '}
          Reporting a specific error. Error details will be automatically included.
        </div>
      )}
      <div>
        <label
          htmlFor="support-type"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          Request Type
        </label>
        <select
          id="support-type"
          value={formData.type}
          onChange={e =>
            onFormDataChange({ ...formData, type: e.target.value as SupportFormData['type'] })
          }
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="question">Question</option>
          <option value="bug">Report a Bug</option>
          <option value="error">Report an Error</option>
          <option value="feature">Feature Request</option>
          <option value="other">Other</option>
        </select>
      </div>
      {formData.related_error_id && (
        <input type="hidden" name="related_error_id" value={formData.related_error_id} />
      )}

      <div>
        <label
          htmlFor="support-subject"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          Subject
        </label>
        <input
          id="support-subject"
          type="text"
          value={formData.subject}
          onChange={e => onFormDataChange({ ...formData, subject: e.target.value })}
          required
          maxLength={200}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="Brief description of your request"
        />
      </div>

      <div>
        <label
          htmlFor="support-message"
          className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
        >
          Message
        </label>
        <textarea
          id="support-message"
          value={formData.message}
          onChange={e => onFormDataChange({ ...formData, message: e.target.value })}
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="Please provide as much detail as possible..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}
