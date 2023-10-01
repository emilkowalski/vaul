import { expect, Page } from '@playwright/test';
import { ANIMATION_DURATION } from './constants';

export async function openDrawer(page: Page) {
  await expect(page.getByTestId('content')).not.toBeVisible();
  await page.getByTestId('trigger').click();
  await page.waitForTimeout(ANIMATION_DURATION);
  await expect(page.getByTestId('content')).toBeVisible();
}
