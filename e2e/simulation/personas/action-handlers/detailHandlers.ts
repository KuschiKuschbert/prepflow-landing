/**
 * Detail-view and special action handlers. Extracted for filesize limit.
 */
import type { Page } from '@playwright/test';
import { collectPageErrors } from '../../../fixtures/global-error-listener';
import { clickPrintIfAvailable } from '../../../workflows/helpers/printOrExportHelpers';
import { getSimWait, safeGoto } from '../../../helpers/sim-wait';

export async function handleMarkCleaningComplete(page: Page): Promise<void> {
  if (!(await safeGoto(page, '/webapp/cleaning'))) return;
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
  if (!(await safeGoto(page, '/webapp/recipe-sharing'))) return;
  await page.waitForTimeout(getSimWait(800));
  const shareBtn = page
    .locator('button:has-text("Share Recipe"), button:has-text("Share Your First Recipe"), button:has-text("Share")')
    .first();
  if (await shareBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await shareBtn.click();
    await page.waitForTimeout(getSimWait(1000));

    // Try to select a recipe from the dropdown if the share form is open
    const recipeSelect = page
      .locator('select[name*="recipe"], select[aria-label*="recipe"], select[id*="recipe"]')
      .first();
    if (await recipeSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      const options = await recipeSelect.locator('option').all();
      if (options.length > 1) {
        const optionValue = await options[1].getAttribute('value');
        if (optionValue) {
          await recipeSelect.selectOption(optionValue);
          await page.waitForTimeout(getSimWait(300));
        }
      }
    }

    // Try to select share type (link)
    const linkTypeBtn = page
      .locator('button:has-text("Link"), input[value="link"], label:has-text("Link")')
      .first();
    if (await linkTypeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await linkTypeBtn.click();
      await page.waitForTimeout(getSimWait(300));
    }

    // Cancel to avoid actually sharing
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelBtn.click();
      await page.waitForTimeout(getSimWait(500));
    } else {
      // Fallback: close via X or escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(getSimWait(300));
    }
  }
  await collectPageErrors(page);
}

export async function handlePrintMenu(page: Page): Promise<void> {
  if (!(await safeGoto(page, '/webapp/menu-builder'))) return;
  await page.waitForTimeout(getSimWait(1200));
  await clickPrintIfAvailable(page);
  await collectPageErrors(page);
}

export async function handleViewEquipmentDetail(page: Page): Promise<void> {
  if (!(await safeGoto(page, '/webapp/temperature'))) return;
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
  if (!(await safeGoto(page, '/webapp/functions'))) return;
  await page.waitForTimeout(getSimWait(800));
  const firstRow = page.locator('table tbody tr[class*="cursor-pointer"], tbody tr').first();
  if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstRow.click();
    await page.waitForTimeout(getSimWait(1000));
  }
  await collectPageErrors(page);
}

export async function handleViewIngredientDetail(page: Page): Promise<void> {
  if (!(await safeGoto(page, '/webapp/ingredients'))) return;
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
  if (!(await safeGoto(page, '/webapp/ingredients'))) return;
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
  if (!(await safeGoto(page, '/webapp/customers'))) return;
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
  if (!(await safeGoto(page, '/webapp/performance'))) return;
  await page.waitForTimeout(getSimWait(1200));
  const chartTab = page
    .locator('button:has-text("Charts"), button:has-text("Analysis"), button:has-text("Visual")')
    .first();
  if (await chartTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await chartTab.click();
    await page.waitForTimeout(getSimWait(1000));
  }

  // Click category filter buttons to filter the performance list
  const categoryFilters = [
    "Chef's Kiss",
    'Hidden Gem',
    'Bargain Bucket',
    'Burnt Toast',
  ];
  for (const category of categoryFilters) {
    const filterBtn = page
      .locator(`button:has-text("${category}"), [data-filter="${category}"]`)
      .first();
    if (await filterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterBtn.click();
      await page.waitForTimeout(getSimWait(600));
      await collectPageErrors(page);
      // Click again to clear the filter before trying the next one
      if (await filterBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await filterBtn.click();
        await page.waitForTimeout(getSimWait(400));
      }
      break; // One category filter is enough to test the feature
    }
  }

  // Click date range selector if visible
  const dateRangeBtn = page
    .locator(
      'button:has-text("Date Range"), button:has-text("7 days"), button:has-text("30 days"), ' +
      'select[aria-label*="date"], select[aria-label*="range"]',
    )
    .first();
  if (await dateRangeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dateRangeBtn.click();
    await page.waitForTimeout(getSimWait(800));
    // Close any dropdown that opened
    await page.keyboard.press('Escape');
    await page.waitForTimeout(getSimWait(300));
  }

  await collectPageErrors(page);
}
