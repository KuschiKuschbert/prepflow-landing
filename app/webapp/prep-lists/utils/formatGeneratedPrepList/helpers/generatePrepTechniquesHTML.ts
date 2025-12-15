/**
 * Generate prep techniques HTML for prep list.
 */
import { escapeHtml } from '@/lib/exports/template-utils';
import type { SectionData } from '../../../types';

export function generatePrepTechniquesHTML(section: SectionData): string {
  if (!section.prepTechniques) return '';

  const pt = section.prepTechniques;
  const hasTechniques =
    pt.cutShapes.length > 0 ||
    pt.sauces.length > 0 ||
    pt.marinations.length > 0 ||
    pt.preCookingSteps.length > 0 ||
    pt.specialTechniques.length > 0;

  if (!hasTechniques) return '';

  let html = `
    <div class="prep-list-techniques">
      <h3>Prep Techniques</h3>
  `;

  if (pt.cutShapes.length > 0) {
    html += `<h4>Cut Shapes</h4><ul>`;
    pt.cutShapes.forEach(cs => {
      html += `<li><strong>${escapeHtml(cs.ingredient)}</strong>: ${escapeHtml(cs.shape)}</li>`;
    });
    html += `</ul>`;
  }

  if (pt.sauces.length > 0) {
    html += `<h4>Sauces & Dressings</h4>`;
    pt.sauces.forEach(sauce => {
      html += `
        <div class="technique-item">
          <strong>${escapeHtml(sauce.name)}</strong>
          <p>Ingredients: ${escapeHtml(sauce.ingredients.join(', '))}</p>
          <p>${escapeHtml(sauce.instructions)}</p>
        </div>
      `;
    });
  }

  if (pt.marinations.length > 0) {
    html += `<h4>Marinations</h4><ul>`;
    pt.marinations.forEach(m => {
      html += `<li><strong>${escapeHtml(m.ingredient)}</strong>: ${escapeHtml(m.method)}${m.duration ? ` (${escapeHtml(m.duration)})` : ''}</li>`;
    });
    html += `</ul>`;
  }

  if (pt.preCookingSteps.length > 0) {
    html += `<h4>Pre-Cooking Steps</h4><ul>`;
    pt.preCookingSteps.forEach(pc => {
      html += `<li><strong>${escapeHtml(pc.ingredient)}</strong>: ${escapeHtml(pc.step)}</li>`;
    });
    html += `</ul>`;
  }

  if (pt.specialTechniques.length > 0) {
    html += `<h4>Special Techniques</h4><ul>`;
    pt.specialTechniques.forEach(st => {
      html += `<li>${escapeHtml(st.description)}${st.details ? `: ${escapeHtml(st.details)}` : ''}</li>`;
    });
    html += `</ul>`;
  }

  html += `</div>`;
  return html;
}
