interface UserSubscriptionInfoProps {
  formData: {
    subscription_status: string;
  };
  setFormData: (data: any) => void; // justified
  user: {
    created_at: string;
    subscription_expires: string | null;
    last_login: string | null;
  };
}

import { Icon } from '@/components/ui/Icon';
import { Calendar, User } from 'lucide-react';

export function UserSubscriptionInfo({ formData, setFormData, user }: UserSubscriptionInfoProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Subscription</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Status</label>
          <select
            value={formData.subscription_status}
            onChange={e => setFormData({ ...formData, subscription_status: e.target.value })}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
          >
            <option value="trial">Trial</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Created</label>
          <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
            <Icon icon={Calendar} size="sm" />
            <span>{new Date(user.created_at).toLocaleString()}</span>
          </div>
        </div>
        {user.subscription_expires && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Expires</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
              <Icon icon={Calendar} size="sm" />
              <span>{new Date(user.subscription_expires).toLocaleString()}</span>
            </div>
          </div>
        )}
        {user.last_login && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Last Login</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-gray-400">
              <Icon icon={User} size="sm" />
              <span>{new Date(user.last_login).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
