import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-3">
        <Link
          href="/admin/users"
          className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
        >
          <h3 className="mb-1 font-semibold text-white">Manage Users</h3>
          <p className="text-sm text-gray-400">View and edit user accounts</p>
        </Link>
        <Link
          href="/admin/system"
          className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
        >
          <h3 className="mb-1 font-semibold text-white">System Health</h3>
          <p className="text-sm text-gray-400">Monitor system performance</p>
        </Link>
        <Link
          href="/admin/errors"
          className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
        >
          <h3 className="mb-1 font-semibold text-white">View Errors</h3>
          <p className="text-sm text-gray-400">Check recent error logs</p>
        </Link>
        <Link
          href="/admin/support-tickets"
          className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
        >
          <h3 className="mb-1 font-semibold text-white">Support Tickets</h3>
          <p className="text-sm text-gray-400">Manage user-reported issues</p>
        </Link>
      </div>
    </div>
  );
}
