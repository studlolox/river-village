import { Player } from './player.js';
import { getRegionDef } from './region.js';
import { ForageManager } from './forage.js';
import { DebrisManager } from './debris.js';
import { nextSeason } from './season.js';

/**
 * World state managing regions, warps, forage, and debris across River Village.
 */
export class World {
  constructor(player = null, holding = null, initialRegion = 'RiverVillage') {
    this.player = player || new Player({ x: 12, y: 10 });
    this.holding = holding;
    this.currentRegion = initialRegion;
    this.season = 'Spring';
    this.forage = new ForageManager();
    this.debris = new DebrisManager();
    this.debris.respawn();
    this.forage.respawn(this.season);
  }

  setRegion(regionName) {
    this.currentRegion = regionName;
    if (this.player) {
      this.player.location = regionName;
    }
  }

  update() {
    const def = getRegionDef(this.currentRegion);
    if (!def || !def.warps) return;
    const { x, y } = this.player.gridPos;
    const warp = def.warps.find((w) => w.x === x && w.y === y);
    if (warp) {
      this.currentRegion = warp.targetRegion;
      this.player.location = warp.targetRegion;
      this.player.gridPos = { x: warp.targetX, y: warp.targetY };
    }
  }

  addForage(x, y, kind) {
    this.forage.add(x, y, kind);
  }

  forageAt(x, y) {
    return this.forage.at(x, y);
  }

  addTree(x, y) {
    this.debris.addTree(x, y);
  }

  treeAt(x, y) {
    return this.debris.treeAt(x, y);
  }

  clearAllDebris() {
    this.debris.clearAll();
    this.forage.clear();
  }

  advanceSeason() {
    this.season = nextSeason(this.season);
    this.debris.respawn();
    this.forage.respawn(this.season);
  }

  countDebris() {
    return this.debris.count();
  }

  countForage() {
    return this.forage.count();
  }
}
