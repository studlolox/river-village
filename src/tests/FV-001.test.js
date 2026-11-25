import { test, expect } from '@playwright/test';

test('FV-001 PWA installs and works offline', async ({ page, context }) => {
  await page.goto('/');
  const swReady = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    return Boolean(reg);
  });
  expect(swReady).toBe(true);

  const manifest = await page.evaluate(async () => {
    const res = await fetch('/manifest.webmanifest');
    return res.json();
  });
  expect(manifest.name).toContain('River Village');
  expect(manifest.start_url).toBeDefined();

  // Verify offline reload works via Service Worker cache
  await context.setOffline(true);
  await page.reload();
  const title = await page.title();
  expect(title).toBe('River Village');
});
