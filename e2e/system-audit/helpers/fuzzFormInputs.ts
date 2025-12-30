/**
 * Fuzz all form inputs on a page (without submitting).
 */
import { Page } from '@playwright/test';
import { generateRandomData } from './generateRandomData';

/**
 * Fuzz all form inputs on a page (without submitting).
 */
export async function fuzzFormInputs(page: Page): Promise<void> {
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



