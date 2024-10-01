import { test, expect } from '@playwright/test';
import { openDrawer } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/with-redirect');
});

test.describe('With redirect', () => {
  test('should restore body position settings', async ({ page }) => {
    await openDrawer(page);
    await page.getByTestId('link').click();

    await page.waitForURL('**/with-redirect/long-page');

    const content = page.getByTestId('content');

    // safe check
    await expect(content).toBeVisible();

    content.scrollIntoViewIfNeeded();

    await expect(page.getByTestId('content')).toBeInViewport();
  });
});
