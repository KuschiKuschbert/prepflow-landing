interface UserBasicInfoProps {
  formData: {
    first_name: string;
    last_name: string;
    business_name: string;
  };
  setFormData: (data: any) => void;
  email: string;
  emailVerified: boolean;
}

import { Icon } from '@/components/ui/Icon';
import { Mail } from 'lucide-react';

export function UserBasicInfo({ formData, setFormData, email, emailVerified }: UserBasicInfoProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Business Name</label>
          <input
            type="text"
            value={formData.business_name}
            onChange={e => setFormData({ ...formData, business_name: e.target.value })}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Email</label>
          <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
            <Icon icon={Mail} size="sm" />
            <span>{email}</span>
            {emailVerified && <span className="ml-auto text-xs text-green-400">Verified</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
