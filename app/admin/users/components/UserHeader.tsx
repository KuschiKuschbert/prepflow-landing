import { Icon } from '@/components/ui/Icon';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface UserHeaderProps {
  email: string;
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
}

export function UserHeader({ email, saving, onSave, onDelete }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="text-gray-400 transition-colors hover:text-white">
          <Icon icon={ArrowLeft} size="md" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">User Details</h1>
          <p className="mt-2 text-gray-400">{email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 disabled:opacity-50"
        >
          <Icon icon={Save} size="sm" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20"
        >
          <Icon icon={Trash2} size="sm" />
          Delete User
        </button>
      </div>
    </div>
  );
}
