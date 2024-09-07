import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/without-scaled-background');
});

test.describe('Without scaled background', () => {
  test('should not scale background', async ({ page }) => {
    await expect(page.locator('[data-vaul-drawer-wrapper]')).not.toHaveCSS('transform', '');

    await page.getByTestId('trigger').click();

    await expect(page.locator('[data-vaul-drawer-wrapper]')).not.toHaveCSS('transform', '');
  });
});
