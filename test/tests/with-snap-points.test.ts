// import { test, expect } from '@playwright/test';
// import { ANIMATION_DURATION } from './constants';
// import { openDrawer } from './helpers';

// test.beforeEach(async ({ page }) => {
//   await page.goto('/with-snap-points');
// });

// test.describe.only('Base tests', () => {
//   test('should change active snap point', async ({ page }) => {
//     await openDrawer(page);
//     await page.hover('[vaul-drawer]');
//     await page.mouse.down();
//     await page.mouse.move(0, -800);
//     await page.mouse.up();
//     const activeSnap = await page.getByTestId('active-snap-index').innerText();
//     await page.waitForTimeout(ANIMATION_DURATION);
//     expect(activeSnap).toBe('2');
//   });
// });
