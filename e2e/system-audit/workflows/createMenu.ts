/**
 * Chef Workflow - Create Menu Cycle.
 */
import { Page, expect } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

/**
 * Chef Workflow - Create Menu Cycle.
 */
export async function chefWorkflowCreateMenu(
  page: Page,
  TEST_PREFIX: string,
  visitedPages: Set<string>,
): Promise<void> {
  await page.goto('/webapp/menu-builder');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);
  visitedPages.add(page.url());

  const addButton = page
    .locator('button:has-text("New Menu"), button:has-text("Create Menu")')
    .first();
  await addButton.click();
  await page.waitForTimeout(500);

  const menuName = `${TEST_PREFIX}_Menu`;
  await page.fill('input[name="menu_name"], input[placeholder*="Menu Name"]', menuName);

  const saveButton = page
    .locator('button:has-text("Save"), button:has-text("Create Menu")')
    .first();
  await saveButton.click();
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  await expect(page.locator(`text=${menuName}`).first()).toBeVisible({ timeout: 10000 });

  await page.locator(`text=${menuName}`).first().click();
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  const addItemButton = page
    .locator('button:has-text("Add Item"), button:has-text("Add Dish")')
    .first();
  if ((await addItemButton.count()) > 0) {
    await addItemButton.click();
    await page.waitForTimeout(500);

    const searchInput = page
      .locator('input[placeholder*="Search"], input[placeholder*="dish"]')
      .first();
    if ((await searchInput.count()) > 0) {
      await searchInput.fill(`${TEST_PREFIX}_Pizza`);
      await page.waitForTimeout(500);

      const dishOption = page.locator(`text=${TEST_PREFIX}_Pizza`).first();
      if ((await dishOption.count()) > 0) {
        await dishOption.click();
        await page.waitForTimeout(500);
      }
    }

    const categorySelect = page
      .locator('select[name="category"], [aria-label*="category"]')
      .first();
    if ((await categorySelect.count()) > 0) {
      await categorySelect.selectOption({ label: /dinner/i });
    }

    const saveItemButton = page.locator('button:has-text("Add"), button:has-text("Save")').first();
    if ((await saveItemButton.count()) > 0) {
      await saveItemButton.click();
      await page.waitForLoadState('networkidle');
      await collectPageErrors(page);
    }
  }
}


