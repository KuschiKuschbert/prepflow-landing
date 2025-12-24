/**
 * Account activity section component.
 */
import { Icon } from '@/components/ui/Icon';
import { Activity } from 'lucide-react';

interface AccountActivity {
  id: string;
  action_type: string;
  entity_type: string;
  created_at: string;
}

interface AccountActivitySectionProps {
  recentActivity: AccountActivity[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AccountActivitySection({ recentActivity }: AccountActivitySectionProps) {
  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-4">
      <div className="flex items-center gap-2">
        <Icon icon={Activity} size="md" className="text-[var(--primary)]" aria-hidden={true} />
        <h3 className="text-lg font-medium">Recent Activity</h3>
      </div>
      {recentActivity.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">No recent activity to display.</p>
      ) : (
        <div className="space-y-2">
          {recentActivity.slice(0, 10).map(activity => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] capitalize">
                  {activity.action_type} {activity.entity_type}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {formatDate(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
