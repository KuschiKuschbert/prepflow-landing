import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Icon
          icon={Search}
          size="sm"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search users by email or name..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:outline-none"
        />
      </div>
    </div>
  );
}
