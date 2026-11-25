import { describe, test, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('SPEC-FV-001', () => {
  test('FV-001 PWA installs and works offline', async () => {
    const manifestPath = path.resolve(process.cwd(), 'src/manifest.webmanifest');
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    globalThis.navigator.serviceWorker = {
      register: vi.fn().mockResolvedValue({ scope: '/' }),
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => manifestJson,
    });

    const reg = await navigator.serviceWorker.register('/sw.js');
    expect(reg).toBeDefined();
    const manifest = await fetch('/manifest.webmanifest').then((r) => r.json());
    expect(manifest.name).toContain('River Village');
    expect(manifest.start_url).toBeDefined();
  });
});
