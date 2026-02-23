import { format } from 'date-fns';
import { escapeHtml } from '@/lib/exports/template-utils';
import { getDietarySuitability } from './getDietarySuitability';

export type RunsheetItem = {
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

export function buildRunsheetTableHtml(items: RunsheetItem[], showDayColumn: boolean): string {
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

  return `
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
        ${
          itemRows ||
          `<tr><td colspan="${emptyColspan}" style="padding:20px;text-align:center;color:var(--pf-color-text-muted);">No runsheet items.${showDayColumn ? '' : ' for this day.'}</td></tr>`
        }
      </tbody>
    </table>
  `;
}
