import * as THREE from 'three';

const PARTICLE_COLORS = {
  water: '#5bc0eb',
  dirt: '#8d5b32',
  harvest: '#f0c954'
};

/**
 * Lightweight pooled particle system (also works headlessly in Node tests).
 */
export class ParticleSystem {
  constructor(scene = null) {
    this.scene = scene;
    this.activeParticles = [];
    this._geo = scene ? new THREE.BoxGeometry(0.1, 0.1, 0.1) : null;
  }

  spawnBurst(type, pos, count = 6) {
    const color = PARTICLE_COLORS[type] || '#ffffff';
    for (let i = 0; i < count; i++) {
      let mesh = null;
      if (this.scene && this._geo) {
        const mat = new THREE.MeshBasicMaterial({ color });
        mesh = new THREE.Mesh(this._geo, mat);
        mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.4,
          0.25 + Math.random() * 0.2,
          pos.y + (Math.random() - 0.5) * 0.4
        );
        this.scene.add(mesh);
      }
      this.activeParticles.push({
        type,
        x: pos.x,
        y: pos.y,
        life: 0.45,
        vy: 1.2 + Math.random() * 0.8,
        mesh
      });
    }
  }

  spawnWatering(pos) {
    this.spawnBurst('water', pos, 6);
  }

  spawnDirt(pos) {
    this.spawnBurst('dirt', pos, 5);
  }

  spawnHarvest(pos) {
    this.spawnBurst('harvest', pos, 8);
  }

  update(dt) {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life -= dt;
      if (p.mesh) {
        p.mesh.position.y += p.vy * dt;
        p.vy -= 3.5 * dt;
      }
      if (p.life <= 0) {
        if (p.mesh && this.scene) {
          this.scene.remove(p.mesh);
          p.mesh.material.dispose();
        }
        this.activeParticles.splice(i, 1);
      }
    }
  }
}
