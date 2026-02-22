'use client';

import type { AppFunction } from '@/app/api/functions/helpers/schemas';
import { Card } from '@/components/ui/Card';
import {
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { Icon } from '@/components/ui/Icon';
import { ChevronLeft, ChevronRight, Clock, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Wedding':
      return 'bg-pink-400';
    case 'Birthday':
      return 'bg-amber-400';
    case 'Kids Birthday':
      return 'bg-orange-400';
    case 'Christmas Party':
      return 'bg-red-400';
    case 'Wake':
      return 'bg-slate-400';
    default:
      return 'bg-[var(--primary)]';
  }
};

function formatTimeStr(time: string | null | undefined): string {
  if (!time) return '';
  try {
    return format(new Date(`1970-01-01T${time}`), 'h:mm a');
  } catch {
    return time;
  }
}

interface MiniCalendarPanelProps {
  events: AppFunction[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  embedded?: boolean;
}

export function MiniCalendarPanel({
  events,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
  embedded = false,
}: MiniCalendarPanelProps) {
  const now = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();

  const getEventsForDay = (day: Date) =>
    events.filter(e => {
      try {
        const startStr = e.start_date.slice(0, 10);
        const endStr = e.end_date ? e.end_date.slice(0, 10) : startStr;
        const dayStr = format(day, 'yyyy-MM-dd');
        return dayStr >= startStr && dayStr <= endStr;
      } catch {
        return false;
      }
    });

  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => {
        const eventEnd = e.end_date || e.start_date;
        return new Date(eventEnd) >= new Date(now.toISOString().slice(0, 10));
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 8);
  }, [events, now]);

  const getCountdown = (dateStr: string) => {
    const days = differenceInDays(new Date(dateStr), now);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days}d`;
  };

  const uniqueTypes = [...new Set(events.map(e => e.type))].sort();

  const Wrapper = embedded ? 'div' : Card;
  const wrapperClassName = embedded ? 'overflow-hidden' : 'sticky top-20 overflow-hidden';

  return (
    <Wrapper className={wrapperClassName}>
      {/* Month navigation */}
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-semibold text-[var(--foreground)]">
          {format(currentMonth, 'MMM yyyy')}
        </h3>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="rounded-md p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Previous month"
          >
            <Icon icon={ChevronLeft} size="xs" aria-hidden />
          </button>
          <button
            onClick={() => onMonthChange(new Date())}
            className="rounded-md px-1.5 py-0.5 text-[9px] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Today
          </button>
          <button
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="rounded-md p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Next month"
          >
            <Icon icon={ChevronRight} size="xs" aria-hidden />
          </button>
        </div>
      </div>

      {/* Day grid */}
      <div className="px-2 pb-2">
        <div className="mb-0.5 grid grid-cols-7">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={`${day}-${i}`}
              className="flex items-center justify-center py-0.5 text-[9px] font-semibold text-[var(--foreground-muted)]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7" />
          ))}

          {daysInMonth.map(day => {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(isSelected ? null : day)}
                className={`relative flex h-7 flex-col items-center justify-center rounded-md text-[10px] transition-all ${
                  !isCurrentMonth ? 'opacity-30' : ''
                } ${
                  isSelected
                    ? 'bg-[var(--primary)] font-bold text-white shadow-[var(--primary)]/40 shadow-md'
                    : isTodayDate && hasEvents
                      ? 'bg-[var(--primary)]/40 font-bold text-[var(--primary)] ring-2 ring-[var(--primary)]'
                      : isTodayDate
                        ? 'bg-[var(--primary)]/25 font-bold text-[var(--primary)]'
                        : hasEvents
                          ? 'bg-[var(--primary)]/30 font-semibold text-[var(--foreground)] hover:bg-[var(--primary)]/45'
                          : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)]/50'
                }`}
                aria-label={`${format(day, 'MMMM d')}${hasEvents ? `, ${dayEvents.length} events` : ''}`}
              >
                <span>{format(day, 'd')}</span>
                {hasEvents && (
                  <div className="absolute bottom-0.5 flex gap-px">
                    {dayEvents.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className={`h-[3px] w-[3px] rounded-full ${isSelected ? 'bg-white/80' : getEventTypeColor(ev.type)}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date filter indicator */}
      {selectedDate && (
        <div className="flex items-center justify-between border-t border-[var(--border)] px-3 py-1.5">
          <span className="text-[10px] text-[var(--foreground-muted)]">
            Filtered:{' '}
            <span className="font-medium text-[var(--foreground)]">
              {format(selectedDate, 'MMM d, yyyy')}
            </span>
          </span>
          <button
            onClick={() => onDateSelect(null)}
            className="rounded-md p-0.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Clear date filter"
          >
            <Icon icon={X} size="xs" aria-hidden />
          </button>
        </div>
      )}

      {/* Upcoming events list (below calendar) */}
      {upcomingEvents.length > 0 && (
        <div className="border-t border-[var(--border)]">
          <div className="px-3 pt-2 pb-1">
            <p className="text-[9px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
              Upcoming Events
            </p>
          </div>
          <div className="space-y-px px-1.5 pb-2">
            {upcomingEvents.map(event => {
              const countdown = getCountdown(event.start_date);
              const isActive = countdown === 'Today';
              return (
                <Link
                  key={event.id}
                  href={`/webapp/functions/${event.id}`}
                  className={`group flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--muted)]/60 ${
                    isActive ? 'bg-[var(--primary)]/5' : ''
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 flex-shrink-0 flex-col items-center justify-center rounded-lg text-center ${
                      isActive
                        ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                        : 'bg-[var(--muted)] text-[var(--foreground-secondary)]'
                    }`}
                  >
                    <span className="text-[8px] leading-none font-semibold uppercase">
                      {format(parseISO(event.start_date), 'MMM')}
                    </span>
                    <span className="text-xs leading-none font-bold">
                      {format(parseISO(event.start_date), 'd')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                      {event.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[9px] text-[var(--foreground-muted)]">
                      <span className="flex items-center gap-0.5">
                        <Icon icon={Clock} size="xs" aria-hidden />
                        {formatTimeStr(event.start_time) ||
                          format(parseISO(event.start_date), 'MMM d')}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Icon icon={Users} size="xs" aria-hidden />
                        {event.attendees}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`mt-1 flex-shrink-0 text-[9px] font-medium ${
                      isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'
                    }`}
                  >
                    {countdown}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </Wrapper>
  );
}
