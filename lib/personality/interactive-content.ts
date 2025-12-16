// PrepFlow Personality System - Interactive Message Definitions

export interface InteractiveMessage {
  message: string;
  tip?: string;
  learnMoreUrl?: string;
}

export const interactiveMessages: Record<string, InteractiveMessage[]> = {
  ingredients: [
    {
      message: "That's a lot of onions. Someone's making French onion soup?",
      tip: 'Tip: Organize ingredients by storage location to speed up prep.',
      learnMoreUrl: '/webapp/ingredients',
    },
    {
      message: 'Stock levels looking organized. Like a well-kept walk-in.',
      tip: 'Tip: Set par levels to automatically track when you need to reorder.',
    },
  ],
  recipes: [
    {
      message: 'Recipe saved. Your future self thanks you.',
      tip: 'Tip: Add detailed instructions to make recipe sharing easier.',
      learnMoreUrl: '/webapp/recipes',
    },
    {
      message: 'Another recipe in the book. Like a well-organized cookbook.',
      tip: 'Tip: Link recipes to menu dishes to track profitability.',
    },
  ],
  cogs: [
    {
      message: 'Profit margins looking crisp today.',
      tip: 'Tip: Review your COGS regularly to catch cost increases early.',
      learnMoreUrl: '/webapp/cogs',
    },
    {
      message: 'COGS calculated. Knowledge is power.',
      tip: 'Tip: Compare COGS across dishes to identify optimization opportunities.',
    },
  ],
  performance: [
    {
      message: 'Some dishes are carrying the team. Others... not so much.',
      tip: 'Tip: Focus on promoting high-profit, high-popularity dishes.',
      learnMoreUrl: '/webapp/performance',
    },
    {
      message: 'Performance analyzed. Like tasting every dish.',
      tip: 'Tip: Use performance data to make menu decisions based on data, not guesswork.',
    },
  ],
};

export function getInteractiveMessage(context: string): InteractiveMessage | null {
  const messages = interactiveMessages[context];
  if (!messages || messages.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}



