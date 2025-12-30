/**
 * Delete an item by searching for it and clicking delete.
 */
import { Page } from '@playwright/test';

/**
 * Delete an item by searching for it and clicking delete.
 */
export async function deleteItemBySearch(
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
