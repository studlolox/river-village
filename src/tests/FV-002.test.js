import { test, expect } from '@playwright/test';

test('FV-002 touch targets are finger-sized on mobile portrait and landscape viewports', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  // Portrait 375x812
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  // Start game to inspect HUD touch targets
  await page.click('#btn-start-game');

  const portraitSizes = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.hud-top button, .hud-bottom button'));
    return btns
      .filter((b) => !b.hidden && b.offsetParent !== null)
      .map((b) => {
        const r = b.getBoundingClientRect();
        return { id: b.id || b.textContent, width: r.width, height: r.height };
      });
  });
  expect(portraitSizes.length).toBeGreaterThan(0);
  for (const s of portraitSizes) {
    expect(s.width).toBeGreaterThanOrEqual(44);
    expect(s.height).toBeGreaterThanOrEqual(44);
  }

  // Landscape 812x375
  await page.setViewportSize({ width: 812, height: 375 });
  const landscapeSizes = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.hud-top button, .hud-bottom button'));
    return btns
      .filter((b) => !b.hidden && b.offsetParent !== null)
      .map((b) => {
        const r = b.getBoundingClientRect();
        return { id: b.id || b.textContent, width: r.width, height: r.height };
      });
  });
  for (const s of landscapeSizes) {
    expect(s.width).toBeGreaterThanOrEqual(44);
    expect(s.height).toBeGreaterThanOrEqual(44);
  }

  // Verify draw calls < 50
  const drawCalls = await page.evaluate(() => window.__riverVillage.scene.getDrawCalls());
  expect(drawCalls).toBeLessThan(50);
  expect(errors).toEqual([]);
});
