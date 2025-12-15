/**
 * Format par levels for HTML/PDF export.
 */
import type { ParLevel } from '../../../types';

export function formatParLevelsForExport(parLevels: ParLevel[]): string {
  const parLevelsByCategory = parLevels.reduce(
    (acc, parLevel) => {
      const category = parLevel.ingredients.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(parLevel);
      return acc;
    },
    {} as Record<string, ParLevel[]>,
  );

  return Object.entries(parLevelsByCategory)
    .map(
      ([category, categoryParLevels]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${category}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
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
    .join('');
}
