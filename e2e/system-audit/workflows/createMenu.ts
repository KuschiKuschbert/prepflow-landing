/**
 * Chef Workflow - Create Menu Cycle.
 */
import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Chef Workflow - Create Menu Cycle.
 */
export async function chefWorkflowCreateMenu(
  page: Page,
  TEST_PREFIX: string,
  visitedPages: Set<string>,
): Promise<void> {
  try {
    await page.goto('/webapp/menu-builder', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 });
  } catch {
    return; // Navigation failed, skip
  }
  await page.waitForTimeout(getSimWait(2000));
  await collectPageErrors(page);
  visitedPages.add(page.url());

  const addButton = page
    .locator('button:has-text("New Menu"), button:has-text("Create Menu")')
    .first();
  const addBtnVisible = await addButton.isVisible({ timeout: 10000 }).catch(() => false);
  if (!addBtnVisible) return;

  await addButton.click();
  await page.waitForTimeout(getSimWait(500));

  const menuName = `${TEST_PREFIX}_Menu`;
  const menuNameInput = page
    .locator('input[name="menu_name"], input[placeholder*="Menu Name"]')
    .first();
  const inputVisible = await menuNameInput.isVisible({ timeout: 10000 }).catch(() => false);
  if (!inputVisible) return;

  await menuNameInput.fill(menuName);

  const saveButton = page
    .locator('button:has-text("Save"), button:has-text("Create Menu")')
    .first();
  const saveBtnVisible = await saveButton.isVisible({ timeout: 5000 }).catch(() => false);
  if (!saveBtnVisible) return;

  await saveButton.click();
  await page.waitForTimeout(getSimWait(2000));
  await collectPageErrors(page);

  const menuLink = page.locator(`text=${menuName}`).first();
  const menuLinkVisible = await menuLink.isVisible({ timeout: 10000 }).catch(() => false);
  if (!menuLinkVisible) return;

  await menuLink.click();
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  const addItemButton = page
    .locator('button:has-text("Add Item"), button:has-text("Add Dish")')
    .first();
  if (!(await addItemButton.isVisible({ timeout: 3000 }).catch(() => false))) return;

  await addItemButton.click();
  await page.waitForTimeout(getSimWait(500));

  const searchInput = page
    .locator('input[placeholder*="Search"], input[placeholder*="dish"]')
    .first();
  if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await searchInput.fill(`${TEST_PREFIX}_Pizza`);
    await page.waitForTimeout(getSimWait(500));

    const dishOption = page.locator(`text=${TEST_PREFIX}_Pizza`).first();
    if (await dishOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dishOption.click();
      await page.waitForTimeout(getSimWait(500));
    }
  }

  const saveItemButton = page.locator('button:has-text("Add"), button:has-text("Save")').first();
  if (await saveItemButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await saveItemButton.click();
    await page.waitForTimeout(getSimWait(1500));
    await collectPageErrors(page);
  }
}
