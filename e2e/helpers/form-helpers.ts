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
  // Wait for wizard to appear (look for step 1 fields)
  await page.waitForSelector('input[placeholder*="Fresh Tomatoes"]', { timeout: 15000 });
  await page.waitForTimeout(1000); // Let wizard fully render

  // Step 1: Fill basic info (Ingredient Name, Brand, Pack Size, Pack Unit, Pack Price)
  const nameInput = page.locator('input[placeholder*="Fresh Tomatoes"]').first();
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
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
  // Fill date
  const dateInput = page.locator('input[type="date"][name*="date"]').first();
  await dateInput.fill(data.date);

  // Fill time
  const timeInput = page.locator('input[type="time"][name*="time"]').first();
  await timeInput.fill(data.time);

  // Fill temperature
  const tempInput = page.locator('input[name*="temperature"], input[type="number"]').first();
  await tempInput.fill(data.temperature);

  // Select equipment or temperature type
  if (data.equipmentId) {
    const equipmentSelect = page.locator('select[name*="equipment"]').first();
    await equipmentSelect.selectOption(data.equipmentId);
  } else if (data.temperatureType) {
    const typeSelect = page.locator('select[name*="temperature_type"]').first();
    await typeSelect.selectOption(data.temperatureType);
  }

  // Fill location if provided
  if (data.location) {
    const locationInput = page.locator('input[name*="location"]').first();
    await locationInput.fill(data.location);
  }

  // Fill notes if provided
  if (data.notes) {
    const notesTextarea = page.locator('textarea[name*="notes"]').first();
    await notesTextarea.fill(data.notes);
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
  // Fill equipment name
  const nameInput = page.locator('input[name*="equipment_name"]').first();
  await nameInput.fill(data.equipmentName);

  // Select equipment type if provided
  if (data.equipmentType) {
    const typeSelect = page.locator('select[name*="equipment_type"]').first();
    await typeSelect.selectOption(data.equipmentType);
  }

  // Fill maintenance date
  const dateInput = page.locator('input[type="date"][name*="maintenance_date"]').first();
  await dateInput.fill(data.maintenanceDate);

  // Select maintenance type
  const maintenanceTypeSelect = page.locator('select[name*="maintenance_type"]').first();
  await maintenanceTypeSelect.selectOption(data.maintenanceType);

  // Fill description
  const descriptionTextarea = page.locator('textarea[name*="description"]').first();
  await descriptionTextarea.fill(data.description);

  // Fill optional fields
  if (data.serviceProvider) {
    const providerInput = page.locator('input[name*="service_provider"]').first();
    await providerInput.fill(data.serviceProvider);
  }

  if (data.cost) {
    const costInput = page.locator('input[name*="cost"]').first();
    await costInput.fill(data.cost);
  }

  if (data.nextMaintenanceDate) {
    const nextDateInput = page.locator('input[type="date"][name*="next_maintenance_date"]').first();
    await nextDateInput.fill(data.nextMaintenanceDate);
  }

  if (data.isCritical !== undefined) {
    const criticalCheckbox = page.locator('input[type="checkbox"][name*="is_critical"]').first();
    if (data.isCritical) {
      await criticalCheckbox.check();
    } else {
      await criticalCheckbox.uncheck();
    }
  }

  if (data.performedBy) {
    const performedByInput = page.locator('input[name*="performed_by"]').first();
    await performedByInput.fill(data.performedBy);
  }

  if (data.notes) {
    const notesTextarea = page.locator('textarea[name*="notes"]').first();
    await notesTextarea.fill(data.notes);
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
