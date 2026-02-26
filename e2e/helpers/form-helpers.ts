import { Page } from '@playwright/test';

/**
 * Fill ingredient form with test data
 * Handles multi-step wizard (4 steps)
 */
export async function fillIngredientForm(
  page: Page,
  data: {
    name: string;
    packSize: string;
    packSizeUnit: string;
    packPrice: string;
    category?: string;
    supplier?: string;
    storageLocation?: string;
  },
): Promise<void> {
  // Wait for wizard to appear (look for step 1 name field)
  const nameInputCheck = page.locator('input[placeholder*="Fresh Tomatoes"]').first();
  const wizardVisible = await nameInputCheck.isVisible({ timeout: 8000 }).catch(() => false);
  if (!wizardVisible) {
    throw new Error('[fillIngredientForm] Ingredient wizard step 1 not visible after 8s');
  }
  await page.waitForTimeout(500); // Let wizard fully render

  // Step 1: Fill basic info (Ingredient Name, Brand, Pack Size, Pack Unit, Pack Price)
  const nameInput = page.locator('input[placeholder*="Fresh Tomatoes"]').first();
  await nameInput.waitFor({ state: 'visible', timeout: 5000 });
  await nameInput.fill(data.name);
  await page.waitForTimeout(300);

  // Fill pack size (placeholder: "e.g., 5")
  const packSizeInput = page.locator('input[placeholder*="e.g., 5"]').first();
  await packSizeInput.waitFor({ state: 'visible', timeout: 5000 });
  await packSizeInput.fill(data.packSize);
  await page.waitForTimeout(300);

  // Select pack size unit - find select that's near the pack size input
  // The select should be after the pack size input in the form
  const packSizeUnitSelect = page.locator('label:has-text("Pack Unit") + select, select').nth(1);
  await packSizeUnitSelect.waitFor({ state: 'visible', timeout: 5000 });
  await packSizeUnitSelect.selectOption(data.packSizeUnit);
  await page.waitForTimeout(300);

  // Fill pack price (placeholder: "e.g., 12.99 or 1,234.56")
  const packPriceInput = page.locator('input[placeholder*="12.99"]').first();
  await packPriceInput.waitFor({ state: 'visible', timeout: 5000 });
  await packPriceInput.fill(data.packPrice);
  await page.waitForTimeout(1000); // Wait for cost calculations

  // Click "Next →" to go to step 2
  const nextButton = page.locator('button:has-text("Next →")').first();
  await nextButton.waitFor({ state: 'visible', timeout: 5000 });
  await nextButton.click();
  await page.waitForTimeout(1000);

  // Step 2: Fill supplier and storage (optional)
  if (data.supplier) {
    // Supplier is a combobox - type to search
    const supplierInput = page.locator('input[placeholder*="Search suppliers"]').first();
    if (await supplierInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await supplierInput.fill(data.supplier);
      await page.waitForTimeout(1000);
      // Try to select first option if dropdown appears
      const supplierOption = page.locator('[role="option"]').first();
      if (await supplierOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await supplierOption.click();
      }
    }
  }

  if (data.storageLocation) {
    const storageInput = page.locator('input[placeholder*="Search equipment"]').first();
    if (await storageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await storageInput.fill(data.storageLocation);
      await page.waitForTimeout(1000);
      const storageOption = page.locator('[role="option"]').first();
      if (await storageOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await storageOption.click();
      }
    }
  }

  // Click "Next →" to go to step 3 (or skip step 2)
  const nextButton2 = page
    .locator('button:has-text("Next →"), button:has-text("Skip Step")')
    .first();
  if (await nextButton2.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nextButton2.click();
    await page.waitForTimeout(1000);
  }

  // Step 3: Usually category/allergens - can skip or fill if needed
  const nextButton3 = page.locator('button:has-text("Next →")').first();
  if (await nextButton3.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nextButton3.click();
    await page.waitForTimeout(1000);
  }

  // Step 4: Review/Summary - should show "Save Ingredient" button
  // We'll let the test handle clicking the save button
}

/**
 * Fill recipe form with test data
 */
export async function fillRecipeForm(
  page: Page,
  data: {
    name: string;
    yield?: number;
    instructions?: string;
  },
): Promise<void> {
  const nameInput = page.locator('input[placeholder*="recipe"], input[name="recipe_name"]').first();
  await nameInput.fill(data.name);

  if (data.yield !== undefined) {
    const yieldInput = page.locator('input[name="yield"]').first();
    await yieldInput.fill(String(data.yield));
  }

  if (data.instructions) {
    const instructionsTextarea = page.locator('textarea[name="instructions"]').first();
    await instructionsTextarea.fill(data.instructions);
  }
}

/**
 * Fill temperature log form with test data
 */
export async function fillTemperatureLogForm(
  page: Page,
  data: {
    date: string;
    time: string;
    temperature: string;
    equipmentId?: string;
    temperatureType?: string;
    location?: string;
    notes?: string;
  },
): Promise<void> {
  const FIELD_TIMEOUT = 15000;

  // Fill date
  const dateInput = page.locator('input[type="date"][name*="date"]').first();
  await dateInput.waitFor({ state: 'visible', timeout: FIELD_TIMEOUT });
  await dateInput.fill(data.date, { timeout: FIELD_TIMEOUT });

  // Fill time
  const timeInput = page.locator('input[type="time"][name*="time"]').first();
  if (await timeInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await timeInput.fill(data.time, { timeout: FIELD_TIMEOUT });
  }

  // Fill temperature
  const tempInput = page.locator('input[name*="temperature"], input[type="number"]').first();
  if (await tempInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await tempInput.fill(data.temperature, { timeout: FIELD_TIMEOUT });
  }

  // Select equipment or temperature type
  if (data.equipmentId) {
    const equipmentSelect = page.locator('select[name*="equipment"]').first();
    if (await equipmentSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await equipmentSelect.selectOption(data.equipmentId);
    }
  } else if (data.temperatureType) {
    const typeSelect = page.locator('select[name*="temperature_type"]').first();
    if (await typeSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await typeSelect.selectOption(data.temperatureType);
    }
  }

  // Fill location if provided
  if (data.location) {
    const locationInput = page.locator('input[name*="location"]').first();
    if (await locationInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await locationInput.fill(data.location, { timeout: FIELD_TIMEOUT });
    }
  }

  // Fill notes if provided
  if (data.notes) {
    const notesTextarea = page.locator('textarea[name*="notes"]').first();
    if (await notesTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await notesTextarea.fill(data.notes, { timeout: FIELD_TIMEOUT });
    }
  }
}

/**
 * Fill equipment maintenance form with test data
 */
export async function fillEquipmentMaintenanceForm(
  page: Page,
  data: {
    equipmentName: string;
    equipmentType?: string;
    maintenanceDate: string;
    maintenanceType: string;
    description: string;
    serviceProvider?: string;
    cost?: string;
    nextMaintenanceDate?: string;
    isCritical?: boolean;
    performedBy?: string;
    notes?: string;
  },
): Promise<void> {
  // Fill equipment name - form uses controlled inputs without name attrs, use placeholder
  const nameInput = page
    .locator('input[placeholder*="Main Fridge"], input[placeholder*="equipment"]')
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nameInput.fill(data.equipmentName);
  }

  // Select equipment type if provided (select elements without name, first select in form)
  if (data.equipmentType) {
    const typeSelect = page
      .locator('select')
      .filter({ hasText: /fridge|freezer|oven|type/i })
      .first();
    if (await typeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await typeSelect.selectOption(data.equipmentType).catch(() => {});
    }
  }

  // Fill maintenance date (first date input in the form)
  const dateInputs = page.locator('input[type="date"]');
  if ((await dateInputs.count()) > 0) {
    await dateInputs
      .first()
      .fill(data.maintenanceDate)
      .catch(() => {});
  }

  // Select maintenance type (second select in form)
  const maintenanceTypeSelect = page
    .locator('select')
    .filter({ hasText: /scheduled|preventive|corrective|type/i })
    .first();
  if (await maintenanceTypeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await maintenanceTypeSelect.selectOption(data.maintenanceType).catch(() => {});
  }

  // Fill service provider if provided
  if (data.serviceProvider) {
    const providerInput = page
      .locator('input[placeholder*="ABC Maintenance"], input[placeholder*="provider"]')
      .first();
    if (await providerInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await providerInput.fill(data.serviceProvider);
    }
  }

  // Fill cost
  if (data.cost) {
    const costInput = page
      .locator('input[placeholder*="150.00"], input[placeholder*="cost"]')
      .first();
    if (await costInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await costInput.fill(data.cost);
    }
  }

  // Fill description (textarea)
  const descriptionTextarea = page
    .locator('textarea[placeholder*="maintenance work"], textarea[placeholder*="description"]')
    .first();
  if (await descriptionTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await descriptionTextarea.fill(data.description);
  }

  // Fill notes
  if (data.notes) {
    const notesTextarea = page
      .locator('textarea[placeholder*="Additional notes"], textarea[placeholder*="notes"]')
      .first();
    if (await notesTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
      await notesTextarea.fill(data.notes);
    }
  }
}

/**
 * Wait for form submission to complete
 */
export async function waitForFormSubmission(page: Page, timeout: number = 10000): Promise<boolean> {
  try {
    // Wait for success message or form to disappear
    await Promise.race([
      page.waitForSelector('text=/success/i', { timeout }).catch(() => null),
      page.waitForSelector('text=/saved/i', { timeout }).catch(() => null),
      page.waitForSelector('text=/created/i', { timeout }).catch(() => null),
      // Form might close (modal disappears)
      page.waitForSelector('form', { state: 'hidden', timeout }).catch(() => null),
    ]);
    return true;
  } catch {
    return false;
  }
}
