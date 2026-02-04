'use client';

import { Icon } from '@/components/ui/Icon';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface KitchenOperation {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
  status: 'good' | 'warning' | 'error';
}

interface KitchenOperationCardProps {
  operation: KitchenOperation;
}

export function KitchenOperationCard({ operation }: KitchenOperationCardProps) {
  const { title, value, description, icon, href, status } = operation;

  return (
    <Link
      href={href}
      className="group tablet:rounded-2xl tablet:p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/30 p-4 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-[var(--primary)]/10 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="text-fluid-xs tablet:text-fluid-sm min-w-0 flex-1 truncate font-medium text-[var(--foreground)]/60">
              {title}
            </p>
            {status === 'good' && (
              <span className="flex-shrink-0 rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap text-[var(--color-success)]">
                Ready
              </span>
            )}
            {status === 'warning' && (
              <span className="flex-shrink-0 rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap text-[var(--color-warning)]">
                Needs Attention
              </span>
            )}
            {title === 'Low Stock Alerts' && value > 0 && (
              <span className="flex-shrink-0 rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap text-[var(--color-warning)]">
                Low Stock
              </span>
            )}
          </div>
          <p
            className={`text-fluid-2xl tablet:text-fluid-3xl font-bold ${
              status === 'good'
                ? 'text-[var(--primary)]'
                : status === 'warning'
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-error)]'
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
            status === 'good'
              ? 'from-[var(--primary)]/20 to-[var(--primary)]/10'
              : status === 'warning'
                ? 'from-[var(--color-warning)]/20 to-[var(--color-warning)]/10'
                : 'from-[var(--color-error)]/20 to-[var(--color-error)]/10'
          }`}
        >
          <Icon
            icon={icon}
            size="md"
            className={
              status === 'good'
                ? 'text-[var(--primary)]'
                : status === 'warning'
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-error)]'
            }
            aria-hidden={true}
          />
        </div>
      </div>
      <div className="tablet:mt-4 mt-3">
        <p className="text-fluid-xs line-clamp-2 text-[var(--foreground)]/60">{description}</p>
      </div>
    </Link>
  );
}
