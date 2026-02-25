/**
 * Helper function for creating a cleaning task (or area + task) in the chef workflow test.
 * If areas exist: Areas tab -> Add Task on first area -> fill CreateTaskForm.
 * If no areas: Add Area -> fill AddAreaForm -> then Add Task on new area.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

const TASK_NAME = 'Sim test clean';

export async function createCleaningTaskFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Cleaning page');
  await page.goto('/webapp/cleaning');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(1200));
  await collectPageErrors(page);

  testSteps.push('Switch to Cleaning Areas tab');
  const areasTab = page.getByRole('button', { name: /Cleaning Areas/i }).first();
  await areasTab.waitFor({ state: 'visible', timeout: 10000 });
  await areasTab.click();
  await page.waitForTimeout(getSimWait(1500));

  // Check if areas exist (AreaCards with "Add Task")
  const addTaskOnCard = page.getByRole('button', { name: /Add task to|Add Task/i }).first();
  const hasAreas = await addTaskOnCard.isVisible({ timeout: 10000 }).catch(() => false);

  if (!hasAreas) {
    testSteps.push('No areas - creating area first');
    const createAreaBtn = page
      .locator(
        'button:has-text("Create Your First Area"), button:has-text("Add Area"), button:has-text("Create")',
      )
      .first();
    await createAreaBtn.waitFor({ state: 'visible', timeout: 8000 });
    await createAreaBtn.click();
    await page.waitForTimeout(getSimWait(800));

    const areaNameInput = page
      .locator('input[placeholder*="Kitchen Floors"], input[placeholder*="Prep Tables"]')
      .first();
    await areaNameInput.waitFor({ state: 'visible', timeout: 5000 });
    await areaNameInput.fill('Sim Test Area');
    await page.waitForTimeout(getSimWait(300));

    const saveAreaBtn = page.locator('button:has-text("Save Area")').first();
    await saveAreaBtn.click();
    await waitForFormSubmission(page);
    await page.waitForTimeout(getSimWait(1200)); // Area list refreshes

    // Now click Add Task on the new area (list may need moment to update after modal close)
    await page.waitForTimeout(getSimWait(2500));
    const addTaskAfterArea = page.getByRole('button', { name: /Add task to|Add Task/i }).first();
    await addTaskAfterArea.waitFor({ state: 'visible', timeout: 20000 });
    await addTaskAfterArea.click();
  } else {
    testSteps.push('Click Add Task on first area');
    await addTaskOnCard.click();
  }

  await page.waitForTimeout(getSimWait(1000)); // CreateTaskForm modal loads

  testSteps.push('Fill CreateTaskForm and save');
  const taskNameInput = page.locator('input[placeholder*="Clean kitchen floor"]').first();
  await taskNameInput.waitFor({ state: 'visible', timeout: 8000 });
  await taskNameInput.fill(TASK_NAME);
  await page.waitForTimeout(getSimWait(500));

  // If area select visible (no preselected), select first area
  const areaSelect = page
    .locator('select')
    .filter({ has: page.locator('option[value]:not([value=""])') })
    .first();
  if (await areaSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    const firstOption = areaSelect.locator('option[value]:not([value=""])').first();
    const val = await firstOption.getAttribute('value');
    if (val) {
      await areaSelect.selectOption(val);
      await page.waitForTimeout(getSimWait(400));
    }
  }

  const createTaskBtn = page.locator('button:has-text("Create Task")').first();
  await createTaskBtn.waitFor({ state: 'visible', timeout: 5000 });
  await createTaskBtn.click();
  await waitForFormSubmission(page);
  await page.waitForTimeout(getSimWait(600));

  await collectPageErrors(page);
  testSteps.push('Cleaning task flow completed');
}
