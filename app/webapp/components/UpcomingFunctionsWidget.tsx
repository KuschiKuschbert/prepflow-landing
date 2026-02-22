'use client';

import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { Calendar, ChevronRight, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardWidget } from './DashboardWidget';

interface FunctionData {
  id: string;
  name: string;
  start_date: string;
  attendees: number;
}

export default function UpcomingFunctionsWidget() {
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcomingFunctions() {
      try {
        const res = await fetch('/api/functions?limit=4');
        const data = await res.json();
        const functionArray = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        setFunctions(functionArray.slice(0, 4));
      } catch (err) {
        logger.error('Failed to fetch upcoming functions', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpcomingFunctions();
  }, []);

  return (
    <DashboardWidget
      title="Upcoming Functions"
      icon={Calendar}
      className="h-full"
      action={{ label: 'View All', href: '/webapp/functions' }}
    >
      <div className="-mx-5 -mb-5">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Icon
              icon={Loader2}
              size="lg"
              className="animate-spin text-[var(--foreground-muted)]"
              aria-hidden
            />
          </div>
        ) : functions.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-[var(--surface-hover)] p-4">
              <Icon
                icon={Calendar}
                size="xl"
                className="text-[var(--foreground-muted)]"
                aria-hidden
              />
            </div>
            <p className="mb-1 text-base font-medium text-[var(--foreground)]">
              No upcoming functions
            </p>
            <p className="mb-6 text-sm text-[var(--foreground-muted)]">
              Your calendar is clear. Time to plan the next big event!
            </p>
            <Link href="/webapp/functions">
              <Button className="bg-[var(--primary)] text-black hover:bg-[var(--primary)]/90">
                Schedule Function
              </Button>
            </Link>
          </div>
        ) : (
          <div className="custom-scrollbar h-[360px] space-y-4 overflow-y-auto p-4">
            {functions.map((func, idx) => (
              <Link
                href={`/webapp/functions/${func.id}`}
                key={func.id}
                className="group relative flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--surface-hover)] hover:shadow-md"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Subtle left border accent on hover */}
                <div className="absolute inset-y-0 left-0 w-1.5 scale-y-0 rounded-l-xl bg-[var(--primary)] transition-transform duration-300 group-hover:scale-y-100" />

                <div className="flex-1 pr-4">
                  <h4 className="text-[17px] font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                    {func.name}
                  </h4>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-2 rounded-md bg-[var(--muted)]/50 px-3 py-1 font-medium">
                      <Icon
                        icon={Calendar}
                        size="sm"
                        className="text-[var(--accent)]"
                        aria-hidden
                      />
                      {func.start_date
                        ? format(new Date(func.start_date), 'MMM d, yyyy')
                        : 'No date'}
                    </span>
                    <span className="flex items-center gap-2 rounded-md bg-[var(--muted)]/50 px-3 py-1 font-medium">
                      <Icon
                        icon={Users}
                        size="sm"
                        className="text-[var(--primary)] opacity-80"
                        aria-hidden
                      />
                      {func.attendees} guests
                    </span>
                  </div>
                </div>

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-all group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10">
                  <Icon
                    icon={ChevronRight}
                    size="md"
                    className="text-[var(--foreground-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--primary)]"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}
