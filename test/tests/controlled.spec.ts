import { expect, test } from '@playwright/test';
import { ANIMATION_DURATION } from './constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/controlled');
});

test.describe('Initial-snap', () => {
  test('should not close when clicked on overlay and only the open prop is passsed', async ({ page }) => {
    await expect(page.getByTestId('content')).not.toBeVisible();
    await page.getByTestId('trigger').click();
    await expect(page.getByTestId('content')).toBeVisible();
    // Click on the background
    await page.mouse.click(0, 0);

    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('content')).toBeVisible();
  });

  test('should close when clicked on overlay and open and onOpenChange props are passed', async ({ page }) => {
    await expect(page.getByTestId('fully-controlled-content')).not.toBeVisible();
    await page.getByTestId('fully-controlled-trigger').click();
    await expect(page.getByTestId('fully-controlled-content')).toBeVisible();
    // Click on the background
    await page.mouse.click(0, 0);

    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('fully-controlled-content')).not.toBeVisible();
  });
});
