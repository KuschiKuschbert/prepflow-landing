export interface TerminologyDefinition {
  term: string;
  definition: string;
  example?: string;
  whyItMatters?: string;
}

export const terminologyDefinitions: Record<string, TerminologyDefinition> = {
  cogs: {
    term: 'COGS',
    definition: 'Cost of Goods Sold - The actual cost of ingredients for one serving of a dish.',
    example: "If a burger costs $5.50 in ingredients to make, that's your COGS.",
    whyItMatters: 'Knowing your COGS helps you set menu prices that cover costs and make profit.',
  },
  yield: {
    term: 'Yield',
    definition:
      'The usable amount of an ingredient after preparation (after peeling, trimming, etc.).',
    example: 'If you buy 1kg of potatoes and lose 20% to peeling, your yield is 800g (80%).',
    whyItMatters:
      'Yield affects your actual cost - if you lose 20% to waste, your real cost is 25% higher than the purchase price.',
  },
  trimWaste: {
    term: 'Trim/Peel Waste',
    definition:
      'The percentage of an ingredient lost during preparation (peeling, trimming, etc.).',
    example:
      'Peeling potatoes typically results in 15-25% waste. Trimming fat from meat can be 10-15%.',
    whyItMatters: "This waste adds to your costs - food you pay for but can't use in dishes.",
  },
  parLevel: {
    term: 'Par Level',
    definition:
      'The minimum stock level you want to keep on hand - when stock hits this level, you should order more.',
    example:
      "If your par level for tomatoes is 10kg, when you have 10kg or less, it's time to order.",
    whyItMatters: 'Par levels help you avoid running out of ingredients while not over-ordering.',
  },
  reorderPoint: {
    term: 'Reorder Point',
    definition:
      'The critical stock level - when reached, you need to order immediately to avoid running out.',
    example: 'If your reorder point is 5kg and current stock is 4kg, order now!',
    whyItMatters: "Running out of ingredients means you can't make dishes and lose sales.",
  },
  grossProfit: {
    term: 'Gross Profit',
    definition: 'Money left after ingredient costs (selling price minus food cost).',
    example: 'Sell a burger for $15, COGS is $5.50, gross profit is $9.50.',
    whyItMatters:
      'This is what you have to cover other expenses (rent, labor, utilities) and make a profit.',
  },
  contributingMargin: {
    term: 'Contributing Margin',
    definition:
      'Amount left after food cost to cover other expenses (labor, rent, utilities) and profit.',
    example:
      'Dish sells for $15, COGS is $5.50, contributing margin is $9.50 to cover everything else.',
    whyItMatters: 'Shows how much each dish contributes to covering fixed costs and making profit.',
  },
  charmPricing: {
    term: 'Charm Pricing',
    definition:
      'Pricing ending in .95 or .99 (e.g., $19.95, $24.99) - psychologically appealing to customers.',
    example: "$19.95 feels cheaper than $20.00, even though it's only 5 cents less.",
    whyItMatters: 'Customers perceive charm prices as better deals, potentially increasing sales.',
  },
  prepList: {
    term: 'Prep List',
    definition: 'Daily list of tasks to prepare ingredients before service starts.',
    example: 'Chop vegetables, marinate meat, prepare sauces - all done before customers arrive.',
    whyItMatters:
      'Proper prep ensures you have everything ready when orders come in, keeping service fast.',
  },
  dishSection: {
    term: 'Dish Section',
    definition:
      'Kitchen area where a dish is prepared (Hot Kitchen, Cold Kitchen, Grill, Pastry, etc.).',
    example: 'Burgers are made in the Hot Kitchen, salads in the Cold Kitchen.',
    whyItMatters: 'Helps organize your kitchen workflow and assign dishes to the right stations.',
  },
  packSizeUnit: {
    term: 'Pack Size Unit',
    definition: 'The unit you purchase the ingredient in (e.g., you buy a 5kg bag of flour).',
    example: 'You buy a 5kg bag (pack size) but use it in grams (unit).',
    whyItMatters: 'Needed to calculate the actual cost per unit you use in recipes.',
  },
  costPerUnit: {
    term: 'Cost Per Unit',
    definition:
      'Automatically calculated from pack price and size. This is what you pay per unit you actually use.',
    example:
      '5kg bag costs $12, so cost per kilogram is $2.40. But if you lose 10% to waste, your real cost per usable kilogram is $2.67.',
    whyItMatters:
      'This is the actual cost you use when calculating dish costs, not the purchase price.',
  },
  targetMargin: {
    term: 'Target Margin',
    definition: 'The profit percentage you want to achieve on each dish.',
    example: 'If you want 30% profit and COGS is $5, you need to charge at least $7.14.',
    whyItMatters:
      'Ensures your menu prices cover costs and generate the profit you need to stay in business.',
  },
};

export function getTerminology(key: string): TerminologyDefinition | undefined {
  return terminologyDefinitions[key];
}

export function getHelpText(
  key: string,
  includeExample: boolean = true,
  includeWhy: boolean = false,
): string {
  const term = getTerminology(key);
  if (!term) return '';
  let text = term.definition;
  if (includeExample && term.example) text += ` ${term.example}`;
  if (includeWhy && term.whyItMatters) text += ` ${term.whyItMatters}`;
  return text;
}
