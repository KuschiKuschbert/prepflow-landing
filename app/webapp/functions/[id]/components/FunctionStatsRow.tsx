'use client';

import { format, parseISO } from 'date-fns';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Tag,
  UserCircle,
  Users,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useState } from 'react';
import type { AppFunction } from '@/app/api/functions/helpers/schemas';

function getGoogleMapsUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

type ExtendedFunction = AppFunction & {
  customers?: {
    first_name: string;
    last_name: string;
    company: string | null;
    phone: string | null;
    email: string | null;
  } | null;
};

function formatTimeDisplay(time: string | null | undefined): string {
  if (!time) return '';
  try {
    return format(new Date(`1970-01-01T${time}`), 'HH:mm');
  } catch {
    return time;
  }
}

function getDateTimeDisplay(func: ExtendedFunction): string {
  const startDateStr = format(parseISO(func.start_date), 'EEE, MMM do yyyy');
  const startTime = formatTimeDisplay(func.start_time);
  const endTime = formatTimeDisplay(func.end_time);

  if (func.same_day || !func.end_date || func.end_date === func.start_date) {
    const timePart =
      startTime && endTime ? `, ${startTime} — ${endTime}` : startTime ? `, ${startTime}` : '';
    return `${startDateStr}${timePart}`;
  }

  const endDateStr = format(parseISO(func.end_date), 'EEE, MMM do yyyy');
  const startPart = startTime ? `${startDateStr}, ${startTime}` : startDateStr;
  const endPart = endTime ? `${endDateStr}, ${endTime}` : endDateStr;
  return `${startPart} — ${endPart}`;
}

function getDayCount(func: ExtendedFunction): number {
  if (!func.end_date || func.same_day) return 1;
  return Math.max(
    1,
    Math.round(
      (new Date(func.end_date).getTime() - new Date(func.start_date).getTime()) / 86400000,
    ) + 1,
  );
}

interface FunctionStatsRowProps {
  func: ExtendedFunction;
  /** When provided and no client is assigned, clicking the client card opens assign flow */
  onAssignClient?: () => void;
  /** Number of other functions overlapping this function's date range */
  conflictingCount?: number;
}

export function FunctionStatsRow({
  func,
  onAssignClient,
  conflictingCount = 0,
}: FunctionStatsRowProps) {
  const dayCount = getDayCount(func);
  const isMultiDay = dayCount > 1;
  const dateTimeDisplay = getDateTimeDisplay(func);

  const clientName = func.customers
    ? `${func.customers.first_name} ${func.customers.last_name}${
        func.customers.company ? ` (${func.customers.company})` : ''
      }`
    : null;
  const clientContact =
    func.customers && (func.customers.phone || func.customers.email)
      ? [func.customers.phone, func.customers.email].filter(Boolean).join(' · ')
      : null;
  const hasContact = Boolean(clientContact);
  const canAssignClient = !clientName && Boolean(onAssignClient);

  const [clientExpanded, setClientExpanded] = useState(false);

  const handleClientCardClick = () => {
    if (hasContact) {
      setClientExpanded(prev => !prev);
    } else if (canAssignClient) {
      onAssignClient?.();
    }
  };

  const isClientCardClickable = hasContact || canAssignClient;

  const statBase =
    'flex min-h-[52px] min-w-0 items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-2.5 transition-all duration-200';
  const iconBox =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10';
  const labelClass =
    'text-[10px] font-medium tracking-wider text-[var(--foreground-muted)] uppercase';
  const valueClass = 'truncate text-sm font-medium text-[var(--foreground)]';

  return (
    <div className="tablet:grid-cols-3 desktop:grid-cols-5 grid grid-cols-2 gap-2">
      <div className={statBase}>
        <div className={iconBox}>
          <Icon icon={Calendar} size="sm" className="text-[var(--primary)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={labelClass}>When</p>
          <p className={`${valueClass} flex flex-wrap items-center gap-1.5`}>
            {dateTimeDisplay}
            {isMultiDay && (
              <span className="inline-flex shrink-0 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                {dayCount}d
              </span>
            )}
            {conflictingCount > 0 && (
              <span
                className="inline-flex shrink-0 rounded-full border border-[var(--tertiary)]/30 bg-[var(--tertiary)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--tertiary)]"
                title={`${conflictingCount} other function${conflictingCount !== 1 ? 's' : ''} on the same day${conflictingCount !== 1 ? 's' : ''}`}
              >
                {conflictingCount} conflict{conflictingCount !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      <div
        role={isClientCardClickable ? 'button' : undefined}
        tabIndex={isClientCardClickable ? 0 : undefined}
        onClick={handleClientCardClick}
        onKeyDown={
          isClientCardClickable
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClientCardClick();
                }
              }
            : undefined
        }
        className={`${statBase} ${
          isClientCardClickable
            ? 'cursor-pointer hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none'
            : ''
        }`}
      >
        <div className={iconBox}>
          <Icon icon={UserCircle} size="sm" className="text-[var(--primary)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={labelClass}>Client</p>
          <div className="flex items-center gap-1.5">
            <p className={valueClass}>{clientName ?? 'No client'}</p>
            {hasContact &&
              (clientExpanded ? (
                <Icon
                  icon={ChevronUp}
                  size="xs"
                  className="shrink-0 text-[var(--foreground-muted)]"
                  aria-hidden
                />
              ) : (
                <Icon
                  icon={ChevronDown}
                  size="xs"
                  className="shrink-0 text-[var(--foreground-muted)]"
                  aria-hidden
                />
              ))}
          </div>
          {clientExpanded && clientContact && (
            <p className="mt-0.5 truncate text-xs text-[var(--foreground-muted)]">
              {clientContact}
            </p>
          )}
          {canAssignClient && (
            <p className="mt-0.5 text-xs text-[var(--primary)] italic">Click to assign</p>
          )}
        </div>
      </div>

      <div className={statBase}>
        <div className={iconBox}>
          <Icon icon={Users} size="sm" className="text-[var(--primary)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={labelClass}>Attendees</p>
          <p className={valueClass}>{func.attendees} PAX</p>
        </div>
      </div>

      <div className={statBase}>
        <div className={iconBox}>
          <Icon icon={Tag} size="sm" className="text-[var(--primary)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={labelClass}>Type</p>
          <p className={valueClass}>{func.type}</p>
        </div>
      </div>

      {func.location ? (
        <a
          href={getGoogleMapsUrl(func.location)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${func.location} in Google Maps (opens in new tab)`}
          className={`${statBase} group cursor-pointer hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none`}
        >
          <div className={iconBox}>
            <Icon icon={MapPin} size="sm" className="text-[var(--primary)]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className={labelClass}>Location</p>
            <p
              className={`${valueClass} flex items-center gap-1.5 group-hover:text-[var(--primary)]`}
            >
              <span className="truncate">{func.location}</span>
              <Icon
                icon={ExternalLink}
                size="xs"
                className="shrink-0 opacity-70 group-hover:opacity-100"
                aria-hidden
              />
            </p>
          </div>
        </a>
      ) : (
        <div className={statBase}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]">
            <Icon icon={MapPin} size="sm" className="text-[var(--foreground-muted)]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className={labelClass}>Location</p>
            <p className="text-sm font-medium text-[var(--foreground-muted)] italic">
              No location set
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
