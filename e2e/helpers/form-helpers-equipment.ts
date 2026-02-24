import type { Page } from '@playwright/test';

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
  const nameInput = page.locator('input[name*="equipment_name"]').first();
  await nameInput.fill(data.equipmentName);
  if (data.equipmentType) {
    const typeSelect = page.locator('select[name*="equipment_type"]').first();
    await typeSelect.selectOption(data.equipmentType);
  }
  const dateInput = page.locator('input[type="date"][name*="maintenance_date"]').first();
  await dateInput.fill(data.maintenanceDate);
  const maintenanceTypeSelect = page.locator('select[name*="maintenance_type"]').first();
  await maintenanceTypeSelect.selectOption(data.maintenanceType);
  const descriptionTextarea = page.locator('textarea[name*="description"]').first();
  await descriptionTextarea.fill(data.description);
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
