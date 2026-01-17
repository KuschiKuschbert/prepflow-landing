interface Subscription {
  id: string;
  customer_email: string;
  status: string;
  amount: number;
  created_at: string;
}

interface BillingData {
  subscriptions: Subscription[];
}

interface SubscriptionsTableProps {
  data: BillingData | null;
}

export function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Subscriptions</h2>
      {data?.subscriptions && data.subscriptions.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-[#2a2a2a]">
          <table className="min-w-full divide-y divide-[#2a2a2a]">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
              {data.subscriptions.map(sub => (
                <tr key={sub.id} className="transition-colors hover:bg-[#2a2a2a]/20">
                  <td className="px-6 py-4 text-sm text-white">{sub.customer_email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        sub.status === 'active'
                          ? 'bg-green-500/10 text-green-400'
                          : sub.status === 'trialing'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">${(sub.amount / 100).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-gray-400">No subscriptions found</p>
      )}
    </div>
  );
}
