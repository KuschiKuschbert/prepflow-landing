import { test, expect, Page } from '@playwright/test';
import { ensureAuthenticated } from './fixtures/auth-helper';
import {
  setupGlobalErrorListener,
  getCollectedErrors,
  ErrorRecord,
  collectPageErrors,
} from './fixtures/global-error-listener';
import { generateQAReport, parseTestResults, TestResultsSummary } from './helpers/report-generator';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * System Audit E2E Test Suite
 *
 * High-velocity stress test that:
 * 1. Executes complex business workflows ("Chef" workflow)
 * 2. Crawls all pages and fuzzes inputs ("Gremlin" crawler)
 * 3. Captures all errors (console, network, uncaught)
 * 4. Generates comprehensive QA audit report
 */

const TEST_PREFIX = `AUTO_TEST_${Date.now()}`;
const visitedPages = new Set<string>();
const screenshots: string[] = [];

/**
 * Generate random valid data for form inputs
 */
function generateRandomData(inputType: string, fieldName: string): string {
  const lowerName = fieldName.toLowerCase();

  // Email fields
  if (lowerName.includes('email')) {
    return `test${Math.random().toString(36).substring(7)}@example.com`;
  }

  // Phone fields
  if (lowerName.includes('phone') || lowerName.includes('mobile')) {
    return `04${Math.floor(Math.random() * 90000000) + 10000000}`;
  }

  // Number fields
  if (inputType === 'number') {
    if (lowerName.includes('price') || lowerName.includes('cost')) {
      return (Math.random() * 100 + 1).toFixed(2);
    }
    if (lowerName.includes('quantity') || lowerName.includes('amount')) {
      return Math.floor(Math.random() * 100 + 1).toString();
    }
    if (lowerName.includes('percentage') || lowerName.includes('percent')) {
      return (Math.random() * 100).toFixed(1);
    }
    return Math.floor(Math.random() * 1000 + 1).toString();
  }

  // Date fields
  if (inputType === 'date') {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    return date.toISOString().split('T')[0];
  }

  // Text fields
  const words = ['Test', 'Sample', 'Demo', 'Example', 'Random', 'Data', 'Value'];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomNum = Math.floor(Math.random() * 1000);

  if (lowerName.includes('name') || lowerName.includes('title')) {
    return `${randomWord} ${randomNum}`;
  }

  if (lowerName.includes('description') || lowerName.includes('notes')) {
    return `${randomWord} description ${randomNum}. This is a test entry.`;
  }

  return `${randomWord}_${randomNum}`;
}

/**
 * Fuzz all form inputs on a page (without submitting)
 */
async function fuzzFormInputs(page: Page): Promise<void> {
  try {
    // Find all form inputs
    const inputs = await page.locator('input, select, textarea').all();

    for (const input of inputs) {
      try {
        const tagName = await input.evaluate(el => el.tagName.toLowerCase());
        const inputType = (await input.getAttribute('type')) || '';
        const fieldName =
          (await input.getAttribute('name')) || (await input.getAttribute('id')) || '';
        const isDisabled = await input.isDisabled();
        const isHidden = await input.isHidden();

        // Skip disabled or hidden inputs
        if (isDisabled || isHidden) continue;

        // Skip submit buttons
        if (inputType === 'submit' || inputType === 'button') continue;

        // Generate random valid data
        const randomData = generateRandomData(inputType, fieldName);

        // Fill the input
        if (tagName === 'select') {
          const options = await input.locator('option').all();
          if (options.length > 1) {
            // Skip first option (usually placeholder)
            const randomOption = options[Math.floor(Math.random() * (options.length - 1)) + 1];
            await randomOption.click();
          }
        } else if (inputType === 'checkbox' || inputType === 'radio') {
          // Randomly check/uncheck
          if (Math.random() > 0.5) {
            await input.check();
          } else {
            await input.uncheck();
          }
        } else {
          await input.fill(randomData);
        }
      } catch (err) {
        // Input might not be fillable, continue
        continue;
      }
    }
  } catch (err) {
    // Page might not have forms, continue
  }
}

/**
 * Check for broken images
 */
async function checkBrokenImages(page: Page): Promise<string[]> {
  const brokenImages: string[] = [];

  try {
    const images = await page.locator('img').all();

    for (const img of images) {
      try {
        const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
        const src = await img.getAttribute('src');

        if (naturalWidth === 0 && src) {
          brokenImages.push(src);
        }
      } catch (err) {
        // Image might not be loaded yet, continue
        continue;
      }
    }
  } catch (err) {
    // No images on page, continue
  }

  return brokenImages;
}

/**
 * Collect all links on current page
 */
async function collectLinks(page: Page): Promise<string[]> {
  const links: string[] = [];

  try {
    const linkElements = await page.locator('a[href]').all();

    for (const link of linkElements) {
      try {
        const href = await link.getAttribute('href');
        if (
          href &&
          !href.startsWith('#') &&
          !href.startsWith('javascript:') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:')
        ) {
          // Convert relative URLs to absolute
          try {
            const absoluteUrl = new URL(href, page.url()).toString();
            // Only include links within our app domain
            if (absoluteUrl.includes(page.url().split('/').slice(0, 3).join('/'))) {
              links.push(absoluteUrl);
            }
          } catch (urlErr) {
            // Invalid URL, skip
            continue;
          }
        }
      } catch (err) {
        continue;
      }
    }
  } catch (err) {
    // No links on page, continue
  }

  return links;
}

/**
 * Delete an item by searching for it and clicking delete
 */
async function deleteItemBySearch(
  page: Page,
  searchTerm: string,
  itemType: 'ingredient' | 'recipe' | 'menu',
): Promise<void> {
  try {
    // Search for the item
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if ((await searchInput.count()) === 0) {
      console.warn(`No search input found for ${itemType} deletion`);
      return;
    }

    await searchInput.fill(searchTerm);
    await page.waitForTimeout(1000);

    // Find all items matching the search term
    const itemRows = page.locator(`text=${searchTerm}`).all();
    const items = await itemRows;

    if (items.length === 0) {
      console.log(`No ${itemType} items found matching "${searchTerm}"`);
      return;
    }

    // For each matching item, find and click its delete button
    for (const item of items) {
      try {
        // Find the delete button near this item
        // The delete button is typically in the same row or card
        const deleteButton = page
          .locator(`button[aria-label*="Delete"]:near(:text("${searchTerm}"))`)
          .or(page.locator(`button:has-text("Delete"):near(:text("${searchTerm}"))`))
          .first();

        if ((await deleteButton.count()) > 0) {
          await deleteButton.click();
          await page.waitForTimeout(500);

          // Wait for and confirm deletion dialog
          const confirmDialog = page.locator('[role="dialog"][aria-modal="true"]').first();
          if ((await confirmDialog.count()) > 0) {
            // Click confirm button (usually "Delete" or "Confirm")
            const confirmButton = page
              .locator('button:has-text("Delete"), button:has-text("Confirm")')
              .filter({ hasText: /Delete|Confirm/i })
              .first();

            if ((await confirmButton.count()) > 0) {
              await confirmButton.click();
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(1000); // Wait for deletion to complete
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to delete ${itemType} item:`, err);
        continue;
      }
    }
  } catch (err) {
    console.error(`Error during ${itemType} deletion:`, err);
  }
}

test.describe('System Audit', () => {
  // Use test-level page fixture instead of shared page to avoid closure issues
  let testResults: TestResultsSummary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    tests: [],
  };

  test.beforeEach(async ({ page }) => {
    // Setup global error listener on each test's page
    await setupGlobalErrorListener(page);
  });

  test('1. Chef Workflow - Login', async ({ page }) => {
    await page.goto('/webapp');
    await page.waitForLoadState('networkidle');

    // Collect errors after navigation
    await collectPageErrors(page);

    // Ensure authenticated (in dev mode, auth is bypassed)
    await ensureAuthenticated(page);

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/webapp/);
    visitedPages.add(page.url());
  });

  test('2. Chef Workflow - Create Ingredient', async ({ page }) => {
    await page.goto('/webapp/ingredients');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
    visitedPages.add(page.url());

    // Click "Add" button (the button text is just "Add")
    // Look for the Add button in the header area - wait for page to be fully loaded first
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Brief wait for React hydration

    const addButton = page.locator('button:has-text("Add"):not(:has-text("Add Supplier"))').first();
    await addButton.waitFor({ state: 'visible', timeout: 15000 });
    await addButton.click();

    // Wait for wizard to appear - it renders inline below the header
    // The wizard shows when showAddForm becomes true, which triggers IngredientWizard to render
    // The wizard has a container div with class "mb-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]"
    // Wait for either the wizard title (h2) or the form input field
    // Use a more flexible selector that waits for the wizard container or its contents
    await page.waitForSelector(
      'h2:has-text("Add New Ingredient"), input[name="ingredient_name"], div:has-text("Add New Ingredient")',
      {
        state: 'visible',
        timeout: 15000,
      },
    );

    // Now get the input field - wait a bit more for React to fully render
    await page.waitForTimeout(500);
    const nameInput = page.locator('input[name="ingredient_name"]').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });

    // Fill ingredient form - Step 1: Basic info
    const ingredientName = `${TEST_PREFIX}_Flour`;
    await nameInput.fill(ingredientName);

    // Step 1: Pack size, unit, and price
    const packSizeInput = page.locator('input[name="pack_size"]').first();
    if ((await packSizeInput.count()) > 0) {
      await packSizeInput.fill('5');
      const packUnitSelect = page.locator('select[name="pack_size_unit"]').first();
      if ((await packUnitSelect.count()) > 0) {
        await packUnitSelect.selectOption('kg');
      }
      const packPriceInput = page.locator('input[name="pack_price"]').first();
      if ((await packPriceInput.count()) > 0) {
        await packPriceInput.fill('12.50');
      }
    }

    // Navigate to next step (wizard has 4 steps)
    const nextButton = page.locator('button:has-text("Next")').first();
    if ((await nextButton.count()) > 0 && (await nextButton.isEnabled())) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // Step 2: Unit and storage (if we're on step 2)
    const unitSelect = page.locator('select[name="unit"]').first();
    if ((await unitSelect.count()) > 0) {
      await unitSelect.selectOption('kg');
    }

    // Navigate to final step or save
    // The wizard saves on step 4, so we can click Next through steps or look for Save button
    const finalSaveButton = page
      .locator('button:has-text("Save"), button:has-text("Add Ingredient")')
      .first();
    if ((await finalSaveButton.count()) > 0 && (await finalSaveButton.isVisible())) {
      await finalSaveButton.click();
    } else {
      // Click through remaining steps
      for (let i = 0; i < 3; i++) {
        const nextBtn = page.locator('button:has-text("Next")').first();
        if ((await nextBtn.count()) > 0 && (await nextBtn.isEnabled())) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        } else {
          break;
        }
      }
      // Final save
      const saveBtn = page.locator('button:has-text("Save")').first();
      if ((await saveBtn.count()) > 0) {
        await saveBtn.click();
      }
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for save to complete
    await collectPageErrors(page);

    // Verify ingredient appears in list (wizard should close and ingredient should appear)
    await expect(page.locator(`text=${ingredientName}`).first()).toBeVisible({ timeout: 15000 });
  });

  test('3. Chef Workflow - Create Recipe/Dish', async ({ page }) => {
    await page.goto('/webapp/recipes');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
    visitedPages.add(page.url());

    // Click "New Recipe" or "Add Recipe" button
    const addButton = page
      .locator('button:has-text("New Recipe"), button:has-text("Add Recipe")')
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Fill recipe form
    const recipeName = `${TEST_PREFIX}_Pizza`;
    await page.fill('input[name="recipe_name"], input[placeholder*="Recipe Name"]', recipeName);
    await page.fill('input[name="yield"]', '4');

    // Save recipe
    const saveButton = page
      .locator('button:has-text("Save"), button:has-text("Add Recipe")')
      .first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Wait for recipe to appear, then click to edit/add ingredients
    await expect(page.locator(`text=${recipeName}`).first()).toBeVisible({ timeout: 10000 });

    // Click on the recipe to open it
    await page.locator(`text=${recipeName}`).first().click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Search for and add the ingredient we created
    const searchInput = page
      .locator('input[placeholder*="Search"], input[placeholder*="ingredient"]')
      .first();
    if ((await searchInput.count()) > 0) {
      await searchInput.fill(`${TEST_PREFIX}_Flour`);
      await page.waitForTimeout(500);

      // Click on the ingredient in search results
      const ingredientOption = page.locator(`text=${TEST_PREFIX}_Flour`).first();
      if ((await ingredientOption.count()) > 0) {
        await ingredientOption.click();
        await page.waitForTimeout(500);
      }
    }

    // Save recipe with ingredient
    const saveRecipeButton = page.locator('button:has-text("Save")').first();
    if ((await saveRecipeButton.count()) > 0) {
      await saveRecipeButton.click();
      await page.waitForLoadState('networkidle');
      await collectPageErrors(page);
    }
  });

  test('4. Chef Workflow - Create Menu Cycle', async ({ page }) => {
    await page.goto('/webapp/menu-builder');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
    visitedPages.add(page.url());

    // Click "New Menu" or "Create Menu" button
    const addButton = page
      .locator('button:has-text("New Menu"), button:has-text("Create Menu")')
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Fill menu form
    const menuName = `${TEST_PREFIX}_Menu`;
    await page.fill('input[name="menu_name"], input[placeholder*="Menu Name"]', menuName);

    // Save menu
    const saveButton = page
      .locator('button:has-text("Save"), button:has-text("Create Menu")')
      .first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Wait for menu to appear
    await expect(page.locator(`text=${menuName}`).first()).toBeVisible({ timeout: 10000 });

    // Click on menu to edit it
    await page.locator(`text=${menuName}`).first().click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Add dish to "Dinner Service" category
    // Look for category selector or "Add Item" button
    const addItemButton = page
      .locator('button:has-text("Add Item"), button:has-text("Add Dish")')
      .first();
    if ((await addItemButton.count()) > 0) {
      await addItemButton.click();
      await page.waitForTimeout(500);

      // Search for our recipe/dish
      const searchInput = page
        .locator('input[placeholder*="Search"], input[placeholder*="dish"]')
        .first();
      if ((await searchInput.count()) > 0) {
        await searchInput.fill(`${TEST_PREFIX}_Pizza`);
        await page.waitForTimeout(500);

        // Select the dish
        const dishOption = page.locator(`text=${TEST_PREFIX}_Pizza`).first();
        if ((await dishOption.count()) > 0) {
          await dishOption.click();
          await page.waitForTimeout(500);
        }
      }

      // Select "Dinner Service" category
      const categorySelect = page
        .locator('select[name="category"], [aria-label*="category"]')
        .first();
      if ((await categorySelect.count()) > 0) {
        await categorySelect.selectOption({ label: /dinner/i });
      }

      // Save menu item
      const saveItemButton = page
        .locator('button:has-text("Add"), button:has-text("Save")')
        .first();
      if ((await saveItemButton.count()) > 0) {
        await saveItemButton.click();
        await page.waitForLoadState('networkidle');
        await collectPageErrors(page);
      }
    }
  });

  test('5. Chef Workflow - Temperature Log', async ({ page }) => {
    await page.goto('/webapp/temperature');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
    visitedPages.add(page.url());

    // Click "Add Log" or "New Log" button
    const addButton = page
      .locator('button:has-text("Add Log"), button:has-text("New Log")')
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Select equipment (fridge)
    const equipmentSelect = page
      .locator('select[name="equipment_id"], select[name="equipment"]')
      .first();
    if ((await equipmentSelect.count()) > 0) {
      await equipmentSelect.selectOption({ index: 1 }); // Select first fridge
    }

    // Fill temperature
    await page.fill(
      'input[name="temperature_celsius"], input[type="number"][placeholder*="Temperature"]',
      '3.5',
    );

    // Fill location
    const locationInput = page.locator('input[name="location"]').first();
    if ((await locationInput.count()) > 0) {
      await locationInput.fill('Main Fridge');
    }

    // Submit form
    const submitButton = page
      .locator('button[type="submit"], button:has-text("Save"), button:has-text("Add Log")')
      .first();
    await submitButton.click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Verify log was created (check for success message or log in list)
    await expect(page.locator('text=3.5').or(page.locator('text=Success')).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('6. Chef Workflow - Equipment Maintenance Log', async ({ page }) => {
    await page.goto('/webapp/compliance');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
    visitedPages.add(page.url());

    // Navigate to Equipment Maintenance tab if it exists
    const maintenanceTab = page
      .locator('button:has-text("Equipment"), button:has-text("Maintenance")')
      .first();
    if ((await maintenanceTab.count()) > 0) {
      await maintenanceTab.click();
      await page.waitForTimeout(500);
      await collectPageErrors(page);
    }

    // Click "Add Maintenance" or "New Maintenance" button
    const addButton = page
      .locator(
        'button:has-text("Add Maintenance"), button:has-text("New Maintenance"), button:has-text("Add Record")',
      )
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Fill maintenance form
    await page.fill('input[name="equipment_name"]', `${TEST_PREFIX}_Fridge`);
    await page.selectOption('select[name="equipment_type"]', 'fridge');

    // Set maintenance date (today)
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[name="maintenance_date"][type="date"]', today);
    await page.selectOption('select[name="maintenance_type"]', 'scheduled');
    await page.fill('textarea[name="description"]', 'Test maintenance record');

    // Submit form
    const submitButton = page.locator('button[type="submit"], button:has-text("Save")').first();
    await submitButton.click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Verify maintenance was created
    await expect(
      page
        .locator('text=Success')
        .or(page.locator(`text=${TEST_PREFIX}_Fridge`))
        .first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test('7. Gremlin Crawler - Scan and Visit All Links', async ({ page }) => {
    const allLinks = new Set<string>();
    const baseUrl = page.url().split('/').slice(0, 3).join('/');
    const maxPagesToVisit = 50; // Limit to prevent infinite loops
    let pagesVisited = 0;

    // Start from dashboard
    await page.goto('/webapp');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Collect links from all visited pages
    for (const url of Array.from(visitedPages).slice(0, 10)) {
      // Limit initial pages to prevent too many links
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        await collectPageErrors(page);

        const links = await collectLinks(page);
        links.forEach(link => {
          // Only include links within our app
          if (link.startsWith(baseUrl) && !link.includes('#') && !link.includes('javascript:')) {
            allLinks.add(link);
          }
        });
      } catch (err) {
        // Page might not be accessible, continue
        continue;
      }
    }

    // Visit each unique link (up to maxPagesToVisit)
    for (const link of Array.from(allLinks).slice(0, maxPagesToVisit)) {
      if (pagesVisited >= maxPagesToVisit) break;
      if (visitedPages.has(link)) continue;

      try {
        await page.goto(link);
        await page.waitForLoadState('networkidle');
        visitedPages.add(link);
        pagesVisited++;

        // Collect errors after navigation
        await collectPageErrors(page);

        // Fuzz form inputs (but don't submit)
        await fuzzFormInputs(page);

        // Check for broken images
        const brokenImages = await checkBrokenImages(page);
        if (brokenImages.length > 0) {
          console.warn(`Broken images found on ${link}:`, brokenImages);
        }

        // Take screenshot on first visit
        const screenshotDir = 'test-results/screenshots';
        mkdirSync(screenshotDir, { recursive: true });
        const urlSlug = link.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
        const screenshotPath = `${screenshotDir}/${urlSlug}_${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        screenshots.push(screenshotPath);

        // Collect errors after interactions
        await collectPageErrors(page);

        // Small delay to prevent overwhelming the server
        await page.waitForTimeout(100);
      } catch (err) {
        // Link might not be accessible, continue
        console.warn(`Failed to visit ${link}:`, err);
        continue;
      }
    }

    console.log(
      `Gremlin crawler visited ${pagesVisited} pages and collected ${allLinks.size} total links`,
    );
  });

  test.afterAll(async ({ browser }) => {
    // Create a new page for cleanup since afterAll can't use page fixture
    let cleanupPage: Page | null = null;
    try {
      cleanupPage = await browser.newPage();

      // Setup error listener for cleanup page
      if (cleanupPage) {
        await setupGlobalErrorListener(cleanupPage);
        await collectPageErrors(cleanupPage);
      }
    } catch (err) {
      console.warn('Could not create cleanup page:', err);
    }

    // Generate QA Audit Report (before cleanup)
    const errors = getCollectedErrors();

    // Create test results summary
    testResults = {
      total: visitedPages.size,
      passed: visitedPages.size, // Assume all passed if no exceptions
      failed: 0,
      skipped: 0,
      duration: 0,
      tests: [],
    };

    // Create detailed report matching the required format
    const errorTableRows =
      errors.length > 0
        ? errors.map(err => {
            const errorType =
              err.type === 'network' ? `Network ${err.statusCode || 'N/A'}` : err.type;
            const message = err.message.substring(0, 100).replace(/\|/g, '\\|').replace(/\n/g, ' ');
            return `| ${err.url.substring(0, 80)} | ${errorType} | ${message} | ${err.timestamp} |`;
          })
        : ['| No errors found | - | - | - |'];

    // Create report matching the exact required format
    const detailedReport = [
      '# QA Audit Report',
      '',
      `**Generated:** ${new Date().toISOString()}`,
      `**Test Prefix:** ${TEST_PREFIX}`,
      '',
      '## Summary',
      '',
      `- **Total Pages Visited:** ${visitedPages.size}`,
      `- **Total Errors Found:** ${errors.length}`,
      '',
      '## Error Log',
      '',
      '| URL | Error Type (Console/Network) | Message | Timestamp |',
      '|-----|------------------------------|---------|-----------|',
      ...errorTableRows,
      '',
      '## Screenshots',
      '',
      ...(screenshots.length > 0
        ? screenshots.map(path => `- \`${path}\``)
        : ['- No screenshots taken']),
      '',
      '---',
      '',
      '*This report was automatically generated by the System Audit E2E test suite.*',
    ];

    writeFileSync(join(process.cwd(), 'QA_AUDIT_REPORT.md'), detailedReport.join('\n'), 'utf-8');
    console.log(`✅ QA Audit Report generated: QA_AUDIT_REPORT.md`);
    console.log(`   📊 Summary: ${visitedPages.size} pages visited, ${errors.length} errors found`);
    console.log(`   📸 Screenshots: ${screenshots.length} taken`);

    // Teardown: Clean up AUTO_TEST_ items
    if (cleanupPage) {
      try {
        // Clean up ingredients
        await cleanupPage.goto('/webapp/ingredients');
        await cleanupPage.waitForLoadState('networkidle');
        await deleteItemBySearch(cleanupPage, TEST_PREFIX, 'ingredient');

        // Clean up recipes
        await cleanupPage.goto('/webapp/recipes');
        await cleanupPage.waitForLoadState('networkidle');
        await deleteItemBySearch(cleanupPage, TEST_PREFIX, 'recipe');

        // Clean up menus
        await cleanupPage.goto('/webapp/menu-builder');
        await cleanupPage.waitForLoadState('networkidle');
        await deleteItemBySearch(cleanupPage, TEST_PREFIX, 'menu');
      } catch (err) {
        console.error('Error during teardown:', err);
      }

      // Close cleanup page
      if (cleanupPage) {
        try {
          await cleanupPage.close();
        } catch (err) {
          // Page might already be closed
        }
      }
    }
  });
});
