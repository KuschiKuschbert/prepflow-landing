/**
 * Print utility for par levels
 * Formats par level report
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { ParLevel } from '../types';

export interface PrintParLevelsOptions {
  parLevels: ParLevel[];
  includeLowStock?: boolean;
}

/**
 * Format par levels for printing
 *
 * @param {PrintParLevelsOptions} options - Par levels print options
 * @returns {void} Opens print dialog
 */
export function printParLevels({
  parLevels,
  includeLowStock = false,
}: PrintParLevelsOptions): void {
  const filteredParLevels = includeLowStock
    ? parLevels
    : parLevels.filter(pl => {
        // Filter logic would go here if we had current stock levels
        return true;
      });

  // Group by category
  const parLevelsByCategory = filteredParLevels.reduce(
    (acc, parLevel) => {
      const category = parLevel.ingredients.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(parLevel);
      return acc;
    },
    {} as Record<string, ParLevel[]>,
  );

  const content = `
    <div style="max-width: 100%;">
      <!-- Summary Section -->
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
          Summary
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Par Levels</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${filteredParLevels.length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Categories</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${Object.keys(parLevelsByCategory).length}</div>
          </div>
        </div>
      </div>

      <!-- Par Levels by Category -->
      ${Object.entries(parLevelsByCategory)
        .map(
          ([category, categoryParLevels]) => `
        <div style="margin-bottom: 32px; page-break-inside: avoid;">
          <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
            ${category}
            <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6); margin-left: 8px;">(${categoryParLevels.length})</span>
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background: rgba(42, 42, 42, 0.5);">
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Ingredient</th>
                <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Par Level</th>
                <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Reorder Point</th>
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Unit</th>
              </tr>
            </thead>
            <tbody>
              ${categoryParLevels
                .sort((a, b) =>
                  a.ingredients.ingredient_name.localeCompare(b.ingredients.ingredient_name),
                )
                .map(
                  parLevel => `
                  <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${parLevel.ingredients.ingredient_name}</td>
                    <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${parLevel.par_level}</td>
                    <td style="text-align: right; padding: 10px; color: #FF6B00; font-weight: 600;">${parLevel.reorder_point}</td>
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${parLevel.unit}</td>
                  </tr>
                `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `,
        )
        .join('')}
    </div>
  `;

  printWithTemplate({
    title: 'Par Level Report',
    subtitle: 'Inventory Par Levels',
    content,
    totalItems: filteredParLevels.length,
  });
}




