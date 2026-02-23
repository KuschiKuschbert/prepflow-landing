/**
 * Route-to-guide mapping and page-level help configuration.
 * Used by PageHeader help icon to provide contextual guidance and deep links to guides.
 */

export interface PageHelpConfig {
  /** Short summary (2-3 sentences) for the help popover */
  helpSummary: string;
  /** Guide ID from app/webapp/guide/data/guides.ts */
  guideId?: string;
  /** Step index within the guide (0-based) for deep-linking */
  guideStepIndex?: number;
}

/**
 * Map of webapp routes to help configuration.
 * Keys are pathname patterns (e.g. /webapp/ingredients).
 */
export const PAGE_HELP_CONFIG: Record<string, PageHelpConfig> = {
  '/webapp': {
    helpSummary:
      'Your dashboard shows quick stats and recent activity. Add ingredients and recipes to unlock cost calculations and performance insights.',
    guideId: 'getting-started',
    guideStepIndex: 0,
  },
  '/webapp/ingredients': {
    helpSummary:
      'Add ingredients with costs and units—this is the foundation for recipe costs. Import from CSV for bulk entry, or add one at a time.',
    guideId: 'ingredients',
    guideStepIndex: 0,
  },
  '/webapp/recipes': {
    helpSummary:
      'Build recipes by combining ingredients. PrepFlow calculates costs automatically. Use the Calculator tab to optimize pricing and margins.',
    guideId: 'create-recipe',
    guideStepIndex: 0,
  },
  '/webapp/dish-builder': {
    helpSummary:
      'Build dishes by combining recipes. Define portion sizes and plating. Dishes feed into your menu and COGS calculations.',
    guideId: 'dish-builder',
    guideStepIndex: 0,
  },
  '/webapp/performance': {
    helpSummary:
      "See which menu items are profitable (Chef's Kiss), which need marketing (Hidden Gems), and which to adjust or remove (Bargain Bucket, Burnt Toast).",
    guideId: 'cogs-performance',
    guideStepIndex: 2,
  },
  '/webapp/temperature': {
    helpSummary:
      'Track fridge and freezer temperatures for food safety. Add equipment, log readings, and view trends. Queensland standards are applied automatically.',
    guideId: 'compliance-safety',
    guideStepIndex: 0,
  },
  '/webapp/compliance': {
    helpSummary:
      'Record compliance activities (cleaning, temperature checks, training). Keep everything audit-ready for health inspectors.',
    guideId: 'compliance-safety',
    guideStepIndex: 4,
  },
  '/webapp/suppliers': {
    helpSummary:
      'Manage suppliers and price lists. Link ingredients to suppliers for accurate cost tracking and order list generation.',
    guideId: 'inventory-ordering',
    guideStepIndex: 0,
  },
  '/webapp/prep-lists': {
    helpSummary:
      'Generate prep lists from your menu and schedule. Plan what to prep and when based on upcoming functions or daily specials.',
    guideId: 'prep-lists',
    guideStepIndex: 0,
  },
  '/webapp/order-lists': {
    helpSummary:
      'Create order lists for suppliers. Uses your ingredient par levels and supplier links to suggest what to order.',
    guideId: 'inventory-ordering',
    guideStepIndex: 4,
  },
  '/webapp/par-levels': {
    helpSummary:
      'Set minimum stock levels (par levels) and reorder points for each ingredient. Used to generate order lists and prevent stockouts.',
    guideId: 'inventory-ordering',
    guideStepIndex: 2,
  },
  '/webapp/menu-builder': {
    helpSummary:
      'Organize your menu by sections. Add dishes, set prices, and lock when ready. Changes sync to order lists and performance analysis.',
    guideId: 'menu-builder',
    guideStepIndex: 2,
  },
  '/webapp/cogs': {
    helpSummary:
      'View COGS breakdown per recipe. Use the pricing tool to hit target margins. Costs flow from ingredients and recipes.',
    guideId: 'cogs-performance',
    guideStepIndex: 0,
  },
  '/webapp/cleaning': {
    helpSummary:
      'Define cleaning areas and tasks. Use the 14-day calendar to track completion and stay compliant.',
    guideId: 'compliance-safety',
    guideStepIndex: 2,
  },
  '/webapp/specials': {
    helpSummary:
      'Create and manage daily or weekly specials. AI can suggest specials based on inventory and performance.',
    guideId: 'ai-sharing',
    guideStepIndex: 0,
  },
  '/webapp/recipe-sharing': {
    helpSummary:
      'Share recipes with other PrepFlow users. Great for franchises or kitchen teams collaborating across locations.',
    guideId: 'ai-sharing',
    guideStepIndex: 1,
  },
  '/webapp/setup': {
    helpSummary:
      'Initialize or reset your database. Use populate test data for demos, or reset to start fresh. Requires admin key in development.',
    guideId: 'setup-settings',
    guideStepIndex: 0,
  },
  '/webapp/staff': {
    helpSummary:
      'Manage team members, track certifications, and handle employee onboarding documents.',
  },
  '/webapp/customers': {
    helpSummary:
      'Manage your CRM—recurring clients and function organizers. Track contact details and event history.',
    guideId: 'functions-catering',
    guideStepIndex: 0,
  },
  '/webapp/sections': {
    helpSummary:
      'Create menu sections (e.g. Mains, Desserts). Organize dishes for your menu and order flow.',
    guideId: 'menu-builder',
    guideStepIndex: 0,
  },
  '/webapp/roster': {
    helpSummary:
      'Build weekly rosters with drag-and-drop. Assign shifts to staff and track labor costs.',
  },
  '/webapp/time-attendance': {
    helpSummary: 'Clock in and out with geofencing. Track staff attendance and hours worked.',
  },
  '/webapp/functions': {
    helpSummary:
      'Plan catering functions, weddings, and special events. Track headcount, menus, and costs per function.',
    guideId: 'functions-catering',
    guideStepIndex: 1,
  },
  '/webapp/square': {
    helpSummary:
      'Connect Square POS to sync menu items, staff, sales data, and food costs. Enable automatic COGS and performance updates.',
  },
  '/webapp/settings': {
    helpSummary:
      'Configure your profile, notifications, billing, backups, and integration settings.',
    guideId: 'setup-settings',
    guideStepIndex: 2,
  },
  '/webapp/guide': {
    helpSummary:
      'Step-by-step guides with screenshots and interactive demos. Learn PrepFlow at your own pace.',
  },
};

/**
 * Get help config for a given pathname.
 * Supports partial matches (e.g. /webapp/ingredients/123 matches /webapp/ingredients).
 */
export function getPageHelpConfig(pathname: string): PageHelpConfig | null {
  // Exact match first
  if (PAGE_HELP_CONFIG[pathname]) {
    return PAGE_HELP_CONFIG[pathname];
  }
  // Find longest matching prefix
  let bestMatch: PageHelpConfig | null = null;
  let bestLength = 0;
  for (const [route, config] of Object.entries(PAGE_HELP_CONFIG)) {
    if (pathname.startsWith(route) && route.length > bestLength) {
      bestMatch = config;
      bestLength = route.length;
    }
  }
  return bestMatch;
}

/**
 * Build guide deep-link URL.
 */
export function buildGuideUrl(guideId: string, stepIndex?: number): string {
  const params = new URLSearchParams({ guide: guideId });
  if (stepIndex !== undefined && stepIndex >= 0) {
    params.set('step', String(stepIndex));
  }
  return `/webapp/guide?${params.toString()}`;
}
