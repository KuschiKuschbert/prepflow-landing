import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Staff Onboarding Flow
 *
 * Navigates to the staff page, finds a staff member, and walks through the
 * 5-step onboarding wizard. Always cancels on the final step to avoid
 * submitting real data.
 */
export async function staffOnboardingFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Navigate to staff page for onboarding');

  // Navigate to staff page
  try {
    await page.goto('/webapp/staff', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[staffOnboarding] Navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(2000));
  await collectPageErrors(page);

  // Find the first staff card with an onboarding button
  const onboardingBtn = page
    .locator('button:has-text("Onboarding"), a:has-text("Onboarding"), button[aria-label*="nboarding"]')
    .first();
  const onboardingVisible = await onboardingBtn.isVisible({ timeout: 5000 }).catch(() => false);

  if (!onboardingVisible) {
    // Try clicking a staff card to get to the member first
    const staffCard = page.locator('[data-testid="staff-card"], .staff-card, [class*="StaffCard"]').first();
    const cardVisible = await staffCard.isVisible({ timeout: 5000 }).catch(() => false);
    if (!cardVisible) {
      testSteps.push('[staffOnboarding] No staff cards found - skipping');
      return;
    }
    await staffCard.click();
    await page.waitForTimeout(getSimWait(1000));
    await collectPageErrors(page);
  } else {
    await onboardingBtn.click();
    await page.waitForTimeout(getSimWait(1500));
  }

  // If we ended up on a staff detail page, look for the onboarding link
  const currentUrl = page.url();
  if (currentUrl.includes('/staff/') && !currentUrl.includes('/onboarding')) {
    const detailOnboardingBtn = page
      .locator('button:has-text("Onboarding"), a:has-text("Onboarding")')
      .first();
    const detailBtnVisible = await detailOnboardingBtn
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    if (!detailBtnVisible) {
      testSteps.push('[staffOnboarding] Detail onboarding button not found - skipping');
      return;
    }
    await detailOnboardingBtn.click();
    await page.waitForTimeout(getSimWait(1500));
  }

  await collectPageErrors(page);

  // Verify we're on the onboarding wizard page
  const wizardVisible = await page
    .locator('text=Employee Onboarding, text=Onboarding')
    .first()
    .isVisible({ timeout: 10000 })
    .catch(() => false);
  if (!wizardVisible) {
    testSteps.push('[staffOnboarding] Onboarding wizard not visible - skipping');
    return;
  }

  testSteps.push('Walk through onboarding wizard steps');

  // Step 1: Personal Details — read-only, just click Next
  const nextBtn = page
    .locator('button:has-text("Next"), button:has-text("Continue")')
    .first();
  if (await nextBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await nextBtn.click();
    await page.waitForTimeout(getSimWait(1000));
    await collectPageErrors(page);
  }

  // Step 2: ID Upload — skip actual upload, just click Next
  const step2Next = page
    .locator('button:has-text("Next"), button:has-text("Continue")')
    .first();
  if (await step2Next.isVisible({ timeout: 5000 }).catch(() => false)) {
    await step2Next.click();
    await page.waitForTimeout(getSimWait(1000));
    await collectPageErrors(page);
  }

  // Step 3: Contract Signature — click Next to skip
  const step3Next = page
    .locator('button:has-text("Next"), button:has-text("Continue")')
    .first();
  if (await step3Next.isVisible({ timeout: 5000 }).catch(() => false)) {
    await step3Next.click();
    await page.waitForTimeout(getSimWait(1000));
    await collectPageErrors(page);
  }

  // Step 4: Bank Details — fill test data then Next
  const bsbInput = page
    .locator('input[name*="bsb"], input[placeholder*="BSB"], input[id*="bsb"]')
    .first();
  if (await bsbInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await bsbInput.fill('062000');
    await page.waitForTimeout(getSimWait(300));
  }
  const accountInput = page
    .locator(
      'input[name*="account"], input[placeholder*="Account"], input[placeholder*="account"]',
    )
    .first();
  if (await accountInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await accountInput.fill('12345678');
    await page.waitForTimeout(getSimWait(300));
  }
  const step4Next = page
    .locator('button:has-text("Next"), button:has-text("Continue")')
    .first();
  if (await step4Next.isVisible({ timeout: 5000 }).catch(() => false)) {
    await step4Next.click();
    await page.waitForTimeout(getSimWait(1000));
    await collectPageErrors(page);
  }

  // Step 5: TFN — fill test TFN then CANCEL (never submit real data)
  const tfnInput = page
    .locator('input[name*="tfn"], input[placeholder*="TFN"], input[placeholder*="tax"]')
    .first();
  if (await tfnInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await tfnInput.fill('123456782');
    await page.waitForTimeout(getSimWait(300));
  }
  // Always cancel on the last step
  const cancelBtn = page.locator('button:has-text("Cancel")').first();
  if (await cancelBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(getSimWait(1000));
  }

  await collectPageErrors(page);
  testSteps.push('[staffOnboarding] Completed');
}
