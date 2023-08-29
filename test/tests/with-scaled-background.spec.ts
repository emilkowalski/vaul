import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/with-scaled-background');
});

test.describe('With scaled background', () => {
  test('should scale background', async ({ page }) => {
    await expect(page.locator('[vaul-drawer-wrapper]')).not.toHaveCSS('transform', '');

    await page.getByTestId('trigger').click();

    await expect(page.locator('[vaul-drawer-wrapper]')).toHaveCSS('transform', /matrix/);
  });
  test('should open drawer', async ({ page }) => {
    await expect(page.getByTestId('content')).not.toBeVisible();

    await page.getByTestId('trigger').click();

    await expect(page.getByTestId('content')).toBeVisible();
  });
});
