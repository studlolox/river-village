import * as THREE from 'three';

/**
 * Manages the three.js WebGLRenderer, isometric orthographic camera, and day/night lighting.
 */
export class IsometricScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#254230');

    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    const frustum = 9;
    this.camera = new THREE.OrthographicCamera(
      -frustum * aspect,
      frustum * aspect,
      frustum,
      -frustum,
      0.1,
      100
    );
    this.camera.position.set(14, 16, 14);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.sunLight = new THREE.DirectionalLight(0xfff4d6, 0.9);
    this.sunLight.position.set(10, 18, 8);
    this.scene.add(this.ambientLight, this.sunLight);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const w = window.innerWidth;
    const h = Math.max(1, window.innerHeight);
    const aspect = w / h;
    const frustum = 9;
    this.camera.left = -frustum * aspect;
    this.camera.right = frustum * aspect;
    this.camera.top = frustum;
    this.camera.bottom = -frustum;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  followPlayer(gridPos) {
    this.camera.position.set(gridPos.x + 10, 16, gridPos.y + 10);
    this.camera.lookAt(gridPos.x, 0, gridPos.y);
  }

  updateDaylight(factor) {
    this.ambientLight.intensity = 0.25 + 0.55 * factor;
    this.sunLight.intensity = 0.15 + 0.85 * factor;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
