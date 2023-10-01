import { expect, Page } from '@playwright/test';
import { ANIMATION_DURATION } from './constants';

export async function openDrawer(page: Page) {
  await expect(page.getByTestId('content')).not.toBeVisible();
  await page.getByTestId('trigger').click();
  await page.waitForTimeout(ANIMATION_DURATION);
  await expect(page.getByTestId('content')).toBeVisible();
}

export async function dragWithSpeed(
  page: Page,
  selector: string,
  startY: number,
  endY: number,
  speed: number = 10,
): Promise<void> {
  const startX = 0;
  const distance = Math.abs(endY - startY);
  const steps = distance / speed;
  const delayPerStep = 10; // in milliseconds
  const yOffset = (endY - startY) / steps;

  await page.hover(selector);
  await page.mouse.down();
  await page.mouse.move(0, -200);
  await page.mouse.up();
}
