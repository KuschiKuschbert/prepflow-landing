/**
 * CSS styles for prep list printing
 * Prep-list-specific styles that extend the unified template styles
 */

import { getAllTemplateStyles } from '@/lib/exports/template-styles';

export function getPrintStyles(variant: 'default' | 'kitchen' = 'default'): string {
  // Get base template styles with variant support
  const baseStyles = getAllTemplateStyles(variant === 'kitchen' ? 'kitchen' : 'default');

  // Add prep-list-specific styles
  const prepListStyles = `
    /* Prep List Specific Styles */
    .prep-list-print {
      max-width: 100%;
    }

    .prep-list-header {
      border-bottom: 2px solid rgba(42, 42, 42, 0.8);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .prep-list-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .prep-list-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .prep-list-notes {
      margin-bottom: 1.5rem;
      padding: 0.75rem;
      background: rgba(42, 42, 42, 0.3);
      border-left: 3px solid #29E7CD;
      color: rgba(255, 255, 255, 0.9);
      border-radius: 4px;
    }

    .prep-list-section {
      page-break-inside: avoid;
      margin-bottom: 2rem;
    }

    .prep-list-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgba(42, 42, 42, 0.8);
      padding-bottom: 0.5rem;
    }

    .prep-list-section h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #ffffff;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }

    .prep-list-ingredients table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .prep-list-ingredients table thead {
      background: rgba(42, 42, 42, 0.5);
    }

    .prep-list-ingredients table th {
      text-align: left;
      padding: 0.75rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      border-bottom: 2px solid rgba(41, 231, 205, 0.3);
    }

    .prep-list-ingredients table td {
      padding: 0.75rem;
      color: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid rgba(42, 42, 42, 0.5);
    }

    .prep-list-ingredients table tbody tr:hover {
      background: rgba(42, 42, 42, 0.2);
    }

    .prep-list-instructions {
      margin-top: 1.5rem;
    }

    .instruction-item {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid rgba(42, 42, 42, 0.5);
      border-radius: 8px;
      background: rgba(42, 42, 42, 0.2);
      page-break-inside: avoid;
    }

    .instruction-item h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }

    .instruction-source {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.75rem;
      font-style: italic;
    }

    .instruction-content {
      white-space: pre-wrap;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
    }

    .prep-list-techniques {
      margin-top: 1.5rem;
    }

    .prep-list-techniques h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .prep-list-techniques ul {
      list-style: disc;
      margin-left: 1.5rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .prep-list-techniques li {
      margin-bottom: 0.5rem;
    }

    .technique-item {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: rgba(42, 42, 42, 0.2);
      border-radius: 4px;
    }

    .technique-item strong {
      color: #29E7CD;
    }

    .technique-item p {
      margin: 0.25rem 0;
      color: rgba(255, 255, 255, 0.9);
    }

    @media print {
      .prep-list-header h1 {
        font-size: 1.5rem;
        color: #000;
      }

      .prep-list-meta {
        color: #666;
      }

      .prep-list-section h2 {
        font-size: 1.25rem;
        color: #000;
      }

      .prep-list-section h3 {
        font-size: 1rem;
        color: #000;
      }

      .prep-list-notes {
        background: #f5f5f5;
        color: #333;
      }

      .prep-list-ingredients table th,
      .prep-list-ingredients table td {
        color: #000;
        padding: 0.5rem;
      }

      .instruction-item {
        background: #f9f9f9;
        border-color: #ddd;
      }

      .instruction-item h4 {
        color: #000;
      }

      .instruction-content {
        color: #333;
      }

      .prep-list-techniques ul {
        color: #000;
      }

      .technique-item {
        background: #f9f9f9;
      }

      .technique-item p {
        color: #333;
      }

      .prep-list-section {
        page-break-inside: avoid;
      }

      .instruction-item {
        page-break-inside: avoid;
      }
    }

    /* Kitchen Variant Styles */
    .kitchen-variant .kitchen-ingredient-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kitchen-ingredient-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(42, 42, 42, 0.3);
    }

    .kitchen-ingredient-item:last-child {
      border-bottom: none;
    }

    .kitchen-ingredient-name {
      flex: 1;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    .kitchen-ingredient-quantity {
      font-size: 0.9em;
      color: rgba(255, 255, 255, 0.7);
      min-width: 80px;
      text-align: right;
    }

    .kitchen-ingredient-notes {
      font-size: 0.85em;
      color: rgba(255, 255, 255, 0.6);
      font-style: italic;
      max-width: 200px;
    }

    @media print {
      .kitchen-ingredient-item {
        border-bottom-color: #e0e0e0;
      }

      .kitchen-ingredient-name {
        color: #000;
      }

      .kitchen-ingredient-quantity {
        color: #666;
      }

      .kitchen-ingredient-notes {
        color: #666;
      }
    }
  `;

  return `${baseStyles}\n${prepListStyles}`;
}
