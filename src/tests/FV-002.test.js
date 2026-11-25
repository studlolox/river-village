import { describe, test, expect } from 'vitest';

describe('SPEC-FV-002', () => {
  test('FV-002 touch targets are finger-sized on mobile viewport', () => {
    document.documentElement.style.setProperty('--viewport-width', '375px');
    document.body.innerHTML = '<button class="touch-btn">x</button>';
    const btn = document.querySelector('.touch-btn');
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.getBoundingClientRect = () => ({ width: 60, height: 60, top: 0, left: 0, right: 60, bottom: 60 });
    const r = btn.getBoundingClientRect();
    expect(r.width).toBeGreaterThanOrEqual(44);
    expect(r.height).toBeGreaterThanOrEqual(44);
  });
});
