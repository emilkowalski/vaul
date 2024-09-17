import { test, expect } from '@playwright/test';
import { ANIMATION_DURATION } from './constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/with-handle');
});

test.describe('With handle', () => {
  test('click should cycle to the next snap point', async ({ page }) => {
    await page.waitForTimeout(ANIMATION_DURATION);

    await expect(page.getByTestId('content')).toBeVisible();
    await expect(page.getByTestId('active-snap-index')).toHaveText('0');

    await page.getByTestId('handle').click();
    await expect(page.getByTestId('active-snap-index')).toHaveText('1');
  });
});
