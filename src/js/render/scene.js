import * as THREE from 'three';
import { TileRenderer } from './tile-renderer.js';
import { ParticleSystem } from './particles.js';

/**
 * 2.5D OrthographicCamera scene with DPR cap, <50 draw calls, and zero per-frame allocations.
 */
export class GameScene {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.applyQualityMode(game.settings.getQualityMode());

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#203b2c');

    this.frustumSize = 11;
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    this._cameraOffset = new THREE.Vector3(0, 12, 10);
    this._lookTarget = new THREE.Vector3();
    this._desiredCamPos = new THREE.Vector3();

    this.ambientLight = new THREE.AmbientLight('#ffffff', 0.72);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight('#fff5dc', 0.85);
    this.sunLight.position.set(10, 18, 8);
    this.scene.add(this.sunLight);

    this.tileRenderer = new TileRenderer(this.scene, game.holding.map);
    this.particles = new ParticleSystem(this.scene);
    this.playerMesh = this._createPlayerMesh(game.player.appearance);
    this.scene.add(this.playerMesh);

    this._playerTargetPos = new THREE.Vector3(game.player.gridPos.x, 0.45, game.player.gridPos.y);
    this.playerMesh.position.copy(this._playerTargetPos);

    this.resize(window.innerWidth, window.innerHeight);
  }

  _createPlayerMesh(appearance) {
    const group = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.55, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: appearance.shirtColor || '#3b7a57' });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const headGeo = new THREE.SphereGeometry(0.22, 10, 8);
    const headMat = new THREE.MeshLambertMaterial({ color: appearance.skinTone || '#f0c8a0' });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.42;
    group.add(head);

    return group;
  }

  refreshTiles() {
    this.tileRenderer.refreshTiles();
  }

  applyQualityMode(mode) {
    const cap = mode === 'battery' ? 1 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
  }

  resize(width, height) {
    const aspect = Math.max(0.1, width / Math.max(1, height));
    const halfH = this.frustumSize / 2;
    const halfW = halfH * aspect;
    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  screenToTile(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    const origin = this._lookTarget.set(ndcX, ndcY, 0).unproject(this.camera);
    const dir = this._desiredCamPos.set(0, 0, -1).transformDirection(this.camera.matrixWorld);
    if (Math.abs(dir.y) < 1e-4) return null;
    const t = -origin.y / dir.y;
    const wx = Math.round(origin.x + dir.x * t);
    const wz = Math.round(origin.z + dir.z * t);
    if (!this.game.holding.map.inBounds(wx, wz)) return null;
    return { x: wx, y: wz };
  }

  update(dt) {
    const gx = this.game.player.gridPos.x;
    const gz = this.game.player.gridPos.y;
    this._playerTargetPos.set(gx, 0.45, gz);
    this.playerMesh.position.lerp(this._playerTargetPos, Math.min(1, dt * 14));

    this._lookTarget.set(this.playerMesh.position.x, 0, this.playerMesh.position.z);
    this._desiredCamPos.copy(this._lookTarget).add(this._cameraOffset);
    this.camera.position.lerp(this._desiredCamPos, Math.min(1, dt * 8));
    this.camera.lookAt(this._lookTarget);

    const facing = this.game.player.facing;
    let rx = gx;
    let rz = gz;
    if (facing.includes('up')) rz -= 1;
    if (facing.includes('down')) rz += 1;
    if (facing.includes('left')) rx -= 1;
    if (facing.includes('right')) rx += 1;
    this.tileRenderer.setReticle(rx, rz);

    const sun = this.game.timeOfDay.sunFactor();
    this.ambientLight.intensity = 0.35 + sun * 0.45;
    this.sunLight.intensity = 0.2 + sun * 0.75;

    this.particles.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

  getDrawCalls() {
    return this.renderer.info.render.calls;
  }

  dispose() {
    this.renderer.dispose();
  }
}
