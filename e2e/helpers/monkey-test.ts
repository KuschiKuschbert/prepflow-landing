import { Page } from '@playwright/test';
import { captureErrorScreenshot } from '../fixtures/global-error-listener';

/**
 * Interactive element information
 */
export interface InteractiveElement {
  selector: string;
  type: 'button' | 'input' | 'textarea' | 'select' | 'link';
  isVisible: boolean;
  isEnabled: boolean;
}

/**
 * Monkey test result
 */
export interface MonkeyTestResult {
  elementsFound: number;
  elementsInteracted: number;
  errors: Array<{
    element: string;
    error: string;
    screenshot?: string;
  }>;
}

/**
 * Find all interactive elements on the page
 */
export async function findAllInteractiveElements(page: Page): Promise<InteractiveElement[]> {
  const elements: InteractiveElement[] = [];

  // Find buttons
  const buttons = await page.locator('button:not([disabled])').all();
  for (const button of buttons) {
    const isVisible = await button.isVisible().catch(() => false);
    if (isVisible) {
      elements.push({
        selector: await button.evaluate(el => {
          // Try to get a stable selector
          if (el.getAttribute('data-testid'))
            return `[data-testid="${el.getAttribute('data-testid')}"]`;
          if (el.id) return `#${el.id}`;
          if (el.className) return `.${el.className.split(' ')[0]}`;
          return 'button';
        }),
        type: 'button',
        isVisible: true,
        isEnabled: true,
      });
    }
  }

  // Find inputs
  const inputs = await page.locator('input:not([disabled]):not([type="hidden"])').all();
  for (const input of inputs) {
    const isVisible = await input.isVisible().catch(() => false);
    if (isVisible) {
      const _type = await input.getAttribute('type').catch(() => 'text');
      elements.push({
        selector: await input.evaluate(el => {
          if (el.getAttribute('data-testid'))
            return `[data-testid="${el.getAttribute('data-testid')}"]`;
          if (el.id) return `#${el.id}`;
          const inputEl = el as HTMLInputElement;
          if (inputEl.name) return `input[name="${inputEl.name}"]`;
          return 'input';
        }),
        type: 'input',
        isVisible: true,
        isEnabled: true,
      });
    }
  }

  // Find textareas
  const textareas = await page.locator('textarea:not([disabled])').all();
  for (const textarea of textareas) {
    const isVisible = await textarea.isVisible().catch(() => false);
    if (isVisible) {
      elements.push({
        selector: await textarea.evaluate(el => {
          if (el.getAttribute('data-testid'))
            return `[data-testid="${el.getAttribute('data-testid')}"]`;
          if (el.id) return `#${el.id}`;
          const textareaEl = el as HTMLTextAreaElement;
          if (textareaEl.name) return `textarea[name="${textareaEl.name}"]`;
          return 'textarea';
        }),
        type: 'textarea',
        isVisible: true,
        isEnabled: true,
      });
    }
  }

  // Find selects
  const selects = await page.locator('select:not([disabled])').all();
  for (const select of selects) {
    const isVisible = await select.isVisible().catch(() => false);
    if (isVisible) {
      elements.push({
        selector: await select.evaluate(el => {
          if (el.getAttribute('data-testid'))
            return `[data-testid="${el.getAttribute('data-testid')}"]`;
          if (el.id) return `#${el.id}`;
          const selectEl = el as HTMLSelectElement;
          if (selectEl.name) return `select[name="${selectEl.name}"]`;
          return 'select';
        }),
        type: 'select',
        isVisible: true,
        isEnabled: true,
      });
    }
  }

  // Find links (but be careful not to navigate away)
  const links = await page.locator('a[href]:not([aria-disabled="true"])').all();
  for (const link of links) {
    const isVisible = await link.isVisible().catch(() => false);
    const href = await link.getAttribute('href').catch(() => '');
    // Only include internal links to avoid navigating away
    if (isVisible && href && (href.startsWith('/') || href.startsWith('#'))) {
      elements.push({
        selector: await link.evaluate(el => {
          if (el.getAttribute('data-testid'))
            return `[data-testid="${el.getAttribute('data-testid')}"]`;
          if (el.id) return `#${el.id}`;
          return `a[href="${el.getAttribute('href')}"]`;
        }),
        type: 'link',
        isVisible: true,
        isEnabled: true,
      });
    }
  }

  return elements;
}

/**
 * Interact with a single element
 */
export async function interactWithElement(
  page: Page,
  element: InteractiveElement,
  index: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const locator = page.locator(element.selector).first();

    // Wait for element to be stable
    await locator.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {
      // Element might not be visible, skip it
      return { success: false, error: 'Element not visible' };
    });

    switch (element.type) {
      case 'button':
        // Click button
        await locator.click({ timeout: 2000 }).catch(() => {
          // Might be covered by another element, try force click
          return locator.click({ force: true, timeout: 2000 });
        });
        // Wait a bit for any modals/dialogs to appear
        await page.waitForTimeout(500);
        break;

      case 'input':
        // Fill input with random data
        const inputType = await locator.getAttribute('type').catch(() => 'text');
        if (inputType === 'number') {
          await locator.fill(String(Math.floor(Math.random() * 1000)));
        } else if (inputType === 'email') {
          await locator.fill(`test${index}@example.com`);
        } else if (inputType === 'date') {
          const date = new Date();
          date.setDate(date.getDate() + Math.floor(Math.random() * 30));
          await locator.fill(date.toISOString().split('T')[0]);
        } else {
          await locator.fill(`Test Input ${index}`);
        }
        break;

      case 'textarea':
        // Fill textarea with random text
        await locator.fill(
          `Test textarea content ${index}. This is a test input for monkey testing.`,
        );
        break;

      case 'select':
        // Select a random option
        const options = await locator.locator('option').all();
        if (options.length > 1) {
          // Skip first option (usually "Select...")
          const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
          await locator.selectOption({ index: randomIndex });
        }
        break;

      case 'link':
        // For links, we'll just hover to avoid navigation
        await locator.hover({ timeout: 1000 }).catch(() => {
          // Link might not be hoverable, that's okay
        });
        break;
    }

    // Wait for any animations/transitions to complete
    await page.waitForTimeout(300);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err.message || String(error),
    };
  }
}

/**
 * Run monkey test on a page
 * Finds all interactive elements and attempts to interact with them
 */
export async function runMonkeyTest(
  page: Page,
  maxInteractions: number = 20,
): Promise<MonkeyTestResult> {
  const result: MonkeyTestResult = {
    elementsFound: 0,
    elementsInteracted: 0,
    errors: [],
  };

  try {
    // Find all interactive elements
    const elements = await findAllInteractiveElements(page);
    result.elementsFound = elements.length;

    if (elements.length === 0) {
      return result;
    }

    // Randomly select up to maxInteractions elements
    const shuffled = [...elements].sort(() => Math.random() - 0.5);
    const elementsToInteract = shuffled.slice(0, Math.min(maxInteractions, elements.length));

    // Interact with each element
    for (let i = 0; i < elementsToInteract.length; i++) {
      const element = elementsToInteract[i];
      const interactionResult = await interactWithElement(page, element, i);

      if (interactionResult.success) {
        result.elementsInteracted++;
      } else {
        // Capture screenshot for error
        let screenshot: string | undefined;
        try {
          screenshot = await captureErrorScreenshot(page, {
            type: 'console.error',
            url: page.url(),
            message: `Monkey test interaction failed: ${interactionResult.error}`,
            timestamp: new Date().toISOString(),
          });
        } catch (_screenshotError) {
          // Screenshot failed, continue without it
        }

        result.errors.push({
          element: element.selector,
          error: interactionResult.error || 'Unknown error',
          screenshot,
        });
      }

      // Small delay between interactions
      await page.waitForTimeout(100);
    }
  } catch (error: unknown) {
    const err = error as Error;
    result.errors.push({
      element: 'page',
      error: err.message || String(error),
    });
  }

  return result;
}
