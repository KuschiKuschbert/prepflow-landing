import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export interface DashboardWidgetProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  action?: {
    label: string;
    href: string;
  };
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardWidget({
  title,
  icon: iconComponent,
  iconColor = 'var(--accent)',
  action,
  headerAction,
  children,
  className = '',
}: DashboardWidgetProps) {
  return (
    <Card
      className={`premium-card-hover flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg transition-all duration-200 ${className}`}
    >
      {/* Widget Header */}
      <div className="flex flex-row items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <Icon icon={iconComponent} size="md" style={{ color: iconColor }} aria-hidden />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {headerAction}
          {action && (
            <Link href={action.href}>
              <Button
                variant="outline"
                size="sm"
                className="-mr-2 h-auto border-none bg-transparent p-0 pr-2 text-[var(--primary)] hover:bg-transparent hover:text-[var(--primary)]/80"
              >
                {action.label}
                <Icon icon={ChevronRight} size="sm" className="ml-1" aria-hidden />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 p-5">{children}</div>
    </Card>
  );
}
