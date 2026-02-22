import { format, parseISO, addDays } from 'date-fns';
import { escapeHtml } from '@/lib/exports/template-utils';
import { getDietarySuitability } from './getDietarySuitability';

type FunctionWithCustomer = {
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

type RunsheetItem = {
  day_number: number;
  item_time: string | null;
  description: string;
  item_type: string;
  menus?: { menu_name: string } | null;
  dishes?: {
    dish_name: string;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
  recipes?: {
    recipe_name: string;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
};

const TYPE_LABELS: Record<string, string> = {
  meal: 'Meal Service',
  activity: 'Activity',
  setup: 'Setup',
  other: 'Other',
};

function formatTime(time: string | null): string {
  if (!time) return '—';
  try {
    return format(new Date(`1970-01-01T${time}`), 'HH:mm');
  } catch {
    return time;
  }
}

/**
 * Build event date/time range string
 */
function getEventDateTimeDisplay(func: FunctionWithCustomer): string {
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

/**
 * Build runsheet content HTML (event info + items table) for print template
 */
export function buildRunsheetContent(
  func: FunctionWithCustomer,
  items: RunsheetItem[],
  dayNumber: number | null,
): { content: string; title: string; subtitle: string } {
  const dayDate =
    dayNumber && func.start_date
      ? format(addDays(parseISO(func.start_date), dayNumber - 1), 'EEEE, MMMM do yyyy')
      : null;

  const title = dayNumber
    ? `${func.name} — Day ${dayNumber}${dayDate ? ` (${dayDate})` : ''}`
    : func.name;

  const subtitle = dayDate || getEventDateTimeDisplay(func);

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
    if (contactLine) {
      clientParts.push(`<p><strong>Contact:</strong> ${contactLine}</p>`);
    }
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

  const eventInfoHtml = `
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

  const showDayColumn = dayNumber == null;

  const itemRows = (items || [])
    .map(item => {
      const time = item.item_time ? formatTime(item.item_time) : '—';
      const typeLabel = TYPE_LABELS[item.item_type] || item.item_type;
      const typeClass = item.item_type || 'other';
      const rowClass = `runsheet-row-${typeClass}`;

      const linked: string[] = [];
      if (item.dishes) linked.push(`Dish: ${escapeHtml(item.dishes.dish_name)}`);
      if (item.recipes) linked.push(`Recipe: ${escapeHtml(item.recipes.recipe_name)}`);
      if (item.menus) linked.push(`Menu: ${escapeHtml(item.menus.menu_name)}`);
      const linkedHtml =
        linked.length > 0 ? `<div class="runsheet-linked">${linked.join(' · ')}</div>` : '';

      const source = item.item_type === 'meal' ? (item.dishes ?? item.recipes) : null;
      const dietaryLabels = getDietarySuitability(source);
      const dietaryHtml = dietaryLabels.length > 0 ? escapeHtml(dietaryLabels.join(', ')) : '—';

      const dayCell = showDayColumn
        ? `<td class="runsheet-day">${escapeHtml(String(item.day_number))}</td>`
        : '';

      return `
        <tr class="${rowClass}">
          ${dayCell}
          <td class="runsheet-time">${escapeHtml(time)}</td>
          <td>
            <div>${escapeHtml(item.description)}</div>
            ${linkedHtml}
          </td>
          <td class="runsheet-type">
            <span class="runsheet-type-badge ${typeClass}">${escapeHtml(typeLabel)}</span>
          </td>
          <td class="runsheet-dietary">${dietaryHtml}</td>
        </tr>
      `;
    })
    .join('');

  const dayHeader = showDayColumn ? '<th style="width:50px;text-align:center;">Day</th>' : '';

  const emptyColspan = showDayColumn ? 5 : 4;

  const tableHtml = `
    <table class="runsheet-table">
      <thead>
        <tr>
          ${dayHeader}
          <th style="width:80px;">Time</th>
          <th>Description</th>
          <th style="width:100px;text-align:center;">Type</th>
          <th style="width:120px;text-align:center;">Dietary</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || `<tr><td colspan="${emptyColspan}" style="padding:20px;text-align:center;color:var(--pf-color-text-muted);">No runsheet items.${showDayColumn ? '' : ' for this day.'}</td></tr>`}
      </tbody>
    </table>
  `;

  const content = `${eventInfoHtml}${tableHtml}`;

  return { content, title, subtitle };
}
