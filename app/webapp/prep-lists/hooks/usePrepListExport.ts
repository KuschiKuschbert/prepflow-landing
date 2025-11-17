'use client';

import { useCallback } from 'react';
import type { PrepList, SectionData } from '../types';

interface ExportOptions {
  sections?: string[]; // Filter by section IDs
  includeInstructions?: boolean;
}

export function usePrepListExport() {
  const formatPrepListForPrint = useCallback((prepList: PrepList): string => {
    const items = prepList.prep_list_items || [];
    const sectionName = prepList.kitchen_sections?.name || 'Unassigned';
    const date = new Date(prepList.created_at).toLocaleDateString();

    let html = `
      <div class="prep-list-print">
        <div class="prep-list-header">
          <h1>${prepList.name}</h1>
          <div class="prep-list-meta">
            <span>Section: ${sectionName}</span>
            <span>Date: ${date}</span>
            <span>Status: ${prepList.status}</span>
          </div>
        </div>
    `;

    if (prepList.notes) {
      html += `<div class="prep-list-notes"><strong>Notes:</strong> ${prepList.notes}</div>`;
    }

    if (items.length > 0) {
      html += `
        <div class="prep-list-ingredients">
          <h2>Ingredients</h2>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Unit</th>
                ${items.some(item => item.notes) ? '<th>Notes</th>' : ''}
              </tr>
            </thead>
            <tbody>
      `;

      items.forEach(item => {
        const ingredientName = item.ingredients?.name || 'Unknown';
        html += `
          <tr>
            <td>${ingredientName}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            ${item.notes ? `<td>${item.notes}</td>` : ''}
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    html += `</div>`;

    return html;
  }, []);

  const formatGeneratedPrepListForPrint = useCallback(
    (sections: SectionData[], menuName: string, options: ExportOptions = {}): string => {
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
        if (
          includeInstructions &&
          section.prepInstructions &&
          section.prepInstructions.length > 0
        ) {
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
    },
    [],
  );

  const printPrepList = useCallback(
    (prepList: PrepList) => {
      const html = formatPrepListForPrint(prepList);
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${prepList.name}</title>
            <style>
              ${getPrintStyles()}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    },
    [formatPrepListForPrint],
  );

  const printGeneratedPrepList = useCallback(
    (sections: SectionData[], menuName: string, options?: ExportOptions) => {
      const html = formatGeneratedPrepListForPrint(sections, menuName, options);
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${menuName} - Prep List</title>
            <style>
              ${getPrintStyles()}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    },
    [formatGeneratedPrepListForPrint],
  );

  return {
    printPrepList,
    printGeneratedPrepList,
    formatPrepListForPrint,
    formatGeneratedPrepListForPrint,
  };
}

function getPrintStyles(): string {
  return `
    @page {
      margin: 1cm;
      size: A4;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
    }

    .prep-list-print {
      max-width: 100%;
    }

    .prep-list-header {
      border-bottom: 2px solid #000;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .prep-list-header h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .prep-list-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 10pt;
      color: #666;
    }

    .prep-list-notes {
      margin-bottom: 1.5rem;
      padding: 0.75rem;
      background: #f5f5f5;
      border-left: 3px solid #000;
    }

    .prep-list-section {
      page-break-inside: avoid;
      margin-bottom: 2rem;
    }

    .prep-list-section h2 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 1rem;
      border-bottom: 1px solid #ccc;
      padding-bottom: 0.5rem;
    }

    .prep-list-section h3 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    table thead {
      background: #f0f0f0;
    }

    table th {
      text-align: left;
      padding: 0.5rem;
      font-weight: bold;
      border-bottom: 2px solid #000;
    }

    table td {
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }

    table tbody tr:hover {
      background: #f9f9f9;
    }

    .prep-list-instructions {
      margin-top: 1.5rem;
    }

    .instruction-item {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      page-break-inside: avoid;
    }

    .instruction-item h4 {
      font-size: 13pt;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #000;
    }

    .instruction-source {
      font-size: 10pt;
      color: #666;
      margin-bottom: 0.75rem;
      font-style: italic;
    }

    .instruction-content {
      white-space: pre-wrap;
      line-height: 1.6;
    }

    @media print {
      .prep-list-section {
        page-break-inside: avoid;
      }

      .instruction-item {
        page-break-inside: avoid;
      }
    }
  `;
}
