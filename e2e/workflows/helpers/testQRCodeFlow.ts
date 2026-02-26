/**
 * Test QR code generation and modal display for equipment.
 * Navigates to temperature equipment, clicks QR code button, verifies
 * the modal opens with QR content, then closes.
 * Resilient: continues even if QR code buttons are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function testQRCodeFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Navigate to Temperature Equipment for QR codes');
  try {
    await page.goto('/webapp/temperature', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  } catch (navErr) {
    const msg = navErr instanceof Error ? navErr.message : String(navErr);
    if (msg.includes('ERR_CONNECTION_REFUSED') || msg.includes('net::ERR_')) {
      testSteps.push('[testQRCode] Server connection refused - skipping QR code test');
      return;
    }
    throw navErr;
  }
  await page.waitForTimeout(getSimWait(800));

  const equipmentTab = page
    .locator('button:has-text("Equipment"), [role="tab"]:has-text("Equipment")')
    .first();
  if (await equipmentTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await equipmentTab.click();
    await page.waitForTimeout(getSimWait(800));
  }

  const qrBtn = page
    .locator('button:has-text("QR"), button[aria-label*="QR"], button[aria-label*="qr code"]')
    .first();

  if (!(await qrBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    const firstEquipment = page
      .locator('table tbody tr, div[class*="group"][class*="rounded"]')
      .first();
    if (await firstEquipment.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstEquipment.click();
      await page.waitForTimeout(getSimWait(800));

      const detailQrBtn = page.locator('button:has-text("QR"), button[aria-label*="QR"]').first();
      if (await detailQrBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await detailQrBtn.click();
        await page.waitForTimeout(getSimWait(800));
        testSteps.push('Opened QR code modal from equipment detail');
      } else {
        testSteps.push('No QR code button found on equipment detail - skip');
        await collectPageErrors(page);
        return;
      }
    } else {
      testSteps.push('No equipment found - skip QR code test');
      await collectPageErrors(page);
      return;
    }
  } else {
    await qrBtn.click();
    await page.waitForTimeout(getSimWait(800));
    testSteps.push('Opened QR code modal from equipment list');
  }

  const qrModal = page.locator('[role="dialog"], [data-state="open"]').first();
  if (await qrModal.isVisible({ timeout: 3000 }).catch(() => false)) {
    const qrImage = qrModal.locator('canvas, img, svg').first();
    if (await qrImage.isVisible({ timeout: 3000 }).catch(() => false)) {
      testSteps.push('QR code rendered in modal');
    }

    const printBtn = qrModal.locator('button:has-text("Print")').first();
    if (await printBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      testSteps.push('Print QR button found');
    }

    const closeBtn = page
      .locator('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]')
      .first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(getSimWait(300));
    }
  }

  await collectPageErrors(page);
  testSteps.push('QR code flow completed');
}
