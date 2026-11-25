import * as THREE from 'three';

const TILE_COLORS = {
  grass: new THREE.Color('#5a9e56'),
  tillable: new THREE.Color('#b4885a'),
  tilled: new THREE.Color('#7c5230'),
  water: new THREE.Color('#3f8fb8'),
  house: new THREE.Color('#9f6a46')
};

/**
 * Renders the holding map using InstancedMesh batches (< 10 draw calls total).
 */
export class TileRenderer {
  constructor(scene, holdingMap) {
    this.scene = scene;
    this.map = holdingMap;
    this._dummy = new THREE.Object3D();
    this._color = new THREE.Color();

    this.groundMesh = null;
    this.trunkMesh = null;
    this.canopyMesh = null;
    this.rockMesh = null;
    this.houseMesh = null;
    this.reticleMesh = null;

    this._buildMeshes();
  }

  _buildMeshes() {
    const count = this.map.width * this.map.height;
    const groundGeo = new THREE.BoxGeometry(0.98, 0.2, 0.98);
    const groundMat = new THREE.MeshLambertMaterial({ color: '#ffffff' });
    this.groundMesh = new THREE.InstancedMesh(groundGeo, groundMat, count);
    this.groundMesh.receiveShadow = true;

    let treeCount = 0;
    let rockCount = 0;

    for (let i = 0; i < this.map.tiles.length; i++) {
      const tile = this.map.tiles[i];
      this._dummy.position.set(tile.x, -0.1, tile.y);
      this._dummy.scale.set(1, 1, 1);
      this._dummy.updateMatrix();
      this.groundMesh.setMatrixAt(i, this._dummy.matrix);

      const baseColor = TILE_COLORS[tile.kind] || TILE_COLORS.grass;
      this._color.copy(baseColor);
      if ((tile.x + tile.y) % 2 === 0) {
        this._color.offsetHSL(0, 0, -0.02);
      }
      this.groundMesh.setColorAt(i, this._color);

      if (tile.object === 'tree') treeCount++;
      if (tile.object === 'rock') rockCount++;
    }
    this.groundMesh.instanceMatrix.needsUpdate = true;
    if (this.groundMesh.instanceColor) this.groundMesh.instanceColor.needsUpdate = true;
    this.scene.add(this.groundMesh);

    if (treeCount > 0) {
      const trunkGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.6, 6);
      const trunkMat = new THREE.MeshLambertMaterial({ color: '#6b4628' });
      this.trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);

      const canopyGeo = new THREE.ConeGeometry(0.45, 0.95, 7);
      const canopyMat = new THREE.MeshLambertMaterial({ color: '#2f6e3c' });
      this.canopyMesh = new THREE.InstancedMesh(canopyGeo, canopyMat, treeCount);

      let idx = 0;
      for (const tile of this.map.tiles) {
        if (tile.object !== 'tree') continue;
        this._dummy.position.set(tile.x, 0.3, tile.y);
        this._dummy.scale.set(1, 1, 1);
        this._dummy.updateMatrix();
        this.trunkMesh.setMatrixAt(idx, this._dummy.matrix);

        this._dummy.position.set(tile.x, 0.95, tile.y);
        this._dummy.updateMatrix();
        this.canopyMesh.setMatrixAt(idx, this._dummy.matrix);
        idx++;
      }
      this.scene.add(this.trunkMesh);
      this.scene.add(this.canopyMesh);
    }

    if (rockCount > 0) {
      const rockGeo = new THREE.DodecahedronGeometry(0.32, 0);
      const rockMat = new THREE.MeshLambertMaterial({ color: '#7b8288' });
      this.rockMesh = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
      let idx = 0;
      for (const tile of this.map.tiles) {
        if (tile.object !== 'rock') continue;
        this._dummy.position.set(tile.x, 0.18, tile.y);
        this._dummy.scale.set(1, 0.75, 1);
        this._dummy.updateMatrix();
        this.rockMesh.setMatrixAt(idx, this._dummy.matrix);
        idx++;
      }
      this.scene.add(this.rockMesh);
    }

    // Farmhouse low-poly mesh
    const houseGeo = new THREE.BoxGeometry(2.6, 1.3, 1.8);
    const houseMat = new THREE.MeshLambertMaterial({ color: '#d8b48a' });
    this.houseMesh = new THREE.Mesh(houseGeo, houseMat);
    this.houseMesh.position.set(3, 0.65, 2.5);
    this.scene.add(this.houseMesh);

    const roofGeo = new THREE.ConeGeometry(2.1, 0.9, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: '#8f3f36' });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 1.1, 0);
    roof.rotation.y = Math.PI / 4;
    this.houseMesh.add(roof);

    // Target-tile reticle
    const reticleGeo = new THREE.RingGeometry(0.38, 0.48, 4);
    reticleGeo.rotateX(-Math.PI / 2);
    reticleGeo.rotateY(Math.PI / 4);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: '#ffe47a',
      side: THREE.DoubleSide
    });
    this.reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    this.reticleMesh.position.set(4, 0.02, 7);
    this.scene.add(this.reticleMesh);
  }

  setReticle(x, y) {
    if (this.reticleMesh) {
      this.reticleMesh.position.set(x, 0.02, y);
    }
  }
}
