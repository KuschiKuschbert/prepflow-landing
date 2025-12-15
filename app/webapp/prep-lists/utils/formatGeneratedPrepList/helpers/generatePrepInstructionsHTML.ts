/**
 * Generate prep instructions HTML for prep list.
 */
import { escapeHtml } from '@/lib/exports/template-utils';
import type { SectionData } from '../../types';

export function generatePrepInstructionsHTML(section: SectionData): string {
  if (!section.prepInstructions || section.prepInstructions.length === 0) return '';

  let html = `
    <div class="prep-list-instructions">
      <h3>Prep Instructions</h3>
  `;
  section.prepInstructions.forEach(instruction => {
    html += `
      <div class="instruction-item">
        <h4>${escapeHtml(instruction.recipeName)}</h4>
        ${instruction.dishName ? `<p class="instruction-source">From: ${escapeHtml(instruction.dishName)}</p>` : ''}
        <div class="instruction-content">${escapeHtml(instruction.instructions).replace(/\n/g, '<br>')}</div>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}
