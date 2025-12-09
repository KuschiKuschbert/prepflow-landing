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
    <form onSubmit={onSubmit} className="space-y-4 border-t border-[#2a2a2a] pt-4">
      {formData.related_error_id && (
        <div className="rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-3 text-sm text-[#29E7CD]">
          <Icon icon={AlertTriangle} size="sm" className="mb-1 inline-block" aria-hidden={true} />{' '}
          Reporting a specific error. Error details will be automatically included.
        </div>
      )}
      <div>
        <label htmlFor="support-type" className="mb-2 block text-sm font-medium text-gray-300">
          Request Type
        </label>
        <select
          id="support-type"
          value={formData.type}
          onChange={e =>
            onFormDataChange({ ...formData, type: e.target.value as SupportFormData['type'] })
          }
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
        <label htmlFor="support-subject" className="mb-2 block text-sm font-medium text-gray-300">
          Subject
        </label>
        <input
          id="support-subject"
          type="text"
          value={formData.subject}
          onChange={e => onFormDataChange({ ...formData, subject: e.target.value })}
          required
          maxLength={200}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="Brief description of your request"
        />
      </div>

      <div>
        <label htmlFor="support-message" className="mb-2 block text-sm font-medium text-gray-300">
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
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="Please provide as much detail as possible..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}
