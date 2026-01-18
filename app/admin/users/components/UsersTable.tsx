import { Icon } from '@/components/ui/Icon';
import { Edit, Eye, User } from 'lucide-react';
import Link from 'next/link';
import type { User as UserType } from '../hooks/useUsers';

interface UsersTableProps {
  users: UserType[];
  loading: boolean;
}

export function UsersTable({ users, loading }: UsersTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 rounded bg-[#2a2a2a]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Subscription
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Last Login
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                No users found
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id} className="transition-colors hover:bg-[#2a2a2a]/20">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]">
                      <Icon icon={User} size="sm" className="text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : 'No name'}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.subscription_status === 'active'
                        ? 'bg-green-500/10 text-green-400'
                        : user.subscription_status === 'trialing'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-gray-500/10 text-gray-400'
                    }`}
                  >
                    {user.subscription_status || 'trial'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
                      title="View user"
                    >
                      <Icon icon={Eye} size="sm" />
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-gray-400 transition-colors hover:text-white"
                      title="Edit user"
                    >
                      <Icon icon={Edit} size="sm" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
