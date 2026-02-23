import { format, parseISO, addDays } from 'date-fns';
import {
  buildEventInfoHtml,
  getEventDateTimeDisplay,
  type FunctionWithCustomer,
} from './buildRunsheetEventInfo';
import { buildRunsheetTableHtml, type RunsheetItem } from './buildRunsheetTable';

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
  const showDayColumn = dayNumber == null;
  const eventInfoHtml = buildEventInfoHtml(func);
  const tableHtml = buildRunsheetTableHtml(items, showDayColumn);
  const content = `${eventInfoHtml}${tableHtml}`;

  return { content, title, subtitle };
}
