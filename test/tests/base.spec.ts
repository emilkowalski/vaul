import { test, expect } from '@playwright/test';
import { ANIMATION_DURATION } from './constants';
import { openDrawer } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/without-scaled-background');
});

test.describe('Base tests', () => {
  test('should open drawer', async ({ page }) => {
    await expect(page.getByTestId('content')).not.toBeVisible();

    await page.getByTestId('trigger').click();

    await expect(page.getByTestId('content')).toBeVisible();
  });

  test('should close on background interaction', async ({ page }) => {
    await openDrawer(page);
    // Click on the background
    await page.mouse.click(0, 0);

    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('content')).not.toBeVisible();
  });

  test('should close when `Drawer.Close` is clicked', async ({ page }) => {
    await openDrawer(page);

    await page.getByTestId('drawer-close').click();
    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('content')).not.toBeVisible();
  });

  test('should close when controlled', async ({ page }) => {
    await openDrawer(page);

    await page.getByTestId('controlled-close').click();
    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('content')).not.toBeVisible();
  });

  test('should be open by defafult when `defaultOpen` is true', async ({ page }) => {
    await page.goto('/default-open');

    await expect(page.getByTestId('content')).toBeVisible();
  });

  test('should close when dragged down', async ({ page }) => {
    await openDrawer(page);
    await page.hover('[data-vaul-drawer]');
    await page.mouse.down();
    await page.mouse.move(0, 800);
    await page.mouse.up();
    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('content')).not.toBeVisible();
  });

  test('should not close when dragged up', async ({ page }) => {
    await openDrawer(page);
    await page.hover('[data-vaul-drawer]');
    await page.mouse.down();
    await page.mouse.move(0, -800);
    await page.mouse.up();
    await page.waitForTimeout(ANIMATION_DURATION);
    await expect(page.getByTestId('content')).toBeVisible();
  });
});
