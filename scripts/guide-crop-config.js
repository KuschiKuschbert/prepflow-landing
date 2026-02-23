/**
 * Per-image crop overrides for guide screenshots.
 * Margin-based cropping only—annotation-driven crop breaks annotation positions.
 * marginTop/Bottom/Left/Right: pixels to trim from edges. Trims app chrome (header, footer).
 */
module.exports = {
  defaults: {
    marginTop: 0,
    marginBottom: 48,
    marginLeft: 0,
    marginRight: 0,
  },
  overrides: {
    'dashboard-overview.png': { marginTop: 0, marginBottom: 48 },
    'ingredients-page.png': { marginTop: 0, marginBottom: 48 },
    'recipe-builder.png': { marginTop: 0, marginBottom: 48 },
    'recipe-form.png': { marginTop: 0, marginBottom: 24 },
    'add-ingredients.png': { marginTop: 0, marginBottom: 24 },
    'recipe-cost.png': { marginTop: 0, marginBottom: 24 },
    'dish-builder.png': { marginTop: 0, marginBottom: 48 },
    'cogs-calculator.png': { marginTop: 0, marginBottom: 48 },
    'cogs-breakdown.png': { marginTop: 0, marginBottom: 24 },
    'pricing-tool.png': { marginTop: 0, marginBottom: 24 },
    'performance-analysis.png': { marginTop: 48, marginBottom: 48 },
    'temperature-equipment.png': { marginTop: 0, marginBottom: 48 },
    'compliance-records.png': { marginTop: 0, marginBottom: 48 },
    'suppliers.png': { marginTop: 0, marginBottom: 48 },
    'menu-builder.png': { marginTop: 0, marginBottom: 48 },
    'prep-lists.png': { marginTop: 0, marginBottom: 48 },
    'order-lists.png': { marginTop: 0, marginBottom: 48 },
    'par-levels.png': { marginTop: 0, marginBottom: 48 },
    'cleaning-roster-screenshot.png': { marginTop: 56, marginBottom: 48 },
    'functions-events-screenshot.png': { marginTop: 56, marginBottom: 48 },
  },
};
