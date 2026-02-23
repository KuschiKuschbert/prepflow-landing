/**
 * Format guide content for print and export.
 * Produces semantic HTML (h3, p) for each step.
 */

import type { Guide } from '../data/guide-types';

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char] ?? char);
}

/**
 * Format a guide as HTML for print or export.
 * Each step is rendered as h3 (title) + p (description).
 */
export function formatGuideForPrint(guide: Guide): string {
  return guide.steps
    .map(
      (step, index) =>
        `<section style="margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">Step ${index + 1}: ${escapeHtml(step.title)}</h3>
          <p style="margin: 0; font-size: 0.875rem; line-height: 1.5;">${escapeHtml(step.description)}</p>
        </section>`,
    )
    .join('\n');
}
