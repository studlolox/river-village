/**
 * Particle system for watering, harvesting, fishing, and spell actions.
 */
export class ParticleSystem {
  constructor() {
    this.activeParticles = [];
  }

  spawnWatering(pos) {
    this.activeParticles.push({ type: 'water', x: pos.x, y: pos.y, ttl: 0.6 });
  }

  spawnHarvest(pos) {
    this.activeParticles.push({ type: 'harvest', x: pos.x, y: pos.y, ttl: 0.7 });
  }

  spawnFishing(pos) {
    this.activeParticles.push({ type: 'splash', x: pos.x, y: pos.y, ttl: 0.8 });
  }

  spawnSpell(pos) {
    this.activeParticles.push({ type: 'sparkle', x: pos.x, y: pos.y, ttl: 0.9 });
  }

  update(dt = 0.016) {
    this.activeParticles = this.activeParticles
      .map((p) => ({ ...p, ttl: p.ttl - dt }))
      .filter((p) => p.ttl > 0);
  }
}
