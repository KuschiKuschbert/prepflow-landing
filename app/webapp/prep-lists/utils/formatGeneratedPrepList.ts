/**
 * Format generated prep list with sections for printing
 * Uses unified template system with Cyber Carrot branding
 */
import { escapeHtml } from '@/lib/exports/template-utils';
import { generateIngredientsHTML } from './formatGeneratedPrepList/helpers/generateIngredientsHTML';
import { generatePrepInstructionsHTML } from './formatGeneratedPrepList/helpers/generatePrepInstructionsHTML';
import { generatePrepTechniquesHTML } from './formatGeneratedPrepList/helpers/generatePrepTechniquesHTML';
import type { SectionData } from '@/lib/types/prep-lists';

interface ExportOptions {
  sections?: string[]; // Filter by section IDs
  includeInstructions?: boolean;
  variant?: 'default' | 'kitchen';
}

export function formatGeneratedPrepListForPrint(
  sections: SectionData[],
  menuName: string,
  options: ExportOptions = {},
): string {
  const { sections: filterSections, includeInstructions = true, variant = 'default' } = options;

  const date = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let html = `
    <div class="prep-list-print">
      <div class="prep-list-header">
        <h1>${escapeHtml(menuName)}</h1>
        <div class="prep-list-meta">
          <span>Date: ${escapeHtml(date)}</span>
        </div>
      </div>
  `;

  const filteredSections = filterSections
    ? sections.filter(s => filterSections.includes(s.sectionId || ''))
    : sections;

  filteredSections.forEach(section => {
    const hasPrepTechniques =
      section.prepTechniques &&
      (section.prepTechniques.cutShapes.length > 0 ||
        section.prepTechniques.sauces.length > 0 ||
        section.prepTechniques.marinations.length > 0 ||
        section.prepTechniques.preCookingSteps.length > 0 ||
        section.prepTechniques.specialTechniques.length > 0);
    if (
      section.aggregatedIngredients.length === 0 &&
      (!includeInstructions ||
        !section.prepInstructions ||
        section.prepInstructions.length === 0) &&
      !hasPrepTechniques
    ) {
      return;
    }
    html += `<div class="prep-list-section"><h2>${escapeHtml(section.sectionName)}</h2>`;
    html += generateIngredientsHTML(section, variant);
    if (includeInstructions) {
      html += generatePrepInstructionsHTML(section);
      html += generatePrepTechniquesHTML(section);
    }
    html += `</div>`;
  });

  html += `</div>`;

  return html;
}
