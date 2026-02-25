/**
 * Detail-view and special action handlers. Extracted for filesize limit.
 */
import type { Page } from '@playwright/test';
import { collectPageErrors } from '../../../fixtures/global-error-listener';
import { clickPrintIfAvailable } from '../../../workflows/helpers/printOrExportHelpers';
import { getSimWait, SIM_FAST } from '../../../helpers/sim-wait';

export async function handleMarkCleaningComplete(page: Page): Promise<void> {
  await page.goto('/webapp/cleaning', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));
  const markCompleteBtn = page
    .locator('button:has-text("Mark Complete"), button:has-text("Complete")')
    .first();
  if (await markCompleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await markCompleteBtn.click();
    await page.waitForTimeout(getSimWait(600));
    const confirmBtn = page
      .locator('button:has-text("Confirm"), button:has-text("Mark Complete")')
      .first();
    if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) await confirmBtn.click();
  }
  await collectPageErrors(page);
}

export async function handleShareRecipe(page: Page): Promise<void> {
  await page.goto('/webapp/recipe-sharing', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(500));
  const shareBtn = page
    .locator('button:has-text("Share"), button:has-text("Share Your First Recipe")')
    .first();
  if (await shareBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await shareBtn.click();
    await page.waitForTimeout(getSimWait(1000));
    await page
      .locator('button:has-text("Cancel")')
      .first()
      .click()
      .catch(() => {});
  }
  await collectPageErrors(page);
}

export async function handlePrintMenu(page: Page): Promise<void> {
  await page.goto('/webapp/menu-builder', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1200));
  await clickPrintIfAvailable(page);
  await collectPageErrors(page);
}

export async function handleViewEquipmentDetail(page: Page): Promise<void> {
  await page.goto('/webapp/temperature', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));
  const equipmentTab = page
    .locator('button:has-text("Equipment"), [aria-label="View temperature equipment"]')
    .first();
  if (await equipmentTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await equipmentTab.click();
    await page.waitForTimeout(getSimWait(1000));
    const firstEquipment = page
      .locator('table tbody tr.cursor-pointer, div.group.rounded-3xl.border')
      .first();
    if (await firstEquipment.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstEquipment.click();
      await page.waitForTimeout(getSimWait(600));
    }
  }
  await collectPageErrors(page);
}

export async function handleViewFunctionDetail(page: Page): Promise<void> {
  await page.goto('/webapp/functions', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));
  const firstRow = page.locator('table tbody tr[class*="cursor-pointer"], tbody tr').first();
  if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstRow.click();
    await page.waitForTimeout(getSimWait(1000));
  }
  await collectPageErrors(page);
}

export async function handleViewIngredientDetail(page: Page): Promise<void> {
  await page.goto('/webapp/ingredients', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));
  const ingredientRow = page
    .locator('table tbody tr, div[class*="group"][class*="rounded"]')
    .first();
  if (await ingredientRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await ingredientRow.click();
    await page.waitForTimeout(getSimWait(800));
  }
  await collectPageErrors(page);
}

export async function handleEditIngredient(page: Page): Promise<void> {
  await page.goto('/webapp/ingredients', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));
  const editRow = page.locator('table tbody tr, div[class*="group"][class*="rounded"]').first();
  if (await editRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    const editBtn = editRow.locator('button:has-text("Edit"), button[aria-label*="Edit"]').first();
    if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editBtn.click();
    } else {
      await editRow.click();
    }
    await page.waitForTimeout(getSimWait(800));
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) cancelBtn.click();
  }
  await collectPageErrors(page);
}

export async function handleViewCustomerDetail(page: Page): Promise<void> {
  await page.goto('/webapp/customers', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));
  const customerRow = page
    .locator('table tbody tr[class*="cursor-pointer"], tbody tr, div[class*="group"]')
    .first();
  if (await customerRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await customerRow.click();
    await page.waitForTimeout(getSimWait(800));
  }
  await collectPageErrors(page);
}

export async function handleViewPerformanceCharts(page: Page): Promise<void> {
  await page.goto('/webapp/performance', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1200));
  const chartTab = page
    .locator('button:has-text("Charts"), button:has-text("Analysis"), button:has-text("Visual")')
    .first();
  if (await chartTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await chartTab.click();
    await page.waitForTimeout(getSimWait(1000));
  }
  await collectPageErrors(page);
}
