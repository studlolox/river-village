import * as THREE from 'three';

const TILE_COLORS = {
  grass: 0x4f8c5a,
  tillable: 0x8b6743,
  tilled: 0x5d4026,
  tree: 0x2c5c34,
  cottage: 0xb8764f,
};

/**
 * Renders the grid map using InstancedMesh, plus the player mesh and target-tile reticle.
 */
export class TileRenderer {
  constructor(threeScene, holdingMap) {
    this.scene = threeScene;
    this.map = holdingMap;

    const total = holdingMap.width * holdingMap.height;
    const geom = new THREE.BoxGeometry(0.96, 0.2, 0.96);
    const mat = new THREE.MeshLambertMaterial();
    this.tileMesh = new THREE.InstancedMesh(geom, mat, total);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let idx = 0;
    for (let y = 0; y < holdingMap.height; y++) {
      for (let x = 0; x < holdingMap.width; x++) {
        const tile = holdingMap.tileAt(x, y);
        dummy.position.set(x, 0, y);
        dummy.updateMatrix();
        this.tileMesh.setMatrixAt(idx, dummy.matrix);
        color.setHex(TILE_COLORS[tile.kind] || TILE_COLORS.grass);
        this.tileMesh.setColorAt(idx, color);
        idx++;
      }
    }
    this.tileMesh.instanceMatrix.needsUpdate = true;
    if (this.tileMesh.instanceColor) this.tileMesh.instanceColor.needsUpdate = true;
    this.scene.add(this.tileMesh);

    const playerGeom = new THREE.CylinderGeometry(0.28, 0.34, 0.9, 12);
    const playerMat = new THREE.MeshLambertMaterial({ color: 0x3c7a57 });
    this.playerMesh = new THREE.Mesh(playerGeom, playerMat);
    this.playerMesh.position.set(11, 0.55, 6);
    this.scene.add(this.playerMesh);

    const reticleGeom = new THREE.RingGeometry(0.32, 0.44, 4);
    reticleGeom.rotateX(-Math.PI / 2);
    reticleGeom.rotateY(Math.PI / 4);
    const reticleMat = new THREE.MeshBasicMaterial({ color: 0xf4cf6d, side: THREE.DoubleSide });
    this.reticle = new THREE.Mesh(reticleGeom, reticleMat);
    this.reticle.position.set(11, 0.13, 7);
    this.scene.add(this.reticle);
  }

  syncPlayer(player, outfitColor = '#3c7a57') {
    this.playerMesh.position.set(player.gridPos.x, 0.55, player.gridPos.y);
    this.playerMesh.material.color.set(outfitColor);
    const t = player.targetTile();
    this.reticle.position.set(t.x, 0.13, t.y);
  }
}
