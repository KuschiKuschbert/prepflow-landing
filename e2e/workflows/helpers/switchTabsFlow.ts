/**
 * Generic tab switching flow for pages with multiple tabs.
 * Visits each page and clicks through all visible tabs, collecting errors after each switch.
 * Covers: temperature (Logs/Equipment/Analytics), cleaning (Grid/Areas),
 * compliance (Records/Types/Report/Allergens/Equipment), suppliers (Suppliers/Price Lists),
 * recipes (Recipes/Dishes tabs + modal tabs), menu builder (All Menus/A la carte/Function).
 * Resilient: continues even if a tab is not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

interface TabConfig {
  route: string;
  tabLabels: string[];
}

const TAB_CONFIGS: TabConfig[] = [
  {
    route: '/webapp/temperature',
    tabLabels: ['Logs', 'Equipment', 'Analytics', 'Temperature Logs', 'Temp Logs'],
  },
  {
    route: '/webapp/cleaning',
    tabLabels: ['Grid', 'Cleaning Areas', 'Areas', 'Today', 'Daily', 'Weekly'],
  },
  {
    route: '/webapp/compliance',
    tabLabels: ['Records', 'Types', 'Report', 'Allergens', 'Equipment', 'Health Inspector'],
  },
  {
    route: '/webapp/suppliers',
    tabLabels: ['Suppliers', 'Price Lists'],
  },
  {
    route: '/webapp/recipes',
    tabLabels: ['Recipes', 'Dishes'],
  },
  {
    route: '/webapp/menu-builder',
    tabLabels: ['All Menus', 'A la carte', 'Function', 'Catering'],
  },
  {
    route: '/webapp/cogs',
    tabLabels: ['Analysis', 'Calculator', 'Ingredients'],
  },
  {
    route: '/webapp/settings',
    tabLabels: [
      'Profile',
      'Region',
      'Security',
      'Privacy',
      'Connected',
      'Features',
      'Help',
      'Support',
    ],
  },
];

async function switchTabsOnPage(page: Page, config: TabConfig, testSteps: string[]): Promise<void> {
  try {
    await page.goto(config.route, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  } catch {
    testSteps.push(`[switchTabs] Navigation to ${config.route} failed - skipping`);
    return;
  }
  if (page.url().includes('auth0.com') || page.url().includes('/api/auth/login')) {
    testSteps.push(`[switchTabs] Redirected to auth on ${config.route} - skipping`);
    return;
  }
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  for (const label of config.tabLabels) {
    const tabBtn = page
      .locator(`button:has-text("${label}"), [role="tab"]:has-text("${label}")`)
      .first();
    if (await tabBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tabBtn.click();
      await page.waitForTimeout(getSimWait(500));
      await collectPageErrors(page);
      testSteps.push(`Switched to "${label}" tab on ${config.route}`);
    }
  }
}

export async function switchTabsFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Begin tab switching sweep');

  for (const config of TAB_CONFIGS) {
    try {
      await switchTabsOnPage(page, config, testSteps);
    } catch {
      testSteps.push(`Failed to complete tabs on ${config.route}`);
    }
  }

  testSteps.push('Tab switching sweep completed');
}
