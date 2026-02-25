/**
 * Interact with settings page forms and panels.
 * Visits settings sub-pages and interacts with forms: profile info, region,
 * feature flags toggles, support form, and privacy controls.
 * Does NOT perform destructive operations (no account deletion, no billing changes).
 * Resilient: continues even if settings panels are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function testProfileForm(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test profile information form');
  await page.goto('/webapp/settings', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1000));

  const profileTab = page
    .locator('button:has-text("Profile"), [role="tab"]:has-text("Profile")')
    .first();
  if (await profileTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await profileTab.click();
    await page.waitForTimeout(getSimWait(600));
  }

  const nameInput = page
    .locator(
      'input[name="name"], input[name="display_name"], input[placeholder*="Your name"], input[placeholder*="Display name"]',
    )
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const currentValue = await nameInput.inputValue();
    testSteps.push(`Profile name field found with value: "${currentValue}"`);
  }

  await collectPageErrors(page);
}

async function testRegionSettings(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test region settings');

  const regionTab = page
    .locator('button:has-text("Region"), [role="tab"]:has-text("Region")')
    .first();
  if (await regionTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await regionTab.click();
    await page.waitForTimeout(getSimWait(600));
  }

  const countrySelect = page
    .locator('select[name*="country"], select[name*="region"], select')
    .first();
  if (await countrySelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    const options = countrySelect.locator('option');
    const count = await options.count();
    testSteps.push(`Region select found with ${count} options`);
  }

  const currencySelect = page.locator('select[name*="currency"]').first();
  if (await currencySelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    testSteps.push('Currency select found');
  }

  await collectPageErrors(page);
}

async function testFeatureFlags(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test feature flags section');

  const featuresTab = page
    .locator('button:has-text("Features"), [role="tab"]:has-text("Features")')
    .first();
  if (await featuresTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await featuresTab.click();
    await page.waitForTimeout(getSimWait(600));
  }

  const toggles = page.locator(
    'button[role="switch"], input[type="checkbox"][name*="feature"], label:has(input[type="checkbox"])',
  );
  const toggleCount = await toggles.count();
  testSteps.push(`Found ${toggleCount} feature flag toggles`);

  await collectPageErrors(page);
}

async function testSupportForm(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test support/help section');

  const helpTab = page
    .locator('button:has-text("Help"), button:has-text("Support"), [role="tab"]:has-text("Help")')
    .first();
  if (await helpTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await helpTab.click();
    await page.waitForTimeout(getSimWait(600));
  }

  const contactBtn = page
    .locator('button:has-text("Contact"), button:has-text("Submit"), button:has-text("Send")')
    .first();
  if (await contactBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('Support contact button found');
  }

  await collectPageErrors(page);
}

async function testBackupSettings(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test backup settings page');
  await page.goto('/webapp/settings/backup', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));

  const createBackupBtn = page
    .locator('button:has-text("Create Backup"), button:has-text("Backup Now")')
    .first();
  if (await createBackupBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('Create Backup button found');
  }

  const formatSelect = page.locator('select[name*="format"]').first();
  if (await formatSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    testSteps.push('Backup format select found');
  }

  const scheduleToggle = page.locator('button[role="switch"], input[type="checkbox"]').first();
  if (await scheduleToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
    testSteps.push('Scheduled backup toggle found');
  }

  await collectPageErrors(page);
}

async function testBillingPage(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test billing page (read-only)');
  await page.goto('/webapp/settings/billing', {
    waitUntil: SIM_FAST ? 'domcontentloaded' : 'load',
  });
  await page.waitForTimeout(getSimWait(800));

  const planInfo = page.locator('text=/Starter|Pro|Business|Free|Trial/i').first();
  if (await planInfo.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('Current plan information displayed');
  }

  await collectPageErrors(page);
}

export async function interactSettingsFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Begin settings interaction tests');

  await testProfileForm(page, testSteps);
  await testRegionSettings(page, testSteps);
  await testFeatureFlags(page, testSteps);
  await testSupportForm(page, testSteps);
  await testBackupSettings(page, testSteps);
  await testBillingPage(page, testSteps);

  testSteps.push('Settings interaction tests completed');
}
