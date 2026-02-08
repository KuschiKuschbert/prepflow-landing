'use client';

import { Icon } from '@/components/ui/Icon';
import { BookOpen, Package, UtensilsCrossed } from 'lucide-react';
import { RecentActivity } from './hooks/useRecentActivity';

interface RecentActivityItemProps {
  activity: RecentActivity;
}

export function RecentActivityItem({ activity }: RecentActivityItemProps) {
  return (
    <div className="tablet:space-x-4 tablet:rounded-2xl tablet:p-3 flex items-center space-x-3 rounded-xl bg-[var(--surface)]/30 p-4 transition-colors duration-200 hover:bg-[var(--surface)]/50">
      <div className="flex-shrink-0">
        <div
          className={`tablet:h-10 tablet:w-10 flex h-8 w-8 items-center justify-center rounded-full ${
            activity.type === 'ingredient'
              ? 'bg-[var(--color-info)]/20'
              : activity.type === 'recipe'
                ? 'bg-[var(--color-success)]/20'
                : 'bg-purple-500/20'
          }`}
        >
          {activity.type === 'ingredient' && (
            <Icon
              icon={Package}
              size="sm"
              className="text-[var(--color-info)]"
              aria-hidden={true}
            />
          )}
          {activity.type === 'recipe' && (
            <Icon
              icon={BookOpen}
              size="sm"
              className="text-[var(--color-success)]"
              aria-hidden={true}
            />
          )}
          {activity.type === 'menu_dish' && (
            <Icon icon={UtensilsCrossed} size="sm" className="text-purple-400" aria-hidden={true} />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-fluid-sm tablet:text-fluid-base truncate font-medium text-[var(--foreground)]">
          {activity.name}
        </p>
        <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
          {activity.action === 'created' ? 'Created' : 'Updated'} •{' '}
          {new Date(activity.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex-shrink-0">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            activity.type === 'ingredient'
              ? 'bg-[var(--color-info)]/20 text-[var(--color-info)]'
              : activity.type === 'recipe'
                ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                : 'bg-purple-500/20 text-purple-400'
          }`}
        >
          {activity.type.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
