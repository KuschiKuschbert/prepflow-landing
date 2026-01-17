import { Icon } from '@/components/ui/Icon';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface HealthReport {
  usersWithMissingSubscriptions: string[];
  subscriptionsWithMissingUsers: string[];
  mismatchedStatuses: Array<{ email: string; dbStatus: string; stripeStatus: string }>;
  totalUsers: number;
  totalSubscriptions: number;
  healthy: boolean;
}

interface BillingHealthReportProps {
  report: HealthReport | null;
}

export function BillingHealthReport({ report }: BillingHealthReportProps) {
  if (!report) return null;

  return (
    <div
      className={`rounded-2xl border p-6 ${
        report.healthy
          ? 'border-green-500/30 bg-green-500/10'
          : 'border-yellow-500/30 bg-yellow-500/10'
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon
          icon={report.healthy ? CheckCircle : AlertCircle}
          size="md"
          className={report.healthy ? 'text-green-400' : 'text-yellow-400'}
        />
        <h2 className="text-xl font-semibold text-white">
          {report.healthy ? 'Billing Health: Good' : 'Billing Health: Issues Found'}
        </h2>
      </div>

      <div className="tablet:grid-cols-3 desktop:grid-cols-4 mb-4 grid grid-cols-1 gap-4">
        <div>
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-white">{report.totalUsers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Subscriptions</p>
          <p className="text-2xl font-bold text-white">{report.totalSubscriptions}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Missing Subscriptions</p>
          <p className="text-2xl font-bold text-white">
            {report.usersWithMissingSubscriptions.length}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Status Mismatches</p>
          <p className="text-2xl font-bold text-white">{report.mismatchedStatuses.length}</p>
        </div>
      </div>

      {report.usersWithMissingSubscriptions.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-white">Users with Missing Subscriptions:</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
            {report.usersWithMissingSubscriptions.slice(0, 5).map(email => (
              <li key={email}>{email}</li>
            ))}
            {report.usersWithMissingSubscriptions.length > 5 && (
              <li className="text-gray-500">
                ...and {report.usersWithMissingSubscriptions.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}

      {report.mismatchedStatuses.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-white">Status Mismatches:</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="py-2 text-left text-gray-400">Email</th>
                  <th className="py-2 text-left text-gray-400">DB Status</th>
                  <th className="py-2 text-left text-gray-400">Stripe Status</th>
                </tr>
              </thead>
              <tbody>
                {report.mismatchedStatuses.slice(0, 5).map((mismatch, idx) => (
                  <tr key={idx} className="border-b border-[#2a2a2a]/50">
                    <td className="py-2 text-white">{mismatch.email}</td>
                    <td className="py-2 text-yellow-400">{mismatch.dbStatus}</td>
                    <td className="py-2 text-yellow-400">{mismatch.stripeStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
