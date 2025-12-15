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
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .recipe-cards-header p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
  }
  .recipe-category {
    margin-bottom: 2rem;
  }
  .recipe-category h3 {
    color: #29E7CD;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 600;
  }
  .recipe-card {
    page-break-inside: avoid;
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid rgba(42, 42, 42, 0.8);
    border-radius: 16px;
    background: rgba(42, 42, 42, 0.3);
  }
  .recipe-card-header {
    border-bottom: 2px solid rgba(41, 231, 205, 0.5);
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
  }
  .recipe-card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #29E7CD;
    margin: 0;
  }
  .recipe-card-yield {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.25rem;
  }
  .recipe-card-section {
    margin-bottom: 1.5rem;
  }
  .recipe-card-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(42, 42, 42, 0.8);
    padding-bottom: 0.5rem;
  }
  .recipe-card-ingredients {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .recipe-card-ingredients li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(42, 42, 42, 0.5);
    color: rgba(255, 255, 255, 0.9);
  }
  .recipe-card-ingredients li:last-child {
    border-bottom: none;
  }
  .recipe-card-method {
    list-style: decimal;
    padding-left: 1.5rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }
  .recipe-card-method li {
    padding: 0.5rem 0;
  }
  .recipe-card-notes {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .recipe-card-notes li {
    padding: 0.5rem 0;
    font-style: italic;
    color: rgba(255, 255, 255, 0.7);
  }
  @media print {
    .recipe-cards-header h2 {
      color: #000;
    }
    .recipe-cards-header p {
      color: #666;
    }
    .recipe-card {
      background: #fff;
      border-color: #e0e0e0;
    }
    .recipe-card-title {
      color: #29E7CD;
    }
    .recipe-card-yield {
      color: #666;
    }
    .recipe-card-section-title {
      color: #333;
      border-color: #e0e0e0;
    }
    .recipe-card-ingredients li {
      color: #333;
      border-color: #f0f0f0;
    }
    .recipe-card-method {
      color: #333;
    }
    .recipe-card-notes li {
      color: #666;
    }
    .recipe-category h3 {
      color: #29E7CD;
    }
  }
`;
