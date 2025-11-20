/**
 * Format generated prep list with sections for printing
 */

import type { SectionData } from '../types';

interface ExportOptions {
  sections?: string[]; // Filter by section IDs
  includeInstructions?: boolean;
}

export function formatGeneratedPrepListForPrint(
  sections: SectionData[],
  menuName: string,
  options: ExportOptions = {},
): string {
  const { sections: filterSections, includeInstructions = true } = options;

  let html = `
      <div class="prep-list-print">
        <div class="prep-list-header">
          <h1>${menuName}</h1>
          <div class="prep-list-meta">
            <span>Date: ${new Date().toLocaleDateString()}</span>
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

    html += `
          <div class="prep-list-section">
            <h2>${section.sectionName}</h2>
        `;

    // Ingredients
    if (section.aggregatedIngredients.length > 0) {
      html += `
            <div class="prep-list-ingredients">
              <h3>Ingredients</h3>
              <table>
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Total Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
          `;

      section.aggregatedIngredients.forEach(ing => {
        const prepNotes =
          ing.prepNotes && ing.prepNotes.length > 0
            ? `<br><small style="color: #666;">Prep: ${ing.prepNotes.join(', ')}</small>`
            : '';
        html += `
              <tr>
                <td>${ing.name}${prepNotes}</td>
                <td>${ing.totalQuantity}</td>
                <td>${ing.unit}</td>
              </tr>
            `;
      });

      html += `
                </tbody>
              </table>
            </div>
          `;
    }

    // Prep Instructions
    if (includeInstructions && section.prepInstructions && section.prepInstructions.length > 0) {
      html += `
            <div class="prep-list-instructions">
              <h3>Prep Instructions</h3>
          `;

      section.prepInstructions.forEach(instruction => {
        html += `
              <div class="instruction-item">
                <h4>${instruction.recipeName}</h4>
                ${instruction.dishName ? `<p class="instruction-source">From: ${instruction.dishName}</p>` : ''}
                <div class="instruction-content">${instruction.instructions.replace(/\n/g, '<br>')}</div>
              </div>
            `;
      });

      html += `</div>`;
    }

    // Prep Techniques
    if (includeInstructions && section.prepTechniques) {
      const pt = section.prepTechniques;

      if (
        pt.cutShapes.length > 0 ||
        pt.sauces.length > 0 ||
        pt.marinations.length > 0 ||
        pt.preCookingSteps.length > 0 ||
        pt.specialTechniques.length > 0
      ) {
        html += `
              <div class="prep-list-techniques">
                <h3>Prep Techniques</h3>
            `;

        // Cut Shapes
        if (pt.cutShapes.length > 0) {
          html += `<h4>Cut Shapes</h4><ul>`;
          pt.cutShapes.forEach(cs => {
            html += `<li><strong>${cs.ingredient}</strong>: ${cs.shape}</li>`;
          });
          html += `</ul>`;
        }

        // Sauces
        if (pt.sauces.length > 0) {
          html += `<h4>Sauces & Dressings</h4>`;
          pt.sauces.forEach(sauce => {
            html += `
                  <div class="technique-item">
                    <strong>${sauce.name}</strong>
                    <p>Ingredients: ${sauce.ingredients.join(', ')}</p>
                    <p>${sauce.instructions}</p>
                  </div>
                `;
          });
        }

        // Marinations
        if (pt.marinations.length > 0) {
          html += `<h4>Marinations</h4><ul>`;
          pt.marinations.forEach(m => {
            html += `<li><strong>${m.ingredient}</strong>: ${m.method}${m.duration ? ` (${m.duration})` : ''}</li>`;
          });
          html += `</ul>`;
        }

        // Pre-Cooking Steps
        if (pt.preCookingSteps.length > 0) {
          html += `<h4>Pre-Cooking Steps</h4><ul>`;
          pt.preCookingSteps.forEach(pc => {
            html += `<li><strong>${pc.ingredient}</strong>: ${pc.step}</li>`;
          });
          html += `</ul>`;
        }

        // Special Techniques
        if (pt.specialTechniques.length > 0) {
          html += `<h4>Special Techniques</h4><ul>`;
          pt.specialTechniques.forEach(st => {
            html += `<li>${st.description}${st.details ? `: ${st.details}` : ''}</li>`;
          });
          html += `</ul>`;
        }

        html += `</div>`;
      }
    }

    html += `</div>`;
  });

  html += `</div>`;

  return html;
}
