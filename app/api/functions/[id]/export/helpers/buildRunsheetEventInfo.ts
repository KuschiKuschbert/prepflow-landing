import { format, parseISO } from 'date-fns';
import { escapeHtml } from '@/lib/exports/template-utils';

export type FunctionWithCustomer = {
  name: string;
  type: string;
  start_date: string;
  start_time?: string | null;
  end_date?: string | null;
  end_time?: string | null;
  same_day?: boolean;
  attendees: number;
  location?: string | null;
  notes?: string | null;
  customers?: {
    first_name: string;
    last_name: string;
    company?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
};

function formatTime(time: string | null): string {
  if (!time) return '—';
  try {
    return format(new Date(`1970-01-01T${time}`), 'HH:mm');
  } catch {
    return time;
  }
}

export function getEventDateTimeDisplay(func: FunctionWithCustomer): string {
  const startDateStr = format(parseISO(func.start_date), 'EEE, MMM do yyyy');
  const startTime = formatTime(func.start_time ?? null);
  const endTime = formatTime(func.end_time ?? null);

  if (func.same_day || !func.end_date || func.end_date === func.start_date) {
    const timePart =
      startTime && endTime && startTime !== '—' && endTime !== '—'
        ? `, ${startTime} — ${endTime}`
        : startTime && startTime !== '—'
          ? `, ${startTime}`
          : '';
    return `${startDateStr}${timePart}`;
  }

  const endDateStr = format(parseISO(func.end_date), 'EEE, MMM do yyyy');
  const startPart = startTime && startTime !== '—' ? `${startDateStr}, ${startTime}` : startDateStr;
  const endPart = endTime && endTime !== '—' ? `${endDateStr}, ${endTime}` : endDateStr;
  return `${startPart} — ${endPart}`;
}

export function buildEventInfoHtml(func: FunctionWithCustomer): string {
  const customer = func.customers;
  const clientName = customer
    ? `${customer.first_name} ${customer.last_name}${customer.company ? ` (${customer.company})` : ''}`
    : null;
  const contactParts: string[] = [];
  if (customer?.phone) contactParts.push(escapeHtml(customer.phone));
  if (customer?.email) contactParts.push(escapeHtml(customer.email));
  const contactLine = contactParts.length > 0 ? contactParts.join(' · ') : null;

  const eventDetailsParts: string[] = [];
  eventDetailsParts.push(
    `<p><strong>Type:</strong> ${escapeHtml(func.type)} · <strong>Attendees:</strong> ${func.attendees} PAX</p>`,
  );
  eventDetailsParts.push(
    `<p><strong>When:</strong> ${escapeHtml(getEventDateTimeDisplay(func))}</p>`,
  );
  if (func.location) {
    eventDetailsParts.push(`<p><strong>Location:</strong> ${escapeHtml(func.location)}</p>`);
  } else {
    eventDetailsParts.push(`<p><strong>Location:</strong> —</p>`);
  }

  const clientParts: string[] = [];
  if (clientName) {
    clientParts.push(`<p><strong>Client:</strong> ${escapeHtml(clientName)}</p>`);
    if (contactLine) clientParts.push(`<p><strong>Contact:</strong> ${contactLine}</p>`);
  } else {
    clientParts.push(`<p><strong>Client:</strong> —</p>`);
  }

  const notesHtml =
    func.notes && func.notes.trim()
      ? `
    <div class="runsheet-event-info-notes runsheet-event-info-section">
      <div class="runsheet-event-info-section-title">Notes</div>
      <p>${escapeHtml(func.notes.trim())}</p>
    </div>`
      : '';

  return `
    <div class="runsheet-event-info">
      <div class="runsheet-event-info-grid">
        <div class="runsheet-event-info-section">
          <div class="runsheet-event-info-section-title">Event Details</div>
          ${eventDetailsParts.join('')}
        </div>
        <div class="runsheet-event-info-section">
          <div class="runsheet-event-info-section-title">Client &amp; Contact</div>
          ${clientParts.join('')}
        </div>
        ${notesHtml}
      </div>
    </div>
  `;
}
