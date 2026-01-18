'use client';
import { Icon } from '@/components/ui/Icon';

interface EmailFormProps {
  emailAddress: string;
  emailSubject: string;
  displayTitle: string;
  onEmailChange: (email: string) => void;
  onSubjectChange: (subject: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function EmailForm({
  emailAddress,
  emailSubject,
  displayTitle,
  onEmailChange,
  onSubjectChange,
  onSubmit,
  onCancel,
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
        <input
          type="email"
          value={emailAddress}
          onChange={e => onEmailChange(e.target.value)}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          placeholder="recipient@example.com"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Subject</label>
        <input
          type="text"
          value={emailSubject}
          onChange={e => onSubjectChange(e.target.value)}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          placeholder={displayTitle}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/30"
        >
          Send Email
        </button>
      </div>
    </form>
  );
}
