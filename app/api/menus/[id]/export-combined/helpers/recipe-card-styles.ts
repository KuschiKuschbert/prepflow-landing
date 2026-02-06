/**
 * Recipe Card Styles for HTML Export
 * CSS styles for recipe cards in exported HTML/PDF
 */

export const recipeCardStyles = `
  .recipe-cards-section {
    margin-top: 3rem;
  }
  .recipe-cards-header {
    margin-bottom: 2rem;
  }
  .recipe-cards-header h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--pf-color-text-header);
    margin-bottom: 0.5rem;
  }
  .recipe-cards-header p {
    color: var(--pf-color-text-muted);
    font-size: 1rem;
  }
  .recipe-category {
    margin-bottom: 2rem;
  }
  .recipe-category h3 {
    color: var(--pf-color-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 600;
  }
  .recipe-card {
    page-break-inside: avoid;
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid var(--pf-color-border);
    border-radius: 16px;
    background: var(--pf-color-bg-content);
  }
  .recipe-card-header {
    border-bottom: 2px solid var(--pf-color-primary);
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
  }
  .recipe-card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--pf-color-text-header);
    margin: 0;
  }
  .recipe-card-yield {
    font-size: 0.9rem;
    color: var(--pf-color-text-muted);
    margin-top: 0.25rem;
  }
  .recipe-body-content {
    /* Default to stack for web/mobile */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .recipe-card-section {
    margin-bottom: 0; /* Let gap handle spacing */
  }
  .recipe-card-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--pf-color-text-main);
    margin-bottom: 0.75rem;
    border-bottom: 1px solid var(--pf-color-border);
    padding-bottom: 0.5rem;
  }
  .recipe-card-ingredients {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .recipe-card-ingredients li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--pf-color-border);
    color: var(--pf-color-text-main);
  }
  .recipe-card-ingredients li:last-child {
    border-bottom: none;
  }
  .recipe-card-method {
    list-style: decimal;
    padding-left: 1.5rem;
    margin: 0;
    color: var(--pf-color-text-main);
  }
  .recipe-card-method li {
    padding: 0.5rem 0;
  }
  .recipe-card-notes {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0 0;
  }
  .recipe-card-notes li {
    padding: 0.5rem 0;
    font-style: italic;
    color: var(--pf-color-text-muted);
  }
  @media print {
    .recipe-card {
      /* Remove border/bg for cleaner print, or keep light border */
      border: 1px solid var(--pf-color-border);
      background: transparent;
      padding: 1rem !important; /* Compact padding */
      margin-bottom: 1.5rem;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .recipe-card-header {
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
    }

    /* 2-Column Layout for Print (Industry Standard) */
    .recipe-body-content {
      display: grid;
      grid-template-columns: 1fr 2.2fr; /* Ingredients narrower, Method wider */
      gap: 2rem;
      align-items: start;
    }

    /* Assign columns explicitly */
    .recipe-section-ingredients {
      grid-column: 1;
    }
    .recipe-section-method {
      grid-column: 2;
    }

    /* Auto-expand if the other section is missing */
    .recipe-section-ingredients:only-child,
    .recipe-section-method:only-child {
      grid-column: 1 / -1;
    }

    .recipe-card-title {
      font-size: 1.3rem; /* Slightly smaller for print */
    }

    .recipe-card-section-title {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    /* Ensure lists are compact */
    .recipe-card-ingredients li,
    .recipe-card-method li,
    .recipe-card-notes li {
      padding: 0.15rem 0; /* Very compact for print */
      font-size: 0.9rem; /* 14px approx */
      line-height: 1.3;
    }
  }
`;
