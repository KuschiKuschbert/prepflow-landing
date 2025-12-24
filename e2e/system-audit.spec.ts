/**
 * System Audit E2E Test Suite
 *
 * High-velocity stress test that:
 * 1. Executes complex business workflows ("Chef" workflow)
 * 2. Crawls all pages and fuzzes inputs ("Gremlin" crawler)
 * 3. Captures all errors (console, network, uncaught)
 * 4. Generates comprehensive QA audit report
 */

import { test, expect, Page } from '@playwright/test';
import { ensureAuthenticated } from './fixtures/auth-helper';
import {
  setupGlobalErrorListener,
  getCollectedErrors,
  collectPageErrors,
} from './fixtures/global-error-listener';
import type { TestResultsSummary } from './helpers/report-generator';
import { chefWorkflowCreateIngredient } from './system-audit/helpers/createChefWorkflows';
import { chefWorkflowCreateRecipe } from './system-audit/workflows/createRecipe';
import { chefWorkflowCreateMenu } from './system-audit/workflows/createMenu';
import { chefWorkflowCreateTemperatureLog } from './system-audit/workflows/createTemperatureLog';
import { chefWorkflowCreateEquipmentMaintenance } from './system-audit/workflows/createEquipmentMaintenance';
import { gremlinCrawler } from './system-audit/workflows/gremlinCrawler';
import { generateQAReport } from './system-audit/helpers/generateReport';
import { cleanupTestData } from './system-audit/helpers/cleanupTestData';

const TEST_PREFIX = `AUTO_TEST_${Date.now()}`;
const visitedPages = new Set<string>();
const screenshots: string[] = [];

test.describe('System Audit', () => {
  let testResults: TestResultsSummary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    tests: [],
  };

  test.beforeEach(async ({ page }) => {
    await setupGlobalErrorListener(page);
  });

  test('1. Chef Workflow - Login', async ({ page }) => {
    await page.goto('/webapp');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
    await ensureAuthenticated(page);
    await expect(page).toHaveURL(/\/webapp/);
    visitedPages.add(page.url());
  });

  test('2. Chef Workflow - Create Ingredient', async ({ page }) => {
    await chefWorkflowCreateIngredient(page, TEST_PREFIX, visitedPages);
  });

  test('3. Chef Workflow - Create Recipe/Dish', async ({ page }) => {
    await chefWorkflowCreateRecipe(page, TEST_PREFIX, visitedPages);
  });

  test('4. Chef Workflow - Create Menu Cycle', async ({ page }) => {
    await chefWorkflowCreateMenu(page, TEST_PREFIX, visitedPages);
  });

  test('5. Chef Workflow - Temperature Log', async ({ page }) => {
    await chefWorkflowCreateTemperatureLog(page, visitedPages);
  });

  test('6. Chef Workflow - Equipment Maintenance Log', async ({ page }) => {
    await chefWorkflowCreateEquipmentMaintenance(page, TEST_PREFIX, visitedPages);
  });

  test('7. Gremlin Crawler - Scan and Visit All Links', async ({ page }) => {
    await gremlinCrawler(page, visitedPages, screenshots);
  });

  test.afterAll(async ({ browser }) => {
    let cleanupPage: Page | null = null;
    try {
      cleanupPage = await browser.newPage();

      if (cleanupPage) {
        await setupGlobalErrorListener(cleanupPage);
        await collectPageErrors(cleanupPage);
      }
    } catch (err) {
      console.warn('Could not create cleanup page:', err);
    }

    const errors = getCollectedErrors();

    testResults = {
      total: visitedPages.size,
      passed: visitedPages.size,
      failed: 0,
      skipped: 0,
      duration: 0,
      tests: [],
    };

    generateQAReport(TEST_PREFIX, visitedPages, errors, screenshots);

    if (cleanupPage) {
      await cleanupTestData(cleanupPage, TEST_PREFIX);

      try {
        await cleanupPage.close();
      } catch (err) {
        // Page might already be closed
      }
    }
  });
});
