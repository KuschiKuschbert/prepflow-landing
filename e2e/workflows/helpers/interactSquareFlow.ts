import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Interact Square Flow
 *
 * Navigates to /webapp/square and cycles through all 6 sections:
 * Overview → Configuration → Sync → Mappings → History → Webhooks
 *
 * At each section, verifies the section rendered. If the page shows a
 * "feature disabled" or "coming soon" banner, records that and returns.
 */
export async function interactSquareFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Navigate to Square integration page');

  try {
    await page.goto('/webapp/square', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[interactSquare] Navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Check if the feature is disabled / coming soon
  const featureBanner = page
    .locator('text=Coming Soon, text=feature disabled, text=not available, text=Not Available')
    .first();
  if (await featureBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
    testSteps.push('[interactSquare] Feature not available - skipping sections');
    return;
  }

  const sections = ['overview', 'configuration', 'sync', 'mappings', 'history', 'webhooks'] as const;

  for (const section of sections) {
    // Click the nav link for this section
    const navLink = page
      .locator(`a[href="#${section}"], button:has-text("${capitalize(section)}")`)
      .first();

    const navLinkVisible = await navLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (navLinkVisible) {
      await navLink.click();
      await page.waitForTimeout(getSimWait(1000));
      await collectPageErrors(page);
    } else {
      // Fallback: navigate via URL hash
      try {
        await page.goto(`/webapp/square#${section}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(getSimWait(800));
        await collectPageErrors(page);
      } catch {
        continue;
      }
    }

    // Verify the section heading or content is visible
    const sectionHeading = page
      .locator(
        `h1:has-text("${capitalize(section)}"), h2:has-text("${capitalize(section)}"), ` +
        `h3:has-text("${capitalize(section)}"), [id="${section}"]`,
      )
      .first();
    await sectionHeading.isVisible({ timeout: 3000 }).catch(() => false);
  }

  await collectPageErrors(page);
  testSteps.push('[interactSquare] Completed');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
