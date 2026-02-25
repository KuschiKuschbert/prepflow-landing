/** Recipe variant CSS (grid layout, ingredients/method split). Data file for filesize limit. */
export const RECIPE_VARIANT_CSS = `
    /* Modern Recipe Card Variant */

    .recipe-cards {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .recipe-category {
      margin-bottom: 3rem;
    }

    .recipe-category h2 {
      color: var(--pf-color-primary);
      margin: 2rem 0 1.5rem;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      border-bottom: 2px solid var(--pf-color-border);
      padding-bottom: 0.5rem;
      display: inline-block;
    }

    .recipe-card {
      page-break-inside: avoid;
      background: var(--pf-color-bg-content);
      border: 1px solid var(--pf-color-border);
      border-radius: var(--pf-border-radius);
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: var(--pf-shadow-content);
      position: relative;
      overflow: hidden;
    }

    /* Decorative top border */
    .recipe-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--pf-color-primary);
    }

    .recipe-card-header {
      border-bottom: 1px solid var(--pf-color-border);
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .recipe-card-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--pf-color-text-header);
      margin: 0;
      line-height: 1.2;
    }

    .recipe-card-yield {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--pf-color-text-muted);
      background: rgba(255,255,255,0.05);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      border: 1px solid var(--pf-color-border);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .recipe-card-section {
      margin-bottom: 2rem;
    }

    .recipe-card-section:last-child {
      margin-bottom: 0;
    }

    .recipe-card-section-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--pf-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Ingredients Grid */
    .recipe-card-ingredients {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 0.75rem 2rem;
    }

    .recipe-card-ingredients li {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--pf-color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
    }

    .recipe-card-ingredients li:last-child {
      border-bottom: 1px solid var(--pf-color-border); /* Keep border for grid consistency */
    }

    /* Method List */
    .recipe-card-method {
      list-style: none;
      counter-reset: method-counter;
      padding: 0;
      margin: 0;
    }

    .recipe-card-method li {
      position: relative;
      padding-left: 3rem;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .recipe-card-method li::before {
      counter-increment: method-counter;
      content: counter(method-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 2rem;
      height: 2rem;
      background: rgba(255,255,255,0.1);
      color: var(--pf-color-primary);
      border-radius: 50%;
      text-align: center;
      line-height: 2rem;
      font-weight: 700;
      font-size: 0.9rem;
    }

    /* Notes */
    .recipe-card-notes {
      background: rgba(234, 179, 8, 0.1); /* Subtle yellow tint for notes */
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #eab308;
      list-style: none;
    }

    .recipe-card-notes li {
      margin-bottom: 0.5rem;
      font-style: italic;
      color: var(--pf-color-text-muted);
    }

    .recipe-card-notes li:last-child {
      margin-bottom: 0;
    }

    /* Compact Density Variant */
    .recipe-card.density-compact {
      padding: 1.5rem;
    }

    .recipe-card.density-compact .recipe-card-header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
    }

    .recipe-card.density-compact .recipe-card-title {
      font-size: 1.4rem;
    }

    .recipe-card.density-compact .recipe-card-section {
      margin-bottom: 1.5rem;
    }

    .recipe-card.density-compact .recipe-card-section-title {
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .recipe-card.density-compact .recipe-card-ingredients {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem 1.5rem;
    }

    .recipe-card.density-compact .recipe-card-ingredients li {
      padding: 0.35rem 0;
      font-size: 0.85rem;
    }

    .recipe-card.density-compact .recipe-card-method li {
      margin-bottom: 0.75rem;
      padding-left: 2.5rem;
      font-size: 0.9rem;
    }

    .recipe-card.density-compact .recipe-card-method li::before {
      width: 1.75rem;
      height: 1.75rem;
      line-height: 1.75rem;
      font-size: 0.8rem;
    }

    /* 2-Column Layout for Print (Industry Standard) */
    @media print {
      .recipe-card {
        page-break-inside: avoid;
        break-inside: avoid;
        padding: 1.5rem !important; /* Slightly more padding than basic combined export */
        border: 1px solid var(--pf-color-border);
        background: transparent;
      }

      .recipe-card-header {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
      }

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

      .recipe-card-section {
        margin-bottom: 0; /* Let grid gap handle spacing */
      }

      /* Ensure lists are compact for print */
      .recipe-card-ingredients li,
      .recipe-card-method li,
      .recipe-card-notes li {
        padding: 0.25rem 0;
        font-size: 0.95rem;
      }
    }
  `;
