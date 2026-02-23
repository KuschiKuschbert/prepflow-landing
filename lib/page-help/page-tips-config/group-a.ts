import type { PageTipsConfig } from '../page-tips-types';

export const PAGE_TIPS_GROUP_A: Record<string, PageTipsConfig> = {
  recipes: {
    pageKey: 'recipes',
    title: 'How Recipe Book Works',
    sections: [
      {
        title: 'Dishes',
        iconName: 'UtensilsCrossed',
        description:
          "Menu items you sell (with a price). Build them from direct ingredients and/or recipes you've already prepped.",
      },
      {
        title: 'Recipes',
        iconName: 'BookOpen',
        description:
          'What you prep in batches (yield, instructions). Reuse them across multiple dishes—e.g. a burger patty recipe in several menu items.',
      },
      {
        title: 'Ingredients',
        iconName: 'Package',
        description:
          'Add ingredients with costs, suppliers, and storage locations. Build your ingredient library for recipes and dishes.',
      },
    ],
    guideId: 'getting-started',
    guideStepIndex: 1,
  },
  settings: {
    pageKey: 'settings',
    tips: [
      'Update your profile and notification preferences anytime.',
      'Connect billing for subscription management and receipts.',
      'Export your data or set up backups for peace of mind.',
      'Check Help & FAQ for answers to common questions.',
    ],
    guideId: 'getting-started',
    guideStepIndex: 0,
  },
  compliance: {
    pageKey: 'compliance',
    tips: [
      'Add compliance types to organize your records (e.g. Pest Control, Council Inspections).',
      'Log records with dates and status—keep everything audit-ready.',
      'Use the Equipment tab for maintenance schedules.',
      'Filter by type or status to find records quickly.',
    ],
  },
  'dish-builder': {
    pageKey: 'dish-builder',
    tips: [
      'Tap recipes or ingredients from the palette to add to your dish.',
      'Set selling price to see margins and cost breakdown.',
      'Dishes feed into your menu and COGS calculations.',
      'Use the Costing Tool to compare pricing strategies.',
    ],
    guideId: 'dish-builder',
    guideStepIndex: 0,
  },
  'menu-builder': {
    pageKey: 'menu-builder',
    tips: [
      'Organize dishes into sections (Mains, Desserts, etc.).',
      'Drag and drop to reorder items within sections.',
      'Lock the menu when ready—changes sync to performance and order lists.',
      'Use the stats panel to see margin and popularity metrics.',
    ],
    guideId: 'getting-started',
    guideStepIndex: 4,
  },
  suppliers: {
    pageKey: 'suppliers',
    tips: [
      'Add suppliers to organize where you buy ingredients.',
      'Attach price lists to suppliers—COGS pulls from your latest prices.',
      'Filter ingredients by supplier in the ingredients table.',
      'Import suppliers from CSV for quick setup.',
    ],
    guideId: 'getting-started',
    guideStepIndex: 1,
  },
  temperature: {
    pageKey: 'temperature',
    tips: [
      'Add equipment first—fridges, freezers, hot holds. Queensland standards apply automatically.',
      'Log temperatures regularly. Use Quick Log for fast entries.',
      'Check the Analytics tab for trends and compliance overview.',
      'Generate sample data to see how it works (dev/demo).',
    ],
  },
  'prep-lists': {
    pageKey: 'prep-lists',
    tips: [
      'Create prep lists from scratch or generate from a menu.',
      'Assign items to kitchen sections for organized output.',
      'Track status (todo, in progress, done) as the day progresses.',
      'Use sections to match your physical kitchen layout.',
    ],
  },
};
