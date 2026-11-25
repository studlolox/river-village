import { describe, test, expect } from 'vitest';
import { ParticleSystem } from '../js/render/particles.js';

describe('SPEC-FV-132 Particle effects', () => {
  test('FV-132 watering spawns water particles', () => {
    const p = new ParticleSystem();
    p.spawnWatering({ x: 5, y: 5 });
    expect(p.activeParticles.some((pt) => pt.type === 'water')).toBe(true);
  });
});
