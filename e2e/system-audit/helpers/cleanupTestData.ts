/**
 * Cleanup test data after tests.
 */
import { Page } from '@playwright/test';
import { deleteItemBySearch } from './deleteItemBySearch';

/**
 * Cleanup test data after tests.
 */
export async function cleanupTestData(cleanupPage: Page, TEST_PREFIX: string): Promise<void> {
  try {
    await cleanupPage.goto('/webapp/ingredients');
    await cleanupPage.waitForLoadState('networkidle');
    await deleteItemBySearch(cleanupPage, TEST_PREFIX, 'ingredient');

    await cleanupPage.goto('/webapp/recipes');
    await cleanupPage.waitForLoadState('networkidle');
    await deleteItemBySearch(cleanupPage, TEST_PREFIX, 'recipe');

    await cleanupPage.goto('/webapp/menu-builder');
    await cleanupPage.waitForLoadState('networkidle');
    await deleteItemBySearch(cleanupPage, TEST_PREFIX, 'menu');
  } catch (err) {
    console.error('Error during teardown:', err);
  }
}
